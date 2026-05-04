import os
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import NullPool
from passlib.context import CryptContext
from jose import JWTError, jwt

# --- CONFIGURATION ---
SECRET_KEY = os.getenv("JWT_SECRET", "fallback-secret-for-debugging")
ALGORITHM = "HS256"

# Vercel/Supabase may set the URL under different env var names
raw_url = (
    os.getenv("POSTGRES_URL")
    or os.getenv("DATABASE_URL")
    or os.getenv("POSTGRES_URL_NON_POOLING")
)

if not raw_url:
    print("CRITICAL: No database URL found in environment!")
    DATABASE_URL = "sqlite:///./test.db"
else:
    # Fix the postgres:// prefix for SQLAlchemy (requires postgresql://)
    DATABASE_URL = raw_url.replace("postgres://", "postgresql://", 1)
    # Supabase requires SSL — append sslmode if not already present
    if "sslmode" not in DATABASE_URL:
        separator = "&" if "?" in DATABASE_URL else "?"
        DATABASE_URL += f"{separator}sslmode=require"

ACCESS_TOKEN_EXPIRE_MINUTES = 26280000  # ~50 years

# --- DB SETUP ---
engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool,  # Serverless: fresh connection per request, no pool
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/token")

# --- SQLALCHEMY MODELS (Database Structure) ---
class Laundry(Base):
    __tablename__ = "laundries"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String)
    status = Column(String)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Staff(Base):
    __tablename__ = "staff"
    username = Column(String, primary_key=True)
    hashed_password = Column(String)

# --- PYDANTIC SCHEMAS (Data Filtering) ---
# This is what the Public User sees
class PublicBagResponse(BaseModel):
    id: int
    status: str

    class Config:
        from_attributes = True

# This is what the Staff sees
class StaffBagResponse(BaseModel):
    id: int
    name: str
    phone: str
    status: str
    updated_at: datetime

    class Config:
        from_attributes = True

# --- DEPENDENCIES ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_staff(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None: raise HTTPException(status_code=401)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Session")
    
    user = db.query(Staff).filter(Staff.username == username).first()
    if user is None: raise HTTPException(status_code=401)
    return user

# --- APP ---
app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auto-create tables on startup
@app.on_event("startup")
def on_startup():
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"WARNING: Could not create tables on startup: {e}")

# Health check — useful for verifying Supabase connection
@app.get("/api/health")
def health_check():
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}

# Debug: show which env vars are present (no values exposed)
@app.get("/api/debug")
def debug_env():
    return {
        "POSTGRES_URL": bool(os.getenv("POSTGRES_URL")),
        "DATABASE_URL": bool(os.getenv("DATABASE_URL")),
        "POSTGRES_URL_NON_POOLING": bool(os.getenv("POSTGRES_URL_NON_POOLING")),
        "JWT_SECRET": bool(os.getenv("JWT_SECRET")),
        "resolved_db_url_prefix": DATABASE_URL[:30] + "..." if len(DATABASE_URL) > 30 else DATABASE_URL,
    }

# --- ENDPOINTS ---

# 1. PUBLIC: Track Bag (Limited Data: ID and Status ONLY)
@app.get("/api/laundry/{bag_id}", response_model=PublicBagResponse)
def get_status_public(bag_id: int, db: Session = Depends(get_db)):
    bag = db.query(Laundry).filter(Laundry.id == bag_id).first()
    if not bag: 
        raise HTTPException(status_code=404, detail="Bag not found")
    return bag # FastAPI automatically filters this through PublicBagResponse

# 2. STAFF: Login
@app.post("/api/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(Staff).filter(Staff.username == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    token = jwt.encode({"sub": user.username}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

# 3. STAFF: Get One Bag (Full Data: Name, Phone, Status, Time)
@app.get("/api/staff/laundry/{bag_id}", response_model=StaffBagResponse)
def get_bag_staff(bag_id: int, db: Session = Depends(get_db), staff=Depends(get_current_staff)):
    bag = db.query(Laundry).filter(Laundry.id == bag_id).first()
    if not bag: raise HTTPException(status_code=404)
    return bag

# 4. STAFF: Get All Bags (Full Data List)
@app.get("/api/staff/all", response_model=List[StaffBagResponse])
def get_all_staff(db: Session = Depends(get_db), staff=Depends(get_current_staff)):
    return db.query(Laundry).order_by(Laundry.updated_at.desc()).all()

# 5. STAFF: Add New Bag
@app.post("/api/staff/add")
def add_bag(id: int, name: str, phone: str, db: Session = Depends(get_db), staff=Depends(get_current_staff)):
    new_bag = Laundry(id=id, name=name, phone=phone)
    db.add(new_bag)
    db.commit()
    return {"message": "Success"}

# 6. STAFF: Update Status
@app.patch("/api/staff/update/{bag_id}")
def update_status(bag_id: int, status: str, db: Session = Depends(get_db), staff=Depends(get_current_staff)):
    bag = db.query(Laundry).filter(Laundry.id == bag_id).first()
    if not bag: raise HTTPException(status_code=404)
    bag.status = status
    db.commit()
    return {"message": "Updated"}
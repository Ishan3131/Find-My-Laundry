import os
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from jose import JWTError, jwt

# --- CONFIGURATION ---
raw_url = os.getenv("POSTGRES_URL")
if raw_url and raw_url.startswith("postgres://"):
    DATABASE_URL = raw_url.replace("postgres://", "postgresql://", 1)
else:
    DATABASE_URL = raw_url

SECRET_KEY = os.getenv("JWT_SECRET") 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 26280000 # ~50 years

# --- DB SETUP ---
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
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
    status = Column(String, default="Received")
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
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

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
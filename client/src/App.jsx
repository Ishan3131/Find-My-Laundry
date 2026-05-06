import { BrowserRouter, Routes, Route } from 'react-router'
import LoginPage from './pages/LoginPage'
import StaffPage from './pages/StaffPage'
import UserPage from './pages/UserPage'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<UserPage/>} />
        <Route path='/staff' element={<StaffPage />} />
        <Route path='login' element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
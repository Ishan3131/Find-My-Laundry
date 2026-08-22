import { BrowserRouter, Routes, Route } from 'react-router'
import { useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage'
import StaffPage from './pages/StaffPage'
import UserPage from './pages/UserPage'

function App() {
  const [lightTheme, setLightTheme] = useState(null)
  const baseURL = 'https://Find-My-Laundry.vercel.app';

  useEffect(() => {
    let isLightTheme = JSON.parse(localStorage.getItem('lightTheme'))
    if(isLightTheme === null){
      isLightTheme = true
      localStorage.setItem('lightTheme', JSON.stringify(true))
    }
    setLightTheme(isLightTheme)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<UserPage lightTheme={lightTheme} setLightTheme={setLightTheme} base={baseURL} />} />
        <Route path='/staff' element={<StaffPage lightTheme={lightTheme} setLightTheme={setLightTheme} base={baseURL} />} />
        <Route path='login' element={<LoginPage lightTheme={lightTheme} setLightTheme={setLightTheme} base={baseURL} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
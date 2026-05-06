import { BrowserRouter, Routes, Route } from 'react-router'
import { useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage'
import StaffPage from './pages/StaffPage'
import UserPage from './pages/UserPage'

function App() {
  const [lightTheme, setLightTheme] = useState(true)

  useEffect(() => {
    let isLightTheme = JSON.parse(localStorage.getItem('lightTheme'))
    if(isLightTheme === null) isLightTheme = true
    setLightTheme(isLightTheme)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<UserPage lightTheme={lightTheme} setLightTheme={setLightTheme} />} />
        <Route path='/staff' element={<StaffPage lightTheme={lightTheme} setLightTheme={setLightTheme} />} />
        <Route path='login' element={<LoginPage lightTheme={lightTheme} setLightTheme={setLightTheme} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import Admin from './Pages/Admin/Admin'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './Pages/LoginPanel/LoginPanel'
import { useEffect } from 'react'

const App = () => {
  const navigate = useNavigate()
  const link = process.env.REACT_APP_API

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      navigate('/login')
    } else {
      // fetch('https://localhost:4000/validateToken', {
      fetch(`${link}/validateToken`, {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': token,
          'Content-Type': 'application/json',
        },
      }).then((response) => response.json())
        .then((data) => {
          if (!data.success) {
            navigate('/login')
          }
        })
        .catch((error) => {
          console.error('Error: ', error)
          navigate('/login')
        })
    }
  }, [navigate])

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/*' element={<Admin />} />
      </Routes>
    </div>
  )
}

export default App
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ redirectPath = "/login", redirectTo = "/admin/dashboard" }) => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    console.log(token)
    if (!token) {
      navigate(redirectPath)
      console.log('tidak ada token')
    } else {
      async function fetchData() {
        await fetch('http://localhost:4000/validateToken', {
          method: 'POST',
          headers: {
            Accept: 'application/form-data',
            'auth-token': token,
            'Content-Type': 'application/json',
          },
        }).then((response) => response.json())
          .then((data) => {
            console.log(data)
            if (!data.success) {
              navigate(redirectPath)
            }
            setIsAuthenticated(true)
          })
          .catch((error) => {
            console.error('Error: ', error)
            navigate(redirectPath)
          })
      }

      fetchData()
    }
  }, [navigate])
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;
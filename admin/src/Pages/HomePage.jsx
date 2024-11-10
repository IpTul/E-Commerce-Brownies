import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


function HomePage() {
  const navigate = useNavigate()
  useEffect(() => {
    navigate("/admin/dashboard")
  }, [])

  return (
    <div>
    </div>
  )
}

export default HomePage

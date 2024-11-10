import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPanel.css'

const LoginPanel = () => {
  const navigate = useNavigate()
  const [state, setState] = useState("Login")
  const [formData, setFormData] = useState({
    password: "",
    email: ""
  })

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    console.log(token)
    if (token) {
      navigate("/admin/dashboard")
    }
  }, [navigate])

  const adminlogin = async () => {
    await fetch('http://localhost:4000/adminlogin', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response) => response.json()).then((data) => {
      if (data?.token) {
        console.log("ini token", data)
        localStorage.setItem('auth-token', data.token);
        navigate("/admin/dashboard")
      } else {
        alert("Login Error")
      }
    })
  }

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>ADMIN LOGIN</h1>
        <div className="loginsignup-fields">
          {/* <input type="text" name="username" /> */}
          <input type="email" name="email" value={formData.email} onChange={changeHandler} />
          <input type="password" name="password" value={formData.password} onChange={changeHandler} />
          <button onClick={() => adminlogin()} >SUBMIT</button>
        </div>
      </div>
    </div>
  )
}

export default LoginPanel
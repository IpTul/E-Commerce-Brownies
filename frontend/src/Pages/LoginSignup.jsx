import React, { useState } from 'react'
import './css/LoginSignup.css'
import Swal from 'sweetalert2'

const LoginSignup = () => {

  const [state, setState] = useState("Login")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  })
  const [isChecked, setIsChecked] = useState(false)

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  const login = async () => {
    if (!isChecked) {
      Swal.fire({
        icon: 'warning',
        title: 'Terms Agreement',
        text: 'Please agree to the terms of use & privacy policy before logging in.',
      })
      return
    }
    console.log("Login", formData)
    let responseData
    await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response) => response.json()).then((data) => responseData = data)

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token)
      window.location.replace("/")
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: responseData.errors,
      });
    }
  }

  const signup = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Information',
        text: 'Please fill in all fields before signing up.',
      })
      return
    }

    if (formData.password.length < 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Too Short',
        text: 'Password must be at least 8 characters long.',
      })
      return
    }

    console.log("Sign Up", formData)
    let responseData
    await fetch('http://localhost:4000/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response) => response.json()).then((data) => responseData = data)

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token)
      window.location.replace("/")
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Sign Up Failed',
        text: responseData.errors,
      });
    }
  }

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" ? <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder="Your Name" id="" /> : <></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder="Email Address" id="" />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder="Password" id="" />
        </div>
        <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>
        {state === "Sign Up" ?
          <p className="loginsignup-login">Already have an account? <span onClick={() => { setState("Login") }}>Login</span></p> :
          <p className="loginsignup-login">Create an account? <span onClick={() => { setState("Sign Up") }}>Click Here</span></p>
        }
        <div className="loginsignup-agree">
          <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup
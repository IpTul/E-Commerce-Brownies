import React from 'react'
import './Navbar.css'
import navProfile from '../../assets/nav-profile.png'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='navbar2'>
      <Link to={"/admin/dashboard"} style={{ textDecoration: "none" }}>
        <div className="nav-logo-head">
          <p>ADMIN PANEL</p>
        </div>
      </Link>
      <div className="btn-right">
        {localStorage.getItem('auth-token') ?
          <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/') }} >Logout</button> : <hr />
        }
        <img src={navProfile} className='nav-profile' alt="" />
      </div>
    </div>
  )
}

export default Navbar
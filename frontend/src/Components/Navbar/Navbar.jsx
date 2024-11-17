import React, { useState, useContext } from 'react'
import './Navbar.css'
import { Link, NavLink } from 'react-router-dom'
import Swal from 'sweetalert2'

import logo from '../Assets/brownies.png'
import cart_icon from '../Assets/cart.png'
import { ShopContext } from '../../Context/ShopContext'

const Navbar = () => {

  const [menu, setMenu] = useState("home");
  const { getTotalCartItems } = useContext(ShopContext)

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'No, keep me logged in'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('auth-token');
        window.location.replace('/');
      }
    });
  };

  return (
    <div className="navbar">
      <ul className="nav-menu" >
        <div className="profile">
          {localStorage.getItem('auth-token') ? <Link to='/profile'><i className='fa fa-user' alt="cart_icon" /></Link> : <Link to='/login'><i className='fa fa-user' alt="cart_icon" /></Link>
          }
        </div>
        <li><NavLink className='nav-menu-link' to='/' activeClassName='active'>HOME</NavLink></li>
        <span className='circle'></span>
        <li><NavLink className='nav-menu-link' to='/brownies' activeClassName='active'>BROWNIES</NavLink></li>
        <div className="nav-logo">
          <NavLink to="/"><img src={logo} alt="logo" /></NavLink>
        </div>
        <li><NavLink className='nav-menu-link' to='/cookies' activeClassName='active'>COOKIES</NavLink></li>
        <span className='circle'></span>
        {localStorage.getItem('auth-token') ?
          <li onClick={handleLogout} className='nav-menu-link'>LOGOUT</li> :
          <Link className='nav-menu-link' to='/login'>LOGIN</Link>
        }
        <div className="nav-login-cart" >
          {localStorage.getItem('auth-token') ? <Link to='/cart'><img src={cart_icon} alt="cart_icon" /></Link> : <Link to='/login'><img src={cart_icon} alt="cart_icon" /></Link>}
          {localStorage.getItem('auth-token') ? <div className="nav-cart-count">{getTotalCartItems()}</div> : <></>}
        </div>
      </ul >
    </div>
  )
}

export default Navbar

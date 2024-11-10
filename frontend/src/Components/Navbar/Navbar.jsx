import React, { useState, useEffect, useContext } from 'react'
import './Navbar.css'
import { Link, NavLink } from 'react-router-dom'


import logo from '../Assets/brownies.png'
import cart_icon from '../Assets/cart.png'
import menu_bar from '../Assets/menu.png'
import close_menu_bar from '../Assets/close-menu.png'
import { ShopContext } from '../../Context/ShopContext'

const Navbar = () => {

  const [menu, setMenu] = useState("home");
  const { getTotalCartItems } = useContext(ShopContext)
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  }

  const [prevScrollpos, setPrevScrollpos] = useState(window.pageYOffset);
  const [navbarStyle, setNavbarStyle] = useState({ top: '0px' });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        setNavbarStyle({ top: '0px' });
      } else {
        setNavbarStyle({ top: '-100px' });
      }
      setPrevScrollpos(currentScrollPos);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollpos]);

  return (
    <div className="navbar">
      <ul className="nav-menu" >
        <li onClick={() => { setMenu("home") }}><NavLink className='nav-menu-link' to='/' activeClassName='active'>HOME</NavLink></li>
        <span className='circle'></span>
        <li onClick={() => { setMenu("brownies") }}><NavLink className='nav-menu-link' to='/brownies' activeClassName='active'>BROWNIES</NavLink></li>
        <span className='circle'></span>
        <div className="nav-logo">
          <NavLink to="/"><img src={logo} alt="logo" /></NavLink>
        </div>
        <li onClick={() => { setMenu("cookies") }}><NavLink className='nav-menu-link' to='/cookies' activeClassName='active'>COOKIES</NavLink></li>
        <span className='circle'></span>
        {localStorage.getItem('auth-token') ?
          <li onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/') }} className='nav-menu-link'>LOGOUT</li> :
          <Link className='nav-menu-link' to='/login'>LOGIN</Link>
        }
        <div className="nav-login-cart" >
          <Link to='/cart'><img src={cart_icon} alt="cart_icon" /></Link>
          {localStorage.getItem('auth-token') ? <div className="nav-cart-count">{getTotalCartItems()}</div> : <></>}

          {/* Mobile */}
          <div className="nav-login-account">
            <Link className='nav-menu-link' to='/login'><i className='fa-regular fa-user fa-lg'></i></Link>
          </div>
        </div>
      </ul >
    </div>
  )
}

export default Navbar

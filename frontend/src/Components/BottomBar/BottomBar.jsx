import React, { useState } from 'react'
import './BottomBar.css'
import { Link } from 'react-router-dom'

const BottomBar = () => {

  const [menu, setMenu] = useState("home");

  return (
    <div className='bottom-bar'>
      <div className='bottom-bar-action'>
        <Link style={{ textDecoration: 'none', color: 'black' }} to='/'>
          <i className="fa-solid fa-house"></i>
          <p>Home</p>
        </Link>
      </div>
      <div className='bottom-bar-action'>
        <Link style={{ textDecoration: 'none', color: 'black' }} to='/brownies'>
          <i className="fa-solid fa-cheese"></i>
          <p>Brownies</p>
        </Link>
      </div>
      <div className='bottom-bar-action'>
        <Link style={{ textDecoration: 'none', color: 'black' }} to='/cookies'>
          <i className="fa-solid fa-cookie"></i>
          <p>Cookies</p>
        </Link>
      </div>
      <div className='bottom-bar-action'>
        <Link style={{ textDecoration: 'none', color: 'black' }} to='/about'>
          <i class="fa-solid fa-circle-exclamation"></i>
          <p>About</p>
        </Link>
      </div>
    </div>
  )
}

export default BottomBar

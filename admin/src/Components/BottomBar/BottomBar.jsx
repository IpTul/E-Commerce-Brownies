import React, { useState } from 'react'
import './BottomBar.css'
import { Link } from 'react-router-dom'

const BottomBar = () => {

  const [menu, setMenu] = useState("home")

  return (
    <div className='bottom-bar'>
      <div className='bottom-bar-action'>
        <Link style={{ textDecoration: 'none', color: 'black' }} to='/addproduct'>
          <i className="fa-solid fa-cheese"></i>
          <p>Add Product</p>
        </Link>
      </div>
      <div className='bottom-bar-action'>
        <Link style={{ textDecoration: 'none', color: 'black' }} to='/listproduct'>
          <i className="fa-solid fa-list"></i>
          <p>List Product</p>
        </Link>
      </div>
    </div>
  )
}

export default BottomBar

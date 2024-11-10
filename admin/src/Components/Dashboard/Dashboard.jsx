import React from 'react'
import './Dashboard.css'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className='Dashboard'>
      <h1>Dashboard</h1>
      <div className="menu-display">
        <Link to={"/addproduct"} style={{ textDecoration: "none" }}>
          <div className="menu-field">
            <i className="fa-solid fa-cheese fa-4x"></i>
            <p>Add Product</p>
          </div>
        </Link>
        <Link to={"/listproduct"} style={{ textDecoration: "none" }}>
          <div className="menu-field">
            <i className="fa-solid fa-list fa-4x"></i>
            <p className='desc'>120 Product</p>
            <p>List Product</p>
          </div>
        </Link>
        <Link to={"/promocode"} style={{ textDecoration: "none" }}>
          <div className="menu-field">
            <i className="fa-solid fa-percent fa-4x"></i>
            <p>Add Promo Code</p>
          </div>
        </Link>
        <Link to={"/listpromocode"} style={{ textDecoration: "none" }}>
          <div className="menu-field">
            <i className="fa-solid fa-list fa-4x"></i>
            <p className='desc'>20 Promo Code</p>
            <p>List Promo Code</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
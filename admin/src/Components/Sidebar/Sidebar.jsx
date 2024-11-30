import React from 'react'
import './Sidebar.css'
import logo from '../../assets/brownies.png'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Link to={"/admin/dashboard"} style={{ textDecoration: "none" }}>
        <div className="sidebar-logo">
          <img src={logo} style={{ width: '3vw' }} />
        </div>
      </Link>
      <hr />
      <Link to={"/admin/list-order"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <i className="fa-solid fa-cart-shopping fa-xl"></i>
          <p>Order List</p>
        </div>
      </Link>
      <Link to={"/admin/add-product"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <i className="fa-solid fa-cheese fa-xl"></i>
          <p>Add Product</p>
        </div>
      </Link>
      <Link to={"/admin/listproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <i className="fa-solid fa-list fa-xl"></i>
          <p>Product List</p>
        </div>
      </Link>
    </div>
  )
}

export default Sidebar
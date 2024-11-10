import React from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
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
      <Link to={"/promocode"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <i className="fa-solid fa-percent fa-xl"></i>
          <p>Add Promo Code</p>
        </div>
      </Link>
      <Link to={"/admin/list-promocode"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <i className="fa-solid fa-list fa-xl"></i>
          <p>List Promo Code</p>
        </div>
      </Link>
    </div>
  )
}

export default Sidebar
import React from 'react'
import Sidebar from '../Components/Sidebar/Sidebar'
import BottomBar from '../Components/BottomBar/BottomBar'
import { Outlet } from "react-router-dom";
import Navbar from '../Components/Navbar/Navbar';
import './layout.css'

const Layout = () => {
  return (
    <div className='admin'>
      <Sidebar />
      <Navbar />
      <BottomBar />
      <div className="import">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
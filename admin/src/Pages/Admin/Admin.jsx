import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Dashboard from '../../Components/Dashboard/Dashboard'
import Login from '../LoginPanel/LoginPanel'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import PromoCode from '../../Components/PromoCode/PromoCode'
import ListPromoCode from '../../Components/ListPromoCode/ListPromoCode'
import BottomBar from '../../Components/BottomBar/BottomBar'

const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar />
      <BottomBar />
      <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/addproduct' element={<AddProduct />} />
        <Route path='/listproduct' element={<ListProduct />} />
        <Route path='/promocode' element={<PromoCode />} />
        <Route path='/listpromocode' element={<ListPromoCode />} />
      </Routes>
    </div>
  )
}

export default Admin
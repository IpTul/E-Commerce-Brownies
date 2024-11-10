import React from 'react'
import './Breadcrum.css'
import arrow from '../Assets/right-arrow.png'

const Breadcrum = (props) => {
  const { product } = props
  return (
    <div className='breadcrum'>
      HOME <i className='fa-solid fa-angle-right'></i> {product.category} <i className='fa-solid fa-angle-right'></i> {product.name}
    </div>
  )
}

export default Breadcrum

import React from 'react'
import './Breadcrum.css'

const Breadcrum = (props) => {
  const { product } = props
  if (!product) {
    return <div className='breadcrum'>Loading...</div>;
  }
  return (
    <div className='breadcrum'>
      HOME <i className='fa-solid fa-angle-right'></i> {product.category} <i className='fa-solid fa-angle-right'></i> {product.name}
    </div>
  )
}

export default Breadcrum

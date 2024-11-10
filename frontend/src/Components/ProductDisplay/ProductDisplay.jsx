import React, { useContext, useState } from 'react'
import './ProductDisplay.css'
import star_icon from '../Assets/star-icon.png'
import star_null_icon from '../Assets/star-null-icon.png'
import mines from '../Assets/mines.png'
import plus from '../Assets/plus.png'
import { ShopContext } from '../../Context/ShopContext'

const ProductDisplay = (props) => {
  const { product } = props
  const { addToCart } = useContext(ShopContext)
  const [isOpen, setIsopen] = useState(false)
  const [qty, setQty] = useState(1)

  const test = () => {
    console.log('button')
  }

  const togglePopup = () => {
    setIsopen(!isOpen)
  }

  const add_quantity = () => {
    setQty(prevQty => prevQty + 1)
  }

  const dec_quantity = () => {
    setQty(prevQty => Math.max(prevQty - 1, 1))
  }

  return (
    <div className='productdisplay'>
      <div className="productdisplay-left">
        <div className="productdisplay-img">
          <img className='productdisplay-main-img' src={product.image} alt='Thumbnail' onClick={togglePopup} />
          {isOpen && (
            <div className="popup-img">
              <button className='close-button' onClick={togglePopup}>
                &times;
              </button>
              <img src={product.image} alt='Thumbnail' style={{ width: '400px' }} />
            </div>
          )}
        </div>
      </div>
      <div className="productdisplay-right">
        <div className="productdisplay-head">
          <h1>{product.name}</h1>
          <p className='productdisplay-category'><span>Category : </span>Brownies</p>
        </div>
        <p>Pcs</p>
        <div className="productdisplay-qty">
          <img src={mines} role="button" onClick={dec_quantity} />
          <h1>{qty}</h1>
          <img src={plus} role="button" onClick={add_quantity} />
        </div>
        <div className="productdisplay-desc">
          <h1>Brownies Rasa Cokelat</h1>
        </div>
        <div className="productdisplay-right-price">
          <div className="productdisplay-right-prices">Rp. {product.new_price}</div>
        </div>
        <button onClick={() => { addToCart(product.id, qty) }} >ADD TO CART</button>
      </div>
    </div>
  )
}

export default ProductDisplay

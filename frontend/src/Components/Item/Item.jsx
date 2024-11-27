import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom'

const Item = (props) => {
  return (
    <Link to={`/product/${props.id}`} className='item-head'>
      <div className='item'>
        <img onClick={window.scrollTo(0, 0)} src={props.image} />
        <div className="item-prices">
          <p>{props.name}</p>
          <div className="item-price-new">
            Rp. {props.new_price}
          </div>
          <div className="item-price-old">
            {props.old_price}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Item

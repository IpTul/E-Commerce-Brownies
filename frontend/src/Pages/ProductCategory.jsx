import React, { useContext } from 'react'
import './css/ProductCategory.css'
import { ShopContext } from '../Context/ShopContext'

import dropdown from '../Components/Assets/dropdown.png'
import Item from '../Components/Item/Item'

const ProductCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const browniesCategory = all_product.filter((item) => item.category === "brownies")
  const cookiesCategory = all_product.filter((item) => item.category === "cookies")

  let categoryCount;
  if (props.category === "brownies") {
    categoryCount = browniesCategory.length;
  } else if (props.category === "cookies") {
    categoryCount = cookiesCategory.length;
  } else {
    categoryCount = all_product.length;
  }

  return (
    <div className='shop-category'>
      <div className="shopcategory-indexSort">
        {/* <p>
          <span>Showing 1-{categoryCount} </span>
        </p> */}
        <h4>Showing 1-{categoryCount}</h4>
        <p>out of {categoryCount} products</p>
        {/* <div className="shopcategory-sort">
          <p>Sort by</p>
          <img src={dropdown} alt="dropdown" />
        </div> */}
      </div>
      <div className="shopcategory-products">
        {all_product.map((item, i) => {
          if (props.category === item.category) {
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} />
          } else {
            return null
          }
        })}
      </div>
      {/* <div className="shopcategory-loadmore">
        <p>Explore More</p>
        <i className="fa-solid fa-angle-down"></i>
      </div> */}
    </div>
  )
}

export default ProductCategory

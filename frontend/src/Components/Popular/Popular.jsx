import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Popular.css'
import Item from '../Item/Item'
import arrow1 from '../Assets/arrow-1.png'
import arrow2 from '../Assets/arrow-2.png'
import splash1 from '../Assets/splash1.png'
import splash2 from '../Assets/splash2.png'


const Popular = () => {

  const [popularProducts, setPopularProducts] = useState([])
  const link = process.env.REACT_APP_API

  const handle = () => {
    console.log('link', link)
  }

  // useEffect(() => {
  //   // fetch('http://localhost:4000/popularbrownies')
  //   fetch(`${link}/popularbrownies`)
  //     .then((response) => response.json())
  //     .then((data) => setPopularProducts(data))
  // }, [])

  return (
    <div className='popular'>
      <h1>POPULAR BROWNIES NOW</h1>
      <div className="break">
        <hr />
      </div>
      <div className="popular-content">
        <div className="arrow1">
          <img src={arrow1} alt="" />
        </div>
        <div className="splash1">
          <div className="splas-desc-fields">
            <p className="splash-desc-head">BROWNIES COKELAT</p>
            <p className="splash-desc">Tekstur padat namun lembut, dengan rasa cokelat yang kaya dan manis</p>
          </div>
          <Link className='nav-menu-link' to='/brownies' ><img src={splash1} alt="" /></Link>
        </div>
        <div className="arrow2">
          <img src={arrow2} alt="" />
        </div>
        <div className="splash2">
          <Link className='nav-menu-link' to='/brownies' ><img src={splash2} alt="" /></Link>
          <div className="splas-desc-fields">
            <p className="splash-desc-head">BROWNIES MATCHA</p>
            <p className="splash-desc">Bubuk matcha (teh hijau Jepang) sebagai bahan utama, memberikan rasa unik yang segar dan sedikit pahit khas matcha</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popular

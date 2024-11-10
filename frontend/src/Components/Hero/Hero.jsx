import React, { useState } from 'react'
import './Hero.css'

import wave from '../Assets/wave.png'
import arrow from '../Assets/right-arrow.png'
import new_brownies from '../Assets/new-brownies-shadow.png'
import { Link } from 'react-router-dom'

const Hero = () => {

  const [menu, setMenu] = useState("home");


  return (
    <div className='hero'>
      <div className="hero-left">
        <div>
          <p>New collections for someone</p>
          <p style={{ color: '#FCD441' }}>special</p>
        </div>
        <Link style={{ textDecoration: 'none' }} to='/brownies'>
          <div className="hero-latest-btn">
            <div>Order Now</div>
            <i className='fa-solid fa-angle-right'></i>
            {/* <img src={arrow} alt="new" /> */}
          </div></Link>
      </div>
      <div className="hero-right">
        <img src={new_brownies} alt="new" />
      </div>
    </div>
  )
}

export default Hero

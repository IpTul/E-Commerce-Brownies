import React from 'react'
import './css/About.css'

import logo from '../Components/Assets/brownies.png'

const About = () => {
  return (
    <div className='about'>
      <div className="about-title">
        <img src={logo} alt="" />
        <p>BROWNIES BROWCIOUS</p>
      </div>
      <div className="about-description">
        <p>Brownies Browcious adalah sejenis kue Brownies yang dikenal karena teksturnya yang padat dan rasa cokelat yang kaya. Brownies biasanya dipotong menjadi persegi atau segi empat, dan memiliki lapisan atas yang renyah dengan bagian dalam yang lembut atau sedikit kenyal. Rasanya sangat cokelat dengan sedikit rasa manis yang tidak berlebihan.</p>
        <br />
        <p>Brownies bisa dibuat dalam berbagai variasi, seperti brownies klasik yang hanya menggunakan bahan dasar seperti cokelat, tepung, telur, dan mentega, atau brownies dengan tambahan kacang, cokelat chip, atau lapisan keju. Ada juga brownies yang lebih fudgy, dengan tekstur yang lebih padat dan lembab, atau yang lebih cake-like, dengan tekstur yang lebih ringan dan lebih mirip dengan kue biasa.</p>
        <br />
        <p>Brownies sering disajikan sebagai camilan atau pencuci mulut, dan bisa dinikmati sendiri atau dengan tambahan es krim, saus cokelat, atau taburan gula halus di atasnya.</p>
      </div>
    </div>
  )
}

export default About

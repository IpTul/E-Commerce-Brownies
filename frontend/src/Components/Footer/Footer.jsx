import React from 'react'
import './Footer.css'
import footer_logo from '../Assets/brownies.png'
import ig_logo from '../Assets/instagram.png'
import wa_logo from '../Assets/whatsapp.png'
import footer_head from '../Assets/footer-head.png'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='footer'>
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
      <link href="https://fonts.googleapis.com/css2?family=Praise&display=swap" rel="stylesheet"></link>

      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
      <link href="https://fonts.googleapis.com/css2?family=Rouge+Script&display=swap" rel="stylesheet"></link>

      <div className="footer-head">
        {/* <img src={footer_head} alt="" /> */}
        <h1>Brownies Browcious</h1>
        <h3>Nothing more sweet then our brownies</h3>
        <Link style={{ textDecoration: 'none' }} to='/brownies'><button>Order Now</button></Link>
      </div>
      <div className="footer-bottom">
        <ul className="footer-links">
          <li>About Us</li>
          <li>Products</li>
          <li>Contact</li>
          <li>Alamat</li>
        </ul>
        <div className="footer-social-icon">
          <a href='https://www.instagram.com/browcious_' target='_blank'>
            <div className="footer-icons-container">
              <img src={ig_logo} alt="instagram" />
            </div></a>
          <a href='https://wa.me/+6281257544293' target='_blank'>
            <div className="footer-icons-container">
              <img src={wa_logo} alt="whatsapp" />
            </div>
          </a>
        </div>
        <div className="footer-copyright">
          <hr />
          <p>Copyright @ 2024 - All Right Reserved</p>
        </div>
      </div>
    </div>
  )
}

export default Footer

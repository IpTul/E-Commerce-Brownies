import React, { useContext, useState } from "react"
import "./CartItems.css"
import { ShopContext } from "../../Context/ShopContext"
import { Buffer } from "buffer"
import CryptoJS from "crypto-js"
import { Link } from 'react-router-dom'

const CartItems = () => {
  const { all_product, cartItems, removeFromCart, getCartDetails } =
    useContext(ShopContext)
  const { productIds } = getCartDetails()

  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const subtotal = all_product.reduce((acc, product) => {
    const quantity = cartItems[product.id] || 0
    return acc + product.new_price * quantity
  }, 0)

  const shippingFee = 0
  const total = subtotal - discount + shippingFee

  const [paymentUrl, setPaymentUrl] = useState("")

  const handlePromoCodeSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:4000/validatepromocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode }),
      })
      const data = await response.json()
      if (data.success) {
        setDiscount(data.discount)
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const [nama, setNama] = useState("")
  const [noTelp, setNoTelp] = useState("")
  const [address, setAddress] = useState("")

  const secretKey = process.env.REACT_APP_SECRET

  const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString()
  }

  const handleCheckoutLink = async () => {
    const secret = process.env.REACT_APP_SECRET
    const encodedSecret = Buffer.from(secret).toString("base64")
    const basicAuth = `Basic ${encodedSecret}`

    const orderId = `order-${Date.now()}`
    const encodedOrderId = CryptoJS.AES.encrypt(orderId, "brownies").toString()
    const encodedOrderIdReplaced = encodedOrderId
      .replace("+", "brownies")
      .replace("/", "browcious")
      .replace("=", "samarinda")
    const finalOutput = encodedOrderIdReplaced.substring(0, 30)

    const items = productIds
      .map((id) => {
        const product = all_product.find((p) => p.id === parseInt(id))

        if (product && cartItems[id] > 0) {
          return {
            id: product.id,
            name: product.name,
            category: product.category,
            quantity: cartItems[id],
            price: product.new_price,
            address: address,
          }
        }
        return null
      })
      .filter((item) => item !== null)

    // const customerDetails = {
    //   first_name: nama,
    //   phone: noTelp,
    //   shipping_address: {
    //     first_name: nama,
    //     phone: noTelp,
    //     address: address,
    //   },
    // }

    const customerdetails = {
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "+628123456789",
      billing_address: {
        first_name: "John",
        last_name: "Doe",
        address: "123 Main St",
        city: "Jakarta",
        postal_code: "12160",
        country_code: "ID"
      },
      shipping_address: {
        first_name: "John",
        last_name: "Doe",
        address: "123 Main St",
        city: "Jakarta",
        postal_code: "12160",
        country_code: "ID"
      }
    }

    const data = {
      item_details: items,
      transaction_details: {
        order_id: orderId,
        gross_amount: total,
        customer_details: customerdetails,
      },
    }

    const response = await fetch(
      `${process.env.REACT_APP_API}/v1/payment-links`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: basicAuth,
        },
        body: JSON.stringify(data),
      }
    )

    const paymentLink = await response.json()
    // console.log(paymentLink)
    setPaymentUrl(paymentLink.payment_url)
  }

  return (
    <div className="cartitems">
      <div className="cartitems-container">
        <div className="cartitems-mobile">
          <div className="cartitems-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
          </div>
          <hr />
          <div className="cartitems-mobile-items">
            {all_product.map((product) => {
              const quantity = cartItems[product.id]
              if (quantity > 0) {
                return (
                  <div>
                    <div className="cartitems-format cartitems-format-main">
                      <img
                        src={product.image}
                        alt=""
                        className="cartitems-product-icon"
                      />
                      <p>{product.name}</p>
                      <p>{product.new_price}</p>
                      <button className="cartitems-quantity">
                        {cartItems[product.id]}
                      </button>
                      <p>{product.new_price * cartItems[product.id]}</p>
                      <i
                        className="fa-solid fa-x cartitems-remove-icon"
                        onClick={() => {
                          removeFromCart(product.id)
                        }}></i>
                    </div>
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>

        <div className="cartitems-down">
          <div className="cartitems-total">
            <h1>Cart Totals</h1>
            <div>
              <div className="cartitems-total-item">
                <p>Subtotal</p>
                <p>Rp. {subtotal}</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <p>Shipping Fee</p>
                <p>Free</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <p style={{ color: "red" }}>Discount Promo</p>
                <p style={{ color: "red" }}>Rp. {discount}</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <h3>Total</h3>
                <h3>Rp. {total}</h3>
              </div>
            </div>
            <button onClick={handleCheckoutLink}>PROCEED TO CHECKOUT</button>
            <div className="payment-url">
              <a href={paymentUrl} target="_blank" rel="noopener noreferrer">{paymentUrl}</a>
            </div>
          </div>

          <div className="cartitems-details">
            <p>If you have a promo code, Enter it here</p>
            <div className="cartitems-promobox">
              <input
                type="textbox"
                placeholder="Promo Code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={handlePromoCodeSubmit}>SUBMIT</button>
            </div>
            {/* <div className="cartitems-customersdetails">
            <div className="cartitems-customersdetails-fields">
              <p>Nama</p>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>
            <div className="cartitems-customersdetails-fields">
              <p>No Telp (Aktif Wa)</p>
              <input
                type="number"
                value={noTelp}
                onChange={(e) => setNoTelp(e.target.value)}
              />
            </div>
            <div className="cartitems-customersdetails-fields">
              <p>Alamat</p>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div> */}
          </div>
        </div>
      </div>
    </div >
  )
}

export default CartItems

import React, { useContext, useState } from "react"
import "./CartItems.css"
import { ShopContext } from "../../Context/ShopContext"
import { Buffer } from "buffer"
import Swal from 'sweetalert2';

const CartItems = () => {

  const link = process.env.REACT_APP_API

  const { all_product, cartItems, removeFromCart, getCartDetails, setCartItems, getDefaultCart } =
    useContext(ShopContext)
  const { productIds } = getCartDetails()

  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const subtotal = all_product.reduce((acc, product) => {
    const quantity = cartItems[product.id] || 0
    return acc + product.new_price * quantity
  }, 0)
  const quantity = all_product.map((product) => {
    const qty = cartItems[product.id]
    return qty
  })

  const total = subtotal

  const [paymentUrl, setPaymentUrl] = useState("")

  const handlePromoCodeSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${link}/validatepromocode`, {
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

  const [noTelp, setNoTelp] = useState("")
  const [address, setAddress] = useState("")

  const token = localStorage.getItem('auth-token');

  const handleCheckoutLink = async () => {
    const { value: confirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'No, cancel!',
    })

    if (confirmed) {
      if (!/^\d+$/.test(noTelp)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Phone Number',
          text: 'Please enter a valid phone number (numeric only).',
        })
        return
      }

      const secret = process.env.REACT_APP_SECRET;
      const encodedSecret = Buffer.from(secret).toString("base64");
      const basicAuth = `Basic ${encodedSecret}`;

      const orderId = `order-${Date.now()}`;

      const items = productIds
        .map((id) => {
          const product = all_product.find((p) => p.id === parseInt(id));

          if (product && cartItems[id] > 0) {
            return {
              id: product.id,
              name: product.name,
              category: product.category,
              quantity: cartItems[id],
              price: product.new_price,
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      // const calculatedTotal = items.reduce((acc, item) => {
      //   return acc + (item.price * item.quantity);
      // }, 0);

      // const grossAmount = calculatedTotal + shippingFee - discount;

      // console.log("Calculated Total:", calculatedTotal);
      // console.log("Shipping Fee:", shippingFee);
      // console.log("Discount:", discount);
      // console.log("Gross Amount:", grossAmount);

      const data = {
        item_details: items,
        transaction_details: {
          order_id: orderId,
          gross_amount: total,
        },
      };

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
      setPaymentUrl(paymentLink.payment_url)
      console.log(paymentLink)

      const customer_details = {
        no_telp_customer: noTelp,
        alamat_customer: address,
        products: items,
        total: total,
      }

      if (!noTelp || !address) {
        Swal.fire({
          icon: 'warning',
          title: 'Please fill in all required fields.',
        })
      } else {
        const response2 = await fetch("http://localhost:4000/createcheckout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify(customer_details),
        });

        const checkoutResponse = await response2.json();
        if (checkoutResponse.success) {
          console.log("Checkout successful:", checkoutResponse);
          setCartItems(getDefaultCart());
        } else {
          console.error("Checkout failed:", checkoutResponse);
        }
      }
    }
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
                <p>Quantity</p>
                {all_product.map((product) => {
                  const quantity = cartItems[product.id]
                  if (quantity > 0) {
                    return (
                      <div>
                        <p>{cartItems[product.id]}</p>
                      </div>
                    )
                  }
                })}
              </div>
              <hr />
              <div className="cartitems-total-item">
                <h3>Total</h3>
                <h3>Rp. {total}</h3>
              </div>
            </div>
            <button onClick={handleCheckoutLink}>PROCEED TO CHECKOUT</button>
            <div className="payment-url">
              {paymentUrl && noTelp && address ? (
                <a href={paymentUrl} target="_blank" rel="noopener noreferrer">Payment Link</a>
              ) : null}
            </div>
          </div>

          <div className="cartitems-details">
            <div className="cartitems-customersdetails">
              <div className="cartitems-customersdetails-fields">
                <p>No Telp (Aktif Wa)</p>
                <input
                  name="notelp"
                  type="text"
                  value={noTelp}
                  onChange={(e) => setNoTelp(e.target.value)}
                  maxLength={13}
                />
              </div>
              <div className="cartitems-customersdetails-fields">
                <p>Alamat</p>
                <input
                  name="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default CartItems

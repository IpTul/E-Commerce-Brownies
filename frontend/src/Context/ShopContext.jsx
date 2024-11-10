import React, { createContext, useEffect, useState } from 'react'

export const ShopContext = createContext(null)

const getDefaultCart = () => {
  let cart = {}
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0
  }
  return cart
}

const ShopContextProvider = (props) => {

  const [all_product, setAll_product] = useState([])
  const [cartItems, setCartItems] = useState(getDefaultCart())
  const [productCount, setProductCount] = useState(0)

  useEffect(() => {
    fetch('http://localhost:4000/allproducts')
      .then((response) => response.json())
      .then((data) => {
        setAll_product(data.products)
        setProductCount(data.totalCount)
      })

    if (localStorage.getItem('auth-token')) {
      fetch('http://localhost:4000/getcart', {
        method: 'POST',
        headers: {
          Accpet: 'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: "",
      }).then((response) => response.json())
        .then((data) => setCartItems(data))
    }
  }, [])

  const addToCart = (itemId, quantity) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + quantity }))
    if (localStorage.getItem('auth-token')) {
      fetch('http://localhost:4000/addtocart', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "itemId": itemId, "quantity": quantity })
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
    }
  }

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
    if (localStorage.getItem('auth-token')) {
      fetch('http://localhost:4000/removefromcart', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "itemId": itemId })
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
    }
  }

  const getTotalCartItems = () => {
    let totalItem = 0
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item]
      }
    }
    return totalItem
  }

  const getCartDetails = () => {
    let totalQuantity = 0
    let productIds = []

    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        totalQuantity += cartItems[itemId]
        productIds.push(itemId)
      }
    }

    return { totalQuantity, productIds }
  }

  const contextValue = { all_product, productCount, cartItems, addToCart, removeFromCart, getTotalCartItems, getCartDetails }

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider
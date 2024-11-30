import React, { createContext, useEffect, useState } from 'react'

export const ShopContext = createContext(null)

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0; // Initialize cart items to 0
  }
  return cart;
};

const ShopContextProvider = (props) => {

  const link = process.env.REACT_APP_API

  const [all_product, setAll_product] = useState([])
  const [cartItems, setCartItems] = useState(getDefaultCart())
  const [productCount, setProductCount] = useState(0)

  useEffect(() => {
    fetch(`${link}/allproducts`)
      .then((response) => response.json())
      .then((data) => {
        setAll_product(data.products)
        setProductCount(data.totalCount)
        console.log(data.products);
      })

    if (localStorage.getItem('auth-token')) {
      fetch(`${link}/getcart`, {
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
      fetch(`${link}/addtocart`, {
        method: 'POST',
        headers: {
          Accept: 'application/form-data', // Mongo
          // Accept: 'text/plain',
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
      fetch(`${link}/removefromcart`, {
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

  // ================= For MongoDB =================
  const getTotalCartItems = () => {
    let totalItem = 0;
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

  const contextValue = { all_product, productCount, cartItems, addToCart, removeFromCart, getTotalCartItems, getCartDetails, setCartItems, getDefaultCart }

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider
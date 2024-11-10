import React, { useEffect, useState } from 'react'
import './ListProduct.css'

const ListProduct = () => {

  const [allProducts, setAllProducts] = useState([])

  const fetchInfo = async () => {
    await fetch('http://localhost:4000/allproducts')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.products)) {
          setAllProducts(data.products)
        } else {
          console.error('Expected an array but got:', data)
          setAllProducts([])
        }
      })
      .catch((error) => console.error('Error fetching products:', error))
  }

  useEffect(() => {
    fetchInfo()
  }, [])

  const remove_product = async (id) => {
    await fetch('http://localhost:4000/removeproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id })
    }).then((resp) => resp.json()).then((data) => {
      data.success ? alert("Product Removed") : alert("Failed")
    })
    await fetchInfo()
  }

  const [filterCategory, setFilterCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredProducts = Array.isArray(allProducts) ? allProducts.filter((product) => {
    if (filterCategory === 'all') {
      return product.name.toLowerCase().includes(searchTerm.toLowerCase())
    } else {
      return product.category === filterCategory && product.name.toLowerCase().includes(searchTerm.toLowerCase())
    }
  }) : []

  return (
    <div className='list-product'>
      <h1>All Product List</h1>
      <div className="filter-options">
        <select value={filterCategory} onChange={handleFilterChange} className="filter-dropdown">
          <option value="all">All</option>
          <option value="brownies">Brownies</option>
          <option value="cookies">Cookies</option>
        </select>
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search products"
          className="search-input"
        />
      </div>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {filteredProducts.map((products, index) => {
          return <>
            <div key={index} className="listproduct-format-main listproduct-format">
              <img src={products.image} alt="" className="listproduct-product-icon" />
              <p>{products.name}</p>
              <p>Rp. {products.old_price}</p>
              <p>Rp. {products.new_price}</p>
              <p>{products.category}</p>
              <div className="listproduct-remove-icon" onClick={() => { remove_product(product.id) }}>
                <i className="fa-solid fa-xmark"></i>
              </div>
            </div>
          </>
        })}
        <hr />
      </div>
    </div>
  )
}

export default ListProduct
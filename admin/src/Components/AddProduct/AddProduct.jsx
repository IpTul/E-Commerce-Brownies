import React, { useState } from 'react'
import './AddProduct.css'
import uploadArea from '../../assets/upload-area.png'

const AddProduct = () => {

  const [image, setImage] = useState(false)
  const imageHandler = (e) => {
    setImage(e.target.files[0])
  }

  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "brownies",
    old_price: "",
    new_price: "",
  })

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value })
  }

  const add_product = async () => {
    console.log(productDetails)
    let responseData
    let product = productDetails

    let formData = new FormData()
    formData.append('product', image)

    await fetch('http://localhost:4000/upload', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    }).then((resp) => resp.json()).then((data) => { responseData = data })

    if (responseData.success) {
      product.image = responseData.image_url
      console.log(product)

      await fetch('http://localhost:4000/addproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      }).then((resp) => resp.json()).then((data) => {
        data.success ? alert("Product Added") : alert("Failed")
      })
    }
  }

  return (
    <div className='add-product'>
      <button onClick={() => { add_product() }} className='addproduct-btn-mobile'>ADD</button>
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
      </div>
      <div className="addproduct-price">
        {/* <div className="addproduct-itemfield">
          <p>Product Price</p>
          <input value={productDetails.old_price} onChange={changeHandler} type="number" name='old_price' placeholder='Type here' inputMode='numeric' />
        </div> */}
        <div className="addproduct-itemfield">
          <p>Product Offer Price</p>
          <input value={productDetails.new_price} onChange={changeHandler} type="number" name='new_price' placeholder='Type here' />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className="add-product-selector">
          <option value="brownies">Brownies</option>
          <option value="cookies">Cookies</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img src={image ? URL.createObjectURL(image) : uploadArea} className='addproduct-thumbnail-img' />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
      </div>
      <button onClick={() => { add_product() }} className='addproduct-btn'>ADD</button>
    </div>
  )
}

export default AddProduct
import React, { useState } from 'react'
import './AddProduct.css'
import uploadArea from '../../assets/upload-area.png'
import Swal from 'sweetalert2'

const AddProduct = () => {

  const [image, setImage] = useState(false)
  const imageHandler = (e) => {
    setImage(e.target.files[0])
  }

  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "brownies",
    old_price: 10,
    new_price: "",
  })

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value })
  }

  const add_product = async () => {
    console.log(productDetails);
    let responseData;
    let product = productDetails;

    let formData = new FormData();
    formData.append('product', image);

    // Show confirmation alert before proceeding with the upload
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to add this product?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    });

    if (confirmResult.isConfirmed) {
      // Proceed with image upload
      await fetch('http://localhost:4000/upload', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      })
        .then((resp) => resp.json())
        .then((data) => { responseData = data });

      if (responseData.success) {
        product.image = responseData.image_url;
        console.log(product);

        // Add the product
        await fetch('http://localhost:4000/addproduct', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        })
          .then((resp) => resp.json())
          .then((data) => {
            if (data.success) {
              // Show success message
              Swal.fire({
                title: 'Success!',
                text: 'Product Added Successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
              });
              window.location.reload();
            } else {
              // Show failure alert
              Swal.fire({
                title: 'Failed!',
                text: 'Failed to add the product. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          })
          .catch((error) => {
            console.error('Error adding product', error);
            Swal.fire({
              title: 'Error!',
              text: 'Something went wrong. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          });
      } else {
        // Handle image upload failure
        Swal.fire({
          title: 'Error!',
          text: 'Failed to upload image. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } else {
      // User canceled the action
      Swal.fire({
        title: 'Cancelled',
        text: 'Product addition has been cancelled.',
        icon: 'info',
        confirmButtonText: 'OK'
      });
    }
  }

  return (
    <div className="container">
      <div className='container-content'>
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
    </div>
  )
}

export default AddProduct
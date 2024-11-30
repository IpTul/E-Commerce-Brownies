import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import Swal from 'sweetalert2'

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const [selectedProduct, setSelectedProduct] = useState(null); // State for the selected product
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [editProduct, setEditProduct] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [imageFile, setImageFile] = useState(null)

  const fetchInfo = async () => {
    await fetch('http://localhost:4000/allproducts')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.products)) {
          setAllProducts(data.products);
        } else {
          console.error('Expected an array but got:', data);
          setAllProducts([]);
        }
      })
      .catch((error) => console.error('Error fetching products:', error));
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id) => {
    // Show confirmation dialog first
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'Cancel!',
    });

    // If the user confirmed, proceed with the removal
    if (result.isConfirmed) {
      try {
        const response = await fetch('http://localhost:4000/removeproduct', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id }),
        });

        const data = await response.json();

        if (data.success) {
          Swal.fire({
            title: 'Product Removed!',
            icon: 'success',
          });
        } else {
          Swal.fire({
            title: 'Failed!',
            text: 'Could not remove the product.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        console.error('Error removing product', error);
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }

      await fetchInfo();
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    let formData = new FormData();
    formData.append('product', imageFile); // Append the new image file if available
    formData.append('id', editProduct.id);
    formData.append('name', editProduct.name);
    formData.append('category', editProduct.category);
    formData.append('new_price', editProduct.new_price);

    await fetch('http://localhost:4000/updateproduct', {
      method: 'POST',
      body: formData,
    }).then((resp) => resp.json())
      .then((data) => {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes!',
          cancelButtonText: 'Cancel!',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: 'Product Updated!',
              icon: "success",
            })
            fetchInfo();
            closeEditModal();
          }
        })
      }).catch((error) => {
        console.error('Error updating order', error);
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      })
  };

  const Products = allProducts.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setImageFile(null); // Reset image file state
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditProduct(null);
    setShowEditModal(false);
  };

  return (
    <div className="container">
      <div className="container-content">
        <h1>Product List</h1>
        <table className="product-content">
          <thead>
            <tr>
              <th style={{ width: '1vw' }}>No</th>
              <th>Image</th>
              <th>Products</th>
              <th>Price</th>
              <th>Category</th>
              <th style={{ width: '1vw' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {Products.map((product, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1 + currentPage * itemsPerPage}</td>
                  <td><img src={product.image} style={{ width: '4vw' }} alt={product.name} /></td>
                  <td>{product.name}</td>
                  <td>{product.new_price}</td>
                  <td>{product.category}</td>
                  <td>
                    <button onClick={() => openModal(product)}>View</button>
                    <button onClick={() => openEditModal(product)}>Edit</button>
                    <button onClick={() => remove_product(product.id)}>Hapus</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 0} style={{ marginRight: '1rem' }}>Previous</button>
          <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>Next</button>
        </div>

        {/* Modal for viewing product details */}
        {showModal && (
          <div className="modal-overlay-product">
            <div className="modal-content-product">
              <h2>{selectedProduct.name}</h2>
              <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '250px' }} />
              <p>Price : {selectedProduct.new_price}</p>
              <p>Category : {selectedProduct.category}</p>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="modal-overlay-product">
            <div className="modal-content-product">
              <h2>Edit Product</h2>
              <form onSubmit={handleEditSubmit}>
                <p>Products</p>
                <input type="text" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
                <p>Image</p>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                <p>Category</p>
                <input type="text" value={editProduct.category} onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })} />
                <p>Price</p>
                <input type="number" value={editProduct.new_price} onChange={(e) => setEditProduct({ ...editProduct, new_price: e.target.value })} />
                <button type="submit">Update</button>
                <button type="button" onClick={closeEditModal}>Cancel</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListProduct;
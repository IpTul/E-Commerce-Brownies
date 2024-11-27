import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import './Dashboard.css';

const Dashboard = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // State for current page
  const itemsPerPage = 8; // Number of items to display per page
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [error, setError] = useState(null);

  const fetchInfo = async () => {
    await fetch('http://localhost:4000/getorders2')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.checkouts)) {
          setAllOrders(data.checkouts);
        } else {
          console.error('Invalid', data);
          setAllOrders([]);
        }
      })
      .catch((error) => console.error('Error fetching orders', error));
  };

  const fetchTotalOrders = async () => {
    try {
      const response = await fetch('http://localhost:4000/total-checkouts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setTotalOrders(data.totalCheckouts);
    } catch (error) {
      console.error('Error fetching total orders:', error);
      setError(error.message);
    }
  };

  const fetchTotalProducts = async () => {
    try {
      const response = await fetch('http://localhost:4000/total-products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setTotalProducts(data.totalProducts);
    } catch (error) {
      console.error('Error fetching total orders:', error);
      setError(error.message);
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/total-users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setTotalUsers(data.totalUsers);
    } catch (error) {
      console.error('Error fetching total orders:', error);
      setError(error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  useEffect(() => {
    fetchInfo();
    fetchTotalOrders();
    fetchTotalProducts();
    fetchTotalUsers();
  }, []);

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const remove_product = async (id) => {
    await fetch('http://localhost:4000/removeorders', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id })
    }).then((resp) => resp.json()).then((data) => {
      data.success ? alert("Order Removed") : alert("Failed")
    })
    await fetchInfo()
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Calculate the items to display for the current page
  const currentItems = allOrders.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  // Calculate total pages
  const totalPages = Math.ceil(allOrders.length / itemsPerPage);

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

  return (
    <div className='container'>
      <div className="box-head">
        <div className="box-content">
          <div className="box-content-row">
            <h1>{totalOrders}</h1>
            <p>Total Order</p>
          </div>
          <div className="box-content-row-img">
            <i className="fa-solid fa-cart-shopping fa-5x"></i>
          </div>
        </div>
        <div className="box-content">
          <div className="box-content-row">
            <h1>{totalProducts}</h1>
            <p>Total Products</p>
          </div>
          <div className="box-content-row-img">
            <i className="fa-solid fa-bars fa-5x"></i>
          </div>
        </div>
        <div className="box-content">
          <div className="box-content-row">
            <h1>{totalUsers}</h1>
            <p>Total Users</p>
          </div>
          <div className="box-content-row-img">
            <i className="fa-solid fa-users fa-4x"></i>
          </div>
        </div>
      </div>
      <div className="box-order">
        <h1>Order List</h1>
        <table className="order-content">
          <thead>
            <tr>
              <th style={{ width: '1vw' }}>No</th>
              <th style={{ width: '20vw' }}>Customer Name</th>
              <th style={{ width: '10vw' }}>No Telp</th>
              <th style={{ width: '25vw' }}>Date</th>
              <th style={{ width: '30vw' }}>Alamat</th>
              <th style={{ width: '10vw' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((order, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1 + currentPage * itemsPerPage}</td>
                  <td>{order.nama_customer}</td>
                  <td>{order.no_telp_customer}</td>
                  <td>{new Date(order.date).toLocaleString()}</td>
                  <td>{order.alamat_customer}</td>
                  <td>
                    <button onClick={() => handleViewClick(order)}>View</button>
                    <button>Edit</button>
                    <button onClick={() => { remove_product(order.id) }}>Hapus</button>
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
      </div>
      {isModalOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Order Details</h2>
            <table className='order-content' style={{ marginBottom: "1rem" }}>
              <thead>
                <tr>
                  <th>Nama Customer</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedOrder.nama_customer}</td>
                </tr>
              </tbody>
            </table>

            <table className='order-content' style={{ marginBottom: "1rem" }}>
              <thead>
                <tr>
                  <th>Alamat Customer</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedOrder.alamat_customer}</td>
                </tr>
              </tbody>
            </table>

            <table className='order-content' style={{ marginTop: "1rem" }}>
              <thead>
                <tr>
                  <th>Nama Produk</th>
                  <th>Total Produk</th>
                  <th>Harga Produk</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>{product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
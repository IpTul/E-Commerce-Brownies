import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // State to hold the selected order
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:4000/allorders');
      const data = await response.json();

      if (Array.isArray(data.checkouts)) {
        setAllOrders(data.checkouts);
      } else {
        console.error('Expected an array but got:', data.checkouts);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedOrder(null); // Reset selected order
  };

  return (
    <div className='container'>
      <div className="box-head">
        <div className="box-content">
          <p>test</p>
        </div>
        <div className="box-content">
          <p>test</p>
        </div>
        <div className="box-content">
          <p>test</p>
        </div>
      </div>
      <div className="box-order">
        <p>Order List</p>
        <table className="order-content">
          <thead>
            <tr>
              <th>Id</th>
              <th>Customer Name</th>
              <th>No Telp</th>
              <th>Date</th>
              <th>Products</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order, index) => (
              <tr key={index}>
                <td>{order.id}</td>
                <td>{order.nama_customer}</td>
                <td>{order.no_telp_customer}</td>
                <td>{new Date(order.date).toLocaleString()}</td>
                <td>{order.products.length} items</td>
                <td>
                  <button onClick={() => handleViewClick(order)}>View</button>
                  <p>Hapus</p>
                  <p>Edit</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Order Details</h2>
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
      )
      }
    </div >
  );
};

export default Dashboard;
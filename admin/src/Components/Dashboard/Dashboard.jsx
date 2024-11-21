import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // State to hold the selected order
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const fetchInfo = async () => {
    await fetch('http://localhost:4000/getorders2')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.checkouts)) {
          setAllOrders(data.checkouts)
        } else {
          console.error('Invalid', data)
          setAllOrders([])
        }
      })
      .catch((error) => console.error('Error fetching orders', error))
  }

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
              <th>No</th>
              <th>Customer Name</th>
              <th>No Telp</th>
              <th>Date</th>
              <th>Alamat</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{order.nama_customer}</td>
                  <td>{order.no_telp_customer}</td>
                  <td>{new Date(order.date).toLocaleString()}</td>
                  <td>{order.alamat_customer}</td>
                  {/* <td>{order.products.length} items</td> */}
                  <td>
                    <button onClick={() => handleViewClick(order)}>View</button>
                    <p>Hapus</p>
                    <p>Edit</p>
                  </td>
                </tr>
              )
            })}
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
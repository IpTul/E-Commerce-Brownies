import React, { useEffect, useState } from 'react';
import './css/Profile.css';
import { jwtDecode } from 'jwt-decode';

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('auth-token');
  const link = process.env.REACT_APP_API
  const [selectedOrder, setSelectedOrder] = useState(null); // State untuk menyimpan order yang dipilih
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        console.error('No auth token found');
        return;
      }
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
      const id_user = decodedToken.user.id;
      try {
        const response = await fetch(`${link}/allorders?user_id=${id_user}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Fetch error:', errorText);
          setError('Failed to fetch orders');
          return;
        }

        const data = await response.json();
        console.log('Fetched data:', data);
        setOrders(data.checkouts);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='container'>
      <div className="profile-content">
        <h1>Order History</h1>
        <hr />
        <div className="table">
          <table>
            <thead>
              <tr>
                <th style={{ width: '1vw' }}>No</th>
                <th style={{ width: '10vw' }}>Nama</th>
                <th style={{ width: '15vw' }}>Address</th>
                {/* <th>Product</th> */}
                <th style={{ width: '6vw' }}>Status</th>
                <th style={{ width: '10vw' }}>Total Quantity</th>
                <th style={{ width: '10vw' }}>Total Price</th>
                <th style={{ width: '1vw' }}>View</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                // Combine product names and quantities
                const productDetails = order.products.map(product => `${product.name} (${product.quantity})`).join(', ');

                // Calculate total price for the order
                const totalPrice = order.products.reduce((total, product) => total + (product.price * product.quantity), 0);

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{order.nama_customer}</td>
                    <td>{order.alamat_customer}</td>
                    {/* <td>{productDetails}</td> */}
                    <td className='status' style={{ display: 'flex', justifyContent: 'center' }}>
                      {order.status_order === "Pending" ? (
                        <div className="status-order-pending">
                          <p>{order.status_order}</p>
                        </div>
                      ) : order.status_order === "Process" ? (
                        <div className="status-order-process">
                          <p>{order.status_order}</p>
                        </div>
                      ) : order.status_order === "Delivered" ? (
                        <div className="status-order-delivered">
                          <p>{order.status_order}</p>
                        </div>
                      ) : (
                        <div className="status-order-cancelled">
                          <p>{order.status_order}</p>
                        </div>
                      )}
                    </td>
                    <td className='center'>{order.products.reduce((total, product) => total + product.quantity, 0)}</td> {/* Total Quantity */}
                    <td className='center'>Rp. {totalPrice}</td> {/* Total Price */}
                    <td className='center'>
                      <button className='btn-view' onClick={() => openModal(order)}><i className='fa fa-eye'></i></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2 style={{ marginBottom: '1rem' }}>Order Detail</h2>
            <hr />
            {selectedOrder && (
              <div>
                <br />
                <p>Name</p>
                <h3>{selectedOrder.nama_customer}</h3>
                <br />
                <p>Alamat</p>
                <h3>{selectedOrder.alamat_customer}</h3>
                <br />
                <p>Products</p>
                <ul>
                  {selectedOrder.products.map((product, index) => (
                    <li key={index}><h3>{product.name} - Quantity {product.quantity} - Price: Rp. {product.price}</h3></li>
                  ))}
                </ul>
                <br />
                <p>Total Quantity</p>
                <h3>{selectedOrder.products.reduce((total, product) => total + product.quantity, 0)}</h3>
                <br />
                <p>Total Price</p>
                <h3>Rp. {selectedOrder.products.reduce((total, product) => total + (product.price * product.quantity), 0)}</h3>
                <br />
                <p>Status</p>
                {selectedOrder.status_order === "Pending" ? (
                  <h3 style={{ color: '#FFC800' }}>{selectedOrder.status_order}</h3>
                ) : selectedOrder.status_order === "Process" ? (
                  <h3 style={{ color: '#007BFF' }}>{selectedOrder.status_order}</h3>
                ) : selectedOrder.status_order === "Delivered" ? (
                  <h3 style={{ color: '#28A745' }}>{selectedOrder.status_order}</h3>
                ) : (
                  <h3 style={{ color: '#FF0000' }}>{selectedOrder.status_order}</h3>
                )}
                <br />
                <p>Status Description</p>
                {selectedOrder.status_order_desc === "Menunggu konfirmasi penjual" ? (
                  <h3 style={{ color: '#FFC800' }}>{selectedOrder.status_order_desc}</h3>
                ) : selectedOrder.status_order === "Pesanan telah dikonfirmasi penjual" ? (
                  <h3 style={{ color: '#007BFF' }}>{selectedOrder.status_order_desc}</h3>
                ) : selectedOrder.status_order === "Pesanan telah sampai di alamat tujuan" ? (
                  <h3 style={{ color: '#28A745' }}>{selectedOrder.status_order_desc}</h3>
                ) : (
                  <h3 style={{ color: '#FF0000' }}>{selectedOrder.status_order_desc}</h3>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div >
  );
};

export default Profile;
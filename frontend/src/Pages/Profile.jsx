import React, { useEffect, useState } from 'react';
import './css/Profile.css';
import { jwtDecode } from 'jwt-decode';

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('auth-token');
  const link = process.env.REACT_APP_API

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
                <th>No</th>
                <th>Nama</th>
                <th>Address</th>
                <th>Product</th>
                <th>Total Quantity</th>
                <th>Total Price</th>
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
                    <td>{productDetails}</td>
                    <td>{order.products.reduce((total, product) => total + product.quantity, 0)}</td> {/* Total Quantity */}
                    <td>Rp. {totalPrice}</td> {/* Total Price */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Profile;
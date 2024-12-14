import React, { useEffect, useState } from 'react'
import './OrderList.css'
import Swal from 'sweetalert2'

const OrderList = () => {
  const [allOrders, setAllOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 8
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const formatDateForInput = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }
  const [editOrder, setEditOrder] = useState({
    id: null,
    nama_customer: '',
    no_telp_customer: '',
    alamat_customer: '',
    date: '',
    status_order: '',
    status_order_desc: '',
    products: [],
  });
  const handleEditClick = (order) => {
    setEditOrder({
      id: order.id,
      nama_customer: order.nama_customer,
      no_telp_customer: order.no_telp_customer,
      alamat_customer: order.alamat_customer,
      date: order.date,
      status_order: order.status_order,
      status_order_desc: order.status_order_desc,
      products: order.products,
    });
    setIsEditModalOpen(true);
    setSelectedOrder(null);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditOrder({
      id: null,
      nama_customer: '',
      no_telp_customer: '',
      alamat_customer: '',
      status_order: '',
      status_order_desc: '',
      products: [],
    });
  };

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
    fetchInfo()
  }, [])

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:4000/updateorders', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editOrder),
    })
      .then((resp) => resp.json())
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
              title: "Order Update!",
              icon: "success"
            });
            fetchInfo()
            handleCloseEditModal()
          }
        });
      })
      .catch((error) => {
        console.error('Error updating order', error);
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
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

  const handleViewClick = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  // Filter orders based on search term
  const filteredOrders = allOrders.filter(order =>
    order.status_order.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the items to display for the current page
  const currentItems = filteredOrders.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  // Calculate total pages
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 0; i < totalPages; i++) {
      pageNumbers.push(
        <div className="pagination-btn-number">
          <button
            key={i}
            className={`pagination-number ${i === currentPage ? 'active-pagination' : ''}`}
            onClick={() => handlePageClick(i)}
          >
            {i + 1}
          </button>
        </div>
      );
    }
    return pageNumbers;
  };

  // Function to export data to CSV
  const exportToCSV = () => {
    const csvRows = [];
    const headers = ['No', 'Customer Name', 'No Telp', 'Date', 'Time', 'Alamat', 'Products', 'Total'];
    csvRows.push(headers.join(',')); // Add headers

    filteredOrders.forEach((order, index) => {
      const productDetails = order.products.map(product =>
        `"${product.name} (Qty: ${product.quantity} Price: ${product.price})"` // Enclose in quotes
      ).join('; '); // Join products with a semicolon

      const row = [
        index + 1,
        `"${order.nama_customer}"`, // Enclose in quotes
        order.no_telp_customer,
        new Date(order.date).toLocaleString(),
        `"${order.alamat_customer}"`, // Enclose in quotes
        productDetails, // Use the concatenated product details
        order.total,
      ];
      csvRows.push(row.join(',')); // Join the row with commas
    });

    // Optionally, add a summary row
    const totalOrders = filteredOrders.length;
    const totalAmount = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    csvRows.push(['', '', '', '', '', 'Total Orders:', totalOrders].join(','));
    csvRows.push(['', '', '', '', '', 'Total Amount:', totalAmount].join(','));

    // Create a blob from the CSV rows
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    // Create a link and click it to download
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'order-list.csv');
    a.click();
    window.URL.revokeObjectURL(url); // Clean up
  }

  return (
    <div className='container'>
      <div className="container-content">
        <div className="title-content">
          <h1>Order List</h1>
          <input
            type="text"
            placeholder="Search by status order"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <table className="order-content">
          <thead>
            <tr>
              <th style={{ width: '1vw' }}>No</th>
              <th style={{ width: '20vw' }}>Customer Name</th>
              <th style={{ width: '10vw' }}>No Telp</th>
              <th style={{ width: '25vw' }}>Date</th>
              <th style={{ width: '30vw' }}>Alamat</th>
              <th style={{ width: '6vw' }}>Status Order</th>
              <th style={{ width: '1vw' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((order, index) => {
              return (
                <tr key={index}>
                  <td style={{ textAlign: 'center' }}>{index + 1 + currentPage * itemsPerPage}</td>
                  <td>{order.nama_customer}</td>
                  <td>{order.no_telp_customer}</td>
                  <td>{new Date(order.date).toLocaleString()}</td>
                  <td>{order.alamat_customer}</td>
                  <td className='status'>
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
                  <td className='action'>
                    <button className='btn-view' onClick={() => handleViewClick(order)}><i className='fa fa-eye'></i></button>
                    <button className='btn-edit' onClick={() => handleEditClick(order)}><i className='fa fa-pencil'></i></button>
                    <button className='btn-delete' onClick={() => { remove_product(order.id) }}><i className='fa fa-trash'></i></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="end-content">
          <div className="pagination">
            <button className='pagination-btn' onClick={handlePreviousPage} disabled={currentPage === 0}>Previous</button>
            {renderPageNumbers()}
            <button className='pagination-btn' onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>Next</button>
          </div>
          <button className='export-csv' onClick={exportToCSV}>Export to CSV</button>
        </div>
      </div>

      {/* Modal View */}
      {isModalOpen && selectedOrder && (
        <div className={`modal-overlay-dashboard ${isModalOpen ? 'show' : ''}`}>
          <div className={`modal-content-dashboard ${isModalOpen ? 'show' : ''}`}>
            <h2>Order Details</h2>

            <div className="order-container">
              <div className="order-container-first">
                <table className='order-content' style={{ marginBottom: "1rem" }}>
                  <thead>
                    <tr>
                      <th>Status Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='status'>
                        {selectedOrder.status_order === "Pending" ? (
                          <div className="status-order-pending">
                            <p>{selectedOrder.status_order}</p>
                          </div>
                        ) : selectedOrder.status_order === "Process" ? (
                          <div className="status-order-process">
                            <p>{selectedOrder.status_order}</p>
                          </div>
                        ) : selectedOrder.status_order === "Delivered" ? (
                          <div className="status-order-delivered">
                            <p>{selectedOrder.status_order}</p>
                          </div>
                        ) : (
                          <div className="status-order-cancelled">
                            <p>{selectedOrder.status_order}</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>

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

                <table className='order-content' style={{ marginBottom: "1rem" }}>
                  <thead>
                    <tr>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{new Date(selectedOrder.date).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="order-container-sec">
                <table className='order-content' style={{ marginBottom: "1rem" }}>
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

                <table className='order-content' style={{ marginBottom: "1rem" }}>
                  <thead>
                    <tr>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{selectedOrder.total}</td>
                    </tr>
                  </tbody>
                </table>

                <table className='order-content'>
                  <thead>
                    <tr>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{selectedOrder.status_order_desc}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {isEditModalOpen && (
        <div className={`modal-overlay-order ${isEditModalOpen ? 'show' : ''}`}>
          <div className={`modal-content-order ${isEditModalOpen ? 'show' : ''}`}>
            <h2>Edit Order</h2>
            <form onSubmit={handleEditSubmit}>
              <p>Customer Name</p>
              <input
                id='readonly'
                type="text"
                value={editOrder.nama_customer}
                onChange={(e) => setEditOrder({ ...editOrder, nama_customer: e.target.value })}
                readOnly
              />
              <p>No Telp</p>
              <input
                type="text"
                value={editOrder.no_telp_customer}
                onChange={(e) => setEditOrder({ ...editOrder, no_telp_customer: e.target.value })}
                required
              />
              <p>Alamat</p>
              <input
                type="text"
                value={editOrder.alamat_customer}
                onChange={(e) => setEditOrder({ ...editOrder, alamat_customer: e.target.value })}
                required
              />
              <p>Date</p>
              <input
                type="datetime-local"
                value={formatDateForInput(editOrder.date)}
                onChange={(e) => setEditOrder({ ...editOrder, date: e.target.value })}
              />
              <p>Status Order</p>
              <select
                value={editOrder.status_order}
                onChange={(e) => setEditOrder({ ...editOrder, status_order: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Process">Process</option>
                <option value="Delivered">Delivered</option>
              </select>
              <p>Status Order Description</p>
              <select
                value={editOrder.status_order_desc}
                onChange={(e) => setEditOrder({ ...editOrder, status_order_desc: e.target.value })}
              >
                <option value="Menunggu konfirmasi penjual">Menunggu konfirmasi penjual</option>
                <option value="Pesanan telah dikonfirmasi penjual">Pesanan telah dikonfirmasi penjual</option>
                <option value="Pesanan telah sampai di alamat tujuan">Pesanan telah sampai di alamat tujuan</option>
              </select>
              <br />
              <button type="submit">Save</button>
              <button type="button" onClick={handleCloseEditModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderList
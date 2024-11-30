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
  const [editOrder, setEditOrder] = useState({
    id: null,
    nama_customer: '',
    no_telp_customer: '',
    alamat_customer: '',
    products: [],
  });
  const handleEditClick = (order) => {
    setEditOrder({
      id: order.id,
      nama_customer: order.nama_customer,
      no_telp_customer: order.no_telp_customer,
      alamat_customer: order.alamat_customer,
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

  const handleViewClick = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

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

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  // Calculate the items to display for the current page
  const currentItems = allOrders.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  // Calculate total pages
  const totalPages = Math.ceil(allOrders.length / itemsPerPage)

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

  // Function to export data to CSV
  const exportToCSV = () => {
    const csvRows = []
    const headers = ['No', 'Customer Name', 'No Telp', 'Date', 'Alamat', 'Action']
    csvRows.push(headers.join(',')) // Add headers

    allOrders.forEach((order, index) => {
      const row = [
        index + 1,
        order.nama_customer,
        order.no_telp_customer,
        new Date(order.date).toLocaleString(),
        order.alamat_customer,
      ]
      csvRows.push(row.join(','))
    })

    // Create a blob from the CSV rows
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)

    // Create a link and click it to download
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', 'order-list.csv')
    a.click()
    window.URL.revokeObjectURL(url) // Clean up
  }

  return (
    <div className='container'>
      <div className="container-content">
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
                    <button onClick={() => handleEditClick(order)}>Edit</button>
                    <button onClick={() => { remove_product(order.id) }}>Hapus</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="pagination">
          <button className='pagination-btn' onClick={handlePreviousPage} disabled={currentPage === 0} style={{ marginRight: '1rem' }}>Previous</button>
          <button className='pagination-btn' onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>Next</button>
          <button className='export-csv' onClick={exportToCSV}>Export to CSV</button>
        </div>
      </div>

      {/* Modal View */}
      {isModalOpen && selectedOrder && (
        <div className={`modal-overlay-order ${isModalOpen ? 'show' : ''}`}>
          <div className={`modal-content-order ${isModalOpen ? 'show' : ''}`}>
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

            <table className='order-content' style={{ marginBottom: "1rem" }}>
              <thead>
                <tr>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{new Date(selectedOrder.date).toLocaleString()}</td>
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
              {/* Anda bisa menambahkan lebih banyak field untuk produk jika perlu */}
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
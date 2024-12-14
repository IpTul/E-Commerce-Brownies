import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import './Dashboard.css'
import Swal from 'sweetalert2'

const Dashboard = () => {
  const [allOrders, setAllOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 8
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [error, setError] = useState(null)

  const formatDateForInput = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const [products, setProducts] = useState([])

  const fetchTotalOrders = async () => {
    try {
      const response = await fetch('http://localhost:4000/total-checkouts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      setTotalOrders(data.totalCheckouts)
    } catch (error) {
      console.error('Error fetching total orders:', error)
      setError(error.message)
    }
  }

  const fetchTotalProducts = async () => {
    try {
      const response = await fetch('http://localhost:4000/total-products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      setTotalProducts(data.totalProducts)
    } catch (error) {
      console.error('Error fetching total orders:', error)
      setError(error.message)
    }
  }

  const fetchTotalUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/total-users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      setTotalUsers(data.totalUsers)
    } catch (error) {
      console.error('Error fetching total orders:', error)
      setError(error.message)
    }
  }

  const fetchTodayOrders = async () => {
    try {
      const response = await fetch('http://localhost:4000/getorders-today')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setAllOrders(data.checkouts)
    } catch (error) {
      console.error('Error fetching today\'s orders:', error)
      setError(error.message)
    }
  }

  const remove_product = async (id) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    })

    if (confirmResult.isConfirmed) {
      await fetch('http://localhost:4000/removeorders', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id })
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Order Removed',
              text: 'The order has been successfully removed.',
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: 'There was an issue removing the order.',
            })
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An unexpected error occurred.',
          })
        })
      await fetchTodayOrders()
    }
  }

  const [editOrder, setEditOrder] = useState({
    id: null,
    nama_customer: '',
    no_telp_customer: '',
    alamat_customer: '',
    date: '',
    total: '',
    status_order: '',
    status_order_desc: '',
    products: [],
  })
  const handleEditClick = (order) => {
    setEditOrder({
      id: order.id,
      nama_customer: order.nama_customer,
      no_telp_customer: order.no_telp_customer,
      alamat_customer: order.alamat_customer,
      date: order.date,
      total: order.total,
      status_order: order.status_order,
      status_order_desc: order.status_order_desc,
      products: order.products,
    })
    setIsEditModalOpen(true)
    setSelectedOrder(null)
  }
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditOrder({
      id: null,
      nama_customer: '',
      no_telp_customer: '',
      alamat_customer: '',
      status_order: '',
      status_order_desc: '',
      products: [],
    })
  }
  const handleEditSubmit = async (e) => {
    e.preventDefault()
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
            })
            handleCloseEditModal()
            fetchTodayOrders()
          }
        })
      })
      .catch((error) => {
        console.error('Error updating order', error)
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      })
  }

  // const fetchProducts = async () => {
  //   try {
  //     const response = await fetch('http://localhost:4000/allproducts')
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok')
  //     }
  //     const data = await response.json()
  //     setProducts(data.products)
  //   } catch (error) {
  //     console.error('Error fetching products:', error)
  //     setError(error.message)
  //   }
  // }

  // const removeProductFromOrder = (productId) => {
  //   setEditOrder((prevOrder) => ({
  //     ...prevOrder,
  //     products: prevOrder.products.filter(product => product.id !== productId),
  //   }))
  // }

  if (error) {
    return <div>Error: {error}</div>
  }

  useEffect(() => {
    // fetchInfo()
    fetchTotalOrders()
    fetchTotalProducts()
    fetchTotalUsers()
    fetchTodayOrders()
    // fetchProducts()
  }, [])

  const handleViewClick = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
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

  const exportToCSV = () => {
    const csvRows = []
    const headers = ['No', 'Customer Name', 'No Telp', 'Date', 'Time', 'Alamat', 'Products', 'Total']
    csvRows.push(headers.join(','))

    allOrders.forEach((order, index) => {
      const productDetails = order.products.map(product =>
        `"${product.name} (Qty: ${product.quantity} Price: ${product.price})"`
      ).join('; ')

      const row = [
        index + 1,
        `"${order.nama_customer}"`,
        order.no_telp_customer,
        new Date(order.date).toLocaleString(),
        `"${order.alamat_customer}"`,
        productDetails,
        order.total,
      ]
      csvRows.push(row.join(','))
    })

    const totalOrders = allOrders.length
    const totalAmount = allOrders.reduce((sum, order) => sum + order.total, 0)
    csvRows.push(['', '', '', '', '', 'Total Orders:', totalOrders].join(','))
    csvRows.push(['', '', '', '', '', 'Total Amount:', totalAmount].join(','))

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', 'order-list.csv')
    a.click()
    window.URL.revokeObjectURL(url)
  }

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
        <h1>Order List Today</h1>
        <table className="order-content">
          <thead>
            <tr>
              <th style={{ width: '1vw' }}>No</th>
              <th style={{ width: '20vw' }}>Customer Name</th>
              <th style={{ width: '10vw' }}>No Telp</th>
              <th style={{ width: '25vw' }}>Date</th>
              <th style={{ width: '30vw' }}>Alamat</th>
              <th style={{ width: '9vw' }}>Status Order</th>
              <th style={{ width: '1vw' }}>Action</th>
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
                    <button className='btn-delete' onClick={() => remove_product(order.id)}><i className='fa fa-trash'></i></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="end-content">
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={currentPage === 0}>Previous</button>
            <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>Next</button>
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
              {/* <p>Previously Ordered Products</p>
              <ul>
                {editOrder.products.map(product => (
                  <li key={product.id}>
                    {product.name}
                    <button type="button" onClick={() => removeProductFromOrder(product.id)}>Remove</button>
                  </li>
                ))}
              </ul>
              <p>Add New Product</p>
              <select
                onChange={(e) => {
                  const selectedProduct = products.find(product => product.id === parseInt(e.target.value))
                  if (selectedProduct) {
                    setEditOrder(prevOrder => ({
                      ...prevOrder,
                      products: [...prevOrder.products, selectedProduct],
                    }))
                  }
                }}
              >
                <option value="">Select a product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
              <br /> */}
              <button type="submit">Save</button>
              <button type="button" onClick={handleCloseEditModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
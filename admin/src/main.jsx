import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import Layout from './Pages/layout.jsx'
import Navbar from './Components/Navbar/Navbar.jsx'
import Dashboard from './Components/Dashboard/Dashboard'
import AddProduct from './Components/AddProduct/AddProduct'
import ListProduct from './Components/ListProduct/ListProduct'
import OrderList from './Components/OrderList/OrderList'
import ProtectedRoute from './Pages/ProtectedRoute.jsx'
import LoginPanel from './Pages/LoginPanel/LoginPanel.jsx'
import NotFound from "./Pages/NotFound"
import HomePage from './Pages/HomePage.jsx'
import ListPromoCode from './Components/ListPromoCode/ListPromoCode.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFound />
  },
  {
    path: "/admin",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "add-product",
            element: <AddProduct />,
          },
          {
            path: "listproduct",
            element: <ListProduct />,
          },
          {
            path: "list-promocode",
            element: <ListPromoCode />,
          },
          {
            path: "list-order",
            element: <OrderList />,
          },
        ]
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPanel />,
  }
])

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

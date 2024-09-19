import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./index.css"; // Assuming index.css will hold sidebar styles

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";

import { logout } from "./slices/auth";
import EventBus from "./common/EventBus";
import Customers from "./components/Customers";
import Products from "./components/Products";
import AddCustomer from "./components/AddCustomer";
import Municipalities from "./components/Municipalities";
import CustomerDetails from "./components/CustomerDetails";
import ProductDetails from "./components/ProductDetails";
import AddProduct from "./components/AddProduct";
import Invoices from "./components/Invoices";
import AddInvoice from "./components/AddInvoice";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state
  const [showUserBoard, setShowUserBoard] = useState(false);
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setShowUserBoard(currentUser.roles.includes("ROLE_USER"));
      setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
    } else {
      setShowUserBoard(false);
      setShowModeratorBoard(false);
      setShowAdminBoard(false);
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [currentUser, logOut]);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className={`app-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? "Close" : "Open"} Sidebar
        </button>

        <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <ul>
            <li>
              <span>Customers</span>
              <ul>
                <li><Link to="/customers">Customers</Link></li>
                <li><Link to="/addcustomer">Add Customer</Link></li>
              </ul>
            </li>
            <li>
              <span>Products</span>
              <ul>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/addproduct">Add Product</Link></li>
              </ul>
            </li>
            <li>
              <span>Invoices</span>
              <ul>
                <li><Link to="/invoices">Invoices</Link></li>
                <li><Link to="/addinvoice">Add Invoice</Link></li>
              </ul>
            </li>
            <li>
              <Link to="/municipalities">Municipalities</Link>
            </li>
            <li>
              <span>User Management</span>
              <ul>
                {showAdminBoard && (
                  <li><Link to="/admin">Admin Board</Link></li>
                )}
                {showModeratorBoard && (
                  <li><Link to="/mod">Moderator Board</Link></li>
                )}
                {currentUser && (
                  <li><Link to="/user">User Board</Link></li>
                )}
              </ul>
            </li>
          </ul>
        </div>

        <div className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user" element={<BoardUser />} />
            <Route path="/mod" element={<BoardModerator />} />
            <Route path="/admin" element={<BoardAdmin />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/customer-details/:customerID" element={<CustomerDetails />} />
            <Route path="/product-details/:productID" element={<ProductDetails />} />
            <Route path="/addcustomer" element={<AddCustomer />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/addinvoice" element={<AddInvoice />} />
            <Route path="/municipalities" element={<Municipalities />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

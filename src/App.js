import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./index.css"; // Ensure your sidebar styles are applied

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";
import Customers from "./components/Customers";
import Products from "./components/Products";
import AddCustomer from "./components/AddCustomer";
import Municipalities from "./components/Municipalities";
import CustomerDetails from "./components/CustomerDetails";
import ProductDetails from "./components/ProductDetails";
import AddProduct from "./components/AddProduct";
import Invoices from "./components/Invoices";
import AddInvoice from "./components/AddInvoice";
import { logout } from "./slices/auth";
import EventBus from "./common/EventBus";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Router>
      <div className="app-container">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isOpen ? "Close Sidebar" : "Open Sidebar"}
        </button>

        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          <ul>
            <li>
              <Link to={"/home"}>Home</Link>
            </li>
            <li>
              <Link to={"/customers"}>Customers</Link>
              <ul>
                <li><Link to={"/customers"}>Customers Page</Link></li>
                <li><Link to={"/addcustomer"}>Add Customer</Link></li>
              </ul>
            </li>
            <li>
              <Link to={"/products"}>Products</Link>
              <ul>
                <li><Link to={"/products"}>Products Page</Link></li>
                <li><Link to={"/addproduct"}>Add Product</Link></li>
              </ul>
            </li>
            <li>
              <Link to={"/invoices"}>Invoices</Link>
              <ul>
                <li><Link to={"/invoices"}>Invoices Page</Link></li>
                <li><Link to={"/addinvoice"}>Add Invoice</Link></li>
              </ul>
            </li>
            <li>
              <Link to={"/municipalities"}>Municipalities</Link>
            </li>

            {showModeratorBoard && (
              <li>
                <Link to={"/mod"}>Moderator Board</Link>
              </li>
            )}

            {showAdminBoard && (
              <li>
                <Link to={"/admin"}>Admin Board</Link>
              </li>
            )}

            {currentUser && (
              <li>
                <Link to={"/user"}>User Board</Link>
              </li>
            )}
          </ul>
        </div>

        {/* Main content */}
        <div className={`page-container ${isOpen ? "" : "sidebar-closed"}`}>
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

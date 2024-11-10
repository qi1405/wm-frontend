import React, { useEffect, useState } from "react";
import "./AddInvoice.css";
import { useNavigate } from "react-router-dom";
import UserService from "../services/user.service";

function AddInvoice() {
  const [municipalities, setMunicipalities] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoice, setInvoice] = useState({
    month: "",
    isPaid: false,
    customerID: null,
    productID: null,
    municipalityID: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const employeeID = localStorage.getItem('employeeID');
  const navigate = useNavigate();

  useEffect(() => {
    UserService.getMunicipalities().then(
      (response) => setMunicipalities(response.data),
      (error) => console.error(error)
    );

    UserService.getCustomers().then(
      (response) => setCustomers(response.data),
      (error) => console.error(error)
    );

    UserService.getProducts().then(
      (response) => setProducts(response.data),
      (error) => console.error(error)
    );
  }, []);

  useEffect(() => {
    let timer;
    if (isModalOpen && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      navigateToInvoicesPage();
    }
    return () => clearTimeout(timer);
  }, [isModalOpen, countdown]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setInvoice({ ...invoice, [name]: type === "checkbox" ? checked : value });
  };

  const navigateToInvoicesPage = () => {
    navigate("/invoices", { replace: true });
    window.location.reload();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      invoice: {
        month: invoice.month,
        isPaid: invoice.isPaid,
        employeeID: employeeID,
        customer: { customerID: invoice.customerID },
        product: { productID: invoice.productID },
        municipality: { municipalityID: invoice.municipalityID },
      },
    };

    UserService.createInvoice(data).then(
      (response) => {
        console.log("Invoice created successfully", response.data);
        setIsModalOpen(true);
      },
      (error) => {
        console.log(data)
        console.error("Error creating invoice", error);
        setErrorMessage(error.response?.data?.message || "An error occurred while creating the invoice.");
      }
    );
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit}>
        <div className="first-row">
          <div className="add-invoice-details">
            <label htmlFor="month">Month</label>
            <label htmlFor="isPaid">Is Paid</label>
            <label htmlFor="customerID">Customer</label>
            <label htmlFor="municipalityID">Municipality</label>
            <label htmlFor="productID">Product</label>
          </div>
          <div className="add-invoice-data">
            <input
              type="text"
              id="month"
              required
              name="month"
              value={invoice.month}
              onChange={handleInputChange}
            />
            <input
              type="checkbox"
              id="isPaid"
              name="isPaid"
              checked={invoice.isPaid}
              onChange={handleInputChange}
            />
            <select
              id="customerID"
              required
              name="customerID"
              value={invoice.customerID}
              onChange={handleInputChange}
            >
              <option value="" hidden>Choose customer</option>
              {customers.map((customer) => (
                <option key={customer.customerID} value={customer.customerID}>
                  {customer.firstName} {customer.surname}
                </option>
              ))}
            </select>
            <select
              id="municipalityID"
              required
              name="municipalityID"
              value={invoice.municipalityID}
              onChange={handleInputChange}
            >
              <option value="" hidden>Choose municipality</option>
              {municipalities.map((municipality) => (
                <option key={municipality.municipalityID} value={municipality.municipalityID}>
                  {municipality.municipalityName}
                </option>
              ))}
            </select>
            <select
              id="productID"
              required
              name="productID"
              value={invoice.productID}
              onChange={handleInputChange}
            >
              <option value="" hidden>Assign product</option>
              {products.map((product) => (
                <option key={product.productID} value={product.productID}>
                  {product.productName} - {product.price}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="second-row">
          <div className="save-button-container">
            <button type="submit">Save</button>
            {errorMessage && <p>{errorMessage}</p>}
          </div>
          <div className="cancel-button-container">
            <button type="button" onClick={navigateToInvoicesPage}>Cancel</button>
          </div>
        </div>
      </form>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>In {countdown} seconds, you will be redirected to the invoices page, or click below to go directly.</p>
            <button onClick={navigateToInvoicesPage}>Go to Invoices Page</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddInvoice;

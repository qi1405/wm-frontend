import React, { useEffect, useState } from "react";
import "./AddCustomer.css";
import { useNavigate } from "react-router-dom";
import UserService from "../services/user.service";

function AddCustomer() {
  const [divType, setDivType] = useState(null);
  const navigate = useNavigate();
  const [municipalities, setMunicipalities] = useState([]);
  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState({
    firstName: "",
    surname: "",
    email: "",
    phonenumber: "",
    address: "",
    customerType: "",
    municipalityID: null,
    productIds: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    UserService.getMunicipalities().then(
      (response) => {
        setMunicipalities(response.data);
      },
      (error) => {
        // Handle error
      }
    );
  }, []);

  useEffect(() => {
    UserService.getProducts().then(
      (response) => {
        setProducts(response.data);
      },
      (error) => {
        // Handle error
      }
    );
  }, []);

  useEffect(() => {
    let timer;
    if (isModalOpen && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      navigateToCustomersPage();
    }
    return () => clearTimeout(timer);
  }, [isModalOpen, countdown]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCustomer({ ...customer, [name]: value });
  };

  const navigateToCustomersPage = () => {
    navigate("/customers", { replace: true });
    window.location.reload();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      customer: {
        firstName: customer.firstName,
        lastName: customer.surname,
        email: customer.email,
        phoneNumber: customer.phonenumber,
        address: customer.address,
        customerType: customer.customerType,
        ...(customer.customerType === "INDIVIDUAL"
          ? {}
          : { company: { companyName: customer.companyName } }),
        municipality: {
          municipalityID: customer.municipalityID,
        },
      },
      productIds: [customer.productIds],
    };

    UserService.createCustomer(data).then(
      (response) => {
        console.log("Customer created successfully", response.data);
        setIsModalOpen(true);  // Open the modal after saving
      },
      (error) => {
        console.error("Error creating customer", error);
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage("An error occurred while creating the customer.");
        }
      }
    );
  };

  const GetDivType = () => {
    switch (divType) {
      case "INDIVIDUAL":
        return <p>You have chosen Customer type:</p>;
      case "COMPANY":
        return <label htmlFor="companyName">Company Name</label>;
      default:
        return null;
    }
  };

  const GetDivTypeRight = () => {
    switch (divType) {
      case "INDIVIDUAL":
        return <p>INDIVIDUAL</p>;
      case "COMPANY":
        return (
          <div>
            <input
              type="text"
              id="companyName"
              required
              value={customer.companyName || ""}
              onChange={handleInputChange}
              name="companyName"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} onChange={handleInputChange}>
        <div className="first-row">
          <div className="add-customer-details">
            <label htmlFor="firstName">Name</label>
            <label htmlFor="surname">Surname</label>
            <label htmlFor="email">E-mail</label>
            <label htmlFor="phonenumber">Phone Number</label>
            <label htmlFor="address">Address</label>
            <label htmlFor="municipality">Municipality</label>
            <label htmlFor="customerType">Customer Type</label>
            <>{GetDivType()}</>
            <label htmlFor="productIds">Product</label>
          </div>
          <div className="add-customer-data">
            <input
              type="text"
              id="firstName"
              required
              value={customer.name}
              onChange={handleInputChange}
              name="firstName"
            />
            <input
              type="text"
              id="surname"
              required
              value={customer.surname || ""}
              onChange={handleInputChange}
              name="surname"
            />
            <input
              type="text"
              id="email"
              value={customer.email || ""}
              onChange={handleInputChange}
              name="email"
            />
            <input
              type="text"
              id="phonenumber"
              required
              value={customer.phonenumber || ""}
              onChange={handleInputChange}
              name="phonenumber"
            />
            <input
              type="text"
              id="address"
              value={customer.address || ""}
              onChange={handleInputChange}
              name="address"
            />
            <select
              name="municipalityID"
              value={customer.municipalityID}
              onChange={handleInputChange}
            >
              <option value="" defaultValue="selected" hidden>
                Choose municipality
              </option>
              {municipalities.map((municipality) => (
                <option
                  key={municipality.municipalityID}
                  value={municipality.municipalityID}
                >
                  {municipality.municipalityID} - {municipality.municipalityName}
                </option>
              ))}
            </select>
            <select
              name="customerType"
              id="customerType"
              onClick={(event) => setDivType(event.target.value)}
              onChange={handleInputChange}
            >
              <option value="" defaultValue="selected" hidden>
                Choose type
              </option>
              <option value="INDIVIDUAL">INDIVIDUAL</option>
              <option value="COMPANY">COMPANY</option>
            </select>
            <>{GetDivTypeRight()}</>
            <select
              name="productIds"
              value={customer.productIds}
              onChange={handleInputChange}
            >
              <option value="" defaultValue="selected" hidden>
                Assign product
              </option>
              {products.map((product) => (
                <option key={product.productID} value={product.productID}>
                  {product.productID} - {product.productName} - {product.price} -{" "}
                  {product.municipality.municipalityID} -{" "}
                  {product.municipality.municipalityName}
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
            <button type="button" onClick={navigateToCustomersPage}>
              Cancel
            </button>
          </div>
        </div>
      </form>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>
              In {countdown} seconds, you will be redirected to the customers
              page, or click the button below to go there directly.
            </p>
            <button onClick={navigateToCustomersPage}>Go to Customers Page</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddCustomer;

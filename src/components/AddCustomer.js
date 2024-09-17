import React, { useEffect, useState } from "react";
import "./AddCustomer.css";
import { useNavigate } from "react-router-dom";
import UserService from "../services/user.service";
// import EventBus from "../common/EventBus";

function AddProduct() {
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
  // const [isSaveDisabled, setIsSaveDisabled] = useState(false);

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCustomer({ ...customer, [name]: value });
  };

  const customerPage = () => {
    navigate("/customers", { replace: true }); // Replace the current entry in the history stack
    window.location.reload(); // Reload the page to get the most recent data
  };

  function handleSubmit(event) {
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
        // Customer created successfully
        console.log("Customer created successfully", response.data);
        // Navigate to customers page and reload
        customerPage();
      },
      (error) => {
        // Handle error
        console.error("Error creating customer", error);
        if (error.response && error.response.data) {
          // If server returns error message, set it as errorMessage state
          setErrorMessage(error.response.data);
        } else {
          // If no specific error message received from server, set a generic error message
          setErrorMessage("An error occurred while creating the customer.");
        }
      }
    );
  }

  const GetDivType = () => {
    switch (divType) {
      case "INDIVIDUAL":
        return (
          <>
            <p>You have choosen Customer type:</p>
          </>
        );
      case "COMPANY":
        return <label htmlFor="companyName">Company Name</label>;
      default:
        return null;
    }
  };

  const GetDivTypeRight = () => {
    switch (divType) {
      case "INDIVIDUAL":
        return (
          <>
            <p>INDIVIDUAL</p>
          </>
        );
      case "COMPANY":
        return (
          <>
            <div className="">
              <input
                type="text"
                id="companyName"
                required
                value={customer.companyName || ""}
                onChange={handleInputChange}
                name="companyName"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  console.log(customer);

  return (
    <div className="page-container">
      <form
        onSubmit={handleSubmit}
        onChange={handleInputChange}
        //   id="product_form"
      >
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
            <div className="">
              <input
                type="text"
                id="firstName"
                required
                value={customer.name}
                onChange={handleInputChange}
                name="firstName"
              />
            </div>
            <div className="">
              <input
                type="text"
                id="surname"
                required
                value={customer.surname || ""}
                onChange={handleInputChange}
                name="surname"
              />
            </div>
            <div className="">
              <input
                type="text"
                id="email"
                // pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
                value={customer.email || ""}
                onChange={handleInputChange}
                name="email"
              />
            </div>
            <div className="">
              <input
                type="text"
                id="phonenumber"
                required
                value={customer.phonenumber || ""}
                onChange={handleInputChange}
                name="phonenumber"
              />
            </div>
            <div className="">
              <input
                type="text"
                id="address"
                value={customer.address || ""}
                onChange={handleInputChange}
                name="address"
              />
            </div>
            <div>
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
                    {municipality.municipalityID} -{" "}
                    {municipality.municipalityName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                name="customerType"
                id="customerType"
                onClick={(event) => {
                  setDivType(event.target.value);
                }}
                onChange={handleInputChange}
              >
                <option value="" defaultValue="selected" hidden="hidden">
                  Choose type
                </option>
                <option value="INDIVIDUAL" onChange={handleInputChange}>
                  INDIVIDUAL
                </option>
                <option value="COMPANY" onChange={handleInputChange}>
                  COMPANY
                </option>
              </select>
            </div>
            <div id="productType">{GetDivTypeRight()}</div>
            <div>
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
                    {product.productID} - {product.productName} -{" "}
                    {product.price} - {product.municipality.municipalityID} -{" "}
                    {product.municipality.municipalityName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="second-row">
          <div className="save-button-container">
            <button
              type="submit"
            >
              Save
            </button>
            {errorMessage && <p>{errorMessage}</p>}
          </div>
          <div className="cancel-button-container">
            <button
              type="button"
              onClick={customerPage}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default AddProduct;

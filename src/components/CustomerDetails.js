import React, { useEffect, useState } from "react";
import "./AddCustomer.css";
import { useParams } from "react-router-dom";
import UserService from "../services/user.service";
import EditCustomer from "./EditCustomer";
import { useNavigate } from "react-router-dom";

function CustomerDetails() {
  const { customerID } = useParams();
  const [customer, setCustomer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    UserService.getCustomerWithProducts(customerID).then(
      (response) => {
        setCustomer(response.data);
      },
      (error) => {
        console.error("Error fetching customer details:", error);
      }
    );
  }, [customerID]);

  const toggleEditModal = () => {
    setShowEditModal(!showEditModal);
  };

  const customerPage = () => {
    window.location.href = `/customer-details/${customerID}`; // Replace the current entry in the history stack
    window.location.reload(); // Reload the page to get the most recent data
  };

  const handleSave = (updatedCustomer) => {
    const payload = {
      customer: {
        firstName: updatedCustomer.firstName,
        lastName: updatedCustomer.lastName,
        email: updatedCustomer.email,
        phoneNumber: updatedCustomer.phoneNumber,
        address: updatedCustomer.address,
        municipality: {
          municipalityID: updatedCustomer.municipality.municipalityID,
          municipalityName: updatedCustomer.municipality.municipalityName,
        },
        customerType: updatedCustomer.customerType,
        company:
          updatedCustomer.customerType === "COMPANY"
            ? { companyName: updatedCustomer.company.companyName }
            : null,
      },
      productIds: updatedCustomer.products.map((product) => product.productID),
    };

    UserService.editCustomer(customerID, payload)
      .then((response) => {
        setCustomer(response.data);
        customerPage(); // Reload the page to get the most recent data
      })
      .catch((error) => {
        console.error("Error creating customer", error);
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage("An error occurred while creating the customer.");
        }
      });

    toggleEditModal();
  };

  return (
    <div className="App">
      <div className="container">
        {customer && (
          <>
            <div className="customer-details">
              <h2>Customer Details</h2>
              <p>
                <strong>Name:</strong> {customer.firstName} {customer.lastName}
              </p>
              <p>
                <strong>Email:</strong> {customer.email}
              </p>
              <p>
                <strong>Phone Number:</strong> {customer.phoneNumber}
              </p>
              <p>
                <strong>Address:</strong> {customer.address}
              </p>
              <p>
                <strong>Customer Type:</strong> {customer.customerType}
              </p>
              {customer.customerType === "COMPANY" && (
                <p>
                  <strong>Company:</strong> {customer.company.companyName}
                </p>
              )}
              <p>
                <strong>Municipality:</strong> {customer.municipality.municipalityName}
              </p>
              <button onClick={toggleEditModal}>Edit</button>
            </div>
            <div className="products-list">
              <h2>Associated Products</h2>
              <ul>
                {customer.products.map((product) => (
                  <li key={product.productID}>
                    <p>
                      <strong>Name:</strong> {product.productName}
                    </p>
                    <p>
                      <strong>Description:</strong> {product.description}
                    </p>
                    <p>
                      <strong>Price:</strong> {product.price}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
      {showEditModal && (
        <EditCustomer
          customer={customer}
          onSave={handleSave}
          onClose={toggleEditModal}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
}

export default CustomerDetails;

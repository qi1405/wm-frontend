import React, { useState, useEffect } from 'react';
import EventBus from "../common/EventBus";
import UserService from "../services/user.service";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Fetch data from your API (replace with your actual API endpoint)
    UserService.getCustomers().then(
      (response) => {
        setCustomers(response.data);
      },
      (error) => {
        const _customers =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setCustomers(_customers);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }, []);

  // Function to handle click on a customer row
  const handleCustomerClick = (customerID) => {
    // Navigate to the customer details page using the customer ID
    // You can replace '/customer/' with your actual route path
    window.location.href = `/customer-details/${customerID}`;
  };
  console.log(customers);

  return (
    <div>
      <h1>Customers</h1>
      <table>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Customer Type</th>
            {/** Render company related columns only when customerType is COMPANY */}
            {customers.length > 0 && customers[0].customerType === "COMPANY" && (
              <>
                <th>Company ID</th>
                <th>Company Name</th>
              </>
            )}
            <th>Municipality ID</th>
            <th>Municipality Name</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customerID} onClick={() => handleCustomerClick(customer.customerID)}>
              <td>{customer.customerID}</td>
              <td>{customer.firstName}</td>
              <td>{customer.lastName}</td>
              <td>{customer.email}</td>
              <td>{customer.phoneNumber}</td>
              <td>{customer.address}</td>
              <td>{customer.customerType}</td>
              {/** Render company related data only when customerType is COMPANY */}
              {customer.customerType === "COMPANY" ? (
                <>
                  <td>{customer.company ? customer.company.companyID : ''}</td>
                  <td>{customer.company ? customer.company.companyName : ''}</td>
                </>
              ) : (
                <>
                  <td>N/A</td>
                  <td>N/A</td>
                </>
              )}
              <td>{customer.municipality.municipalityID}</td>
              <td>{customer.municipality.municipalityName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;

import React, { useState, useEffect } from 'react';
import EventBus from "../common/EventBus";
import UserService from "../services/user.service";
import './Customers.css'; // Importing the CSS file for styling

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({
    customerID: '',
    firstName: '',
    lastName: '',
    customerType: '',
    companyName: '',
    municipalityName: '',
  });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });

  useEffect(() => {
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

  const handleCustomerClick = (customerID) => {
    window.location.href = `/customer-details/${customerID}`;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key] || a?.company?.[sortConfig.key] || a?.municipality?.[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || b?.company?.[sortConfig.key] || b?.municipality?.[sortConfig.key] || '';
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredCustomers = sortedCustomers.filter((customer) => {
    return Object.keys(filters).every((key) => {
      if (!filters[key]) return true;
      const customerValue = customer[key] || customer?.company?.[key] || customer?.municipality?.[key] || '';
      return customerValue.toString().toLowerCase().includes(filters[key].toLowerCase());
    });
  });

  return (
    <div className="page-container">
      <h1>Customers</h1>
      <table className="customers-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('customerID')}>
              Customer ID
              <input
                type="text"
                name="customerID"
                value={filters.customerID}
                onChange={handleFilterChange}
                placeholder="Search ID"
              />
            </th>
            <th onClick={() => handleSort('firstName')}>
              First Name
              <input
                type="text"
                name="firstName"
                value={filters.firstName}
                onChange={handleFilterChange}
                placeholder="Search First Name"
              />
            </th>
            <th onClick={() => handleSort('lastName')}>
              Last Name
              <input
                type="text"
                name="lastName"
                value={filters.lastName}
                onChange={handleFilterChange}
                placeholder="Search Last Name"
              />
            </th>
            <th onClick={() => handleSort('customerType')}>
              Customer Type
              <input
                type="text"
                name="customerType"
                value={filters.customerType}
                onChange={handleFilterChange}
                placeholder="Search Type"
              />
            </th>
            {customers.length > 0 && customers[0].customerType === "COMPANY" && (
              <th onClick={() => handleSort('companyName')}>
                Company Name
                <input
                  type="text"
                  name="companyName"
                  value={filters.companyName}
                  onChange={handleFilterChange}
                  placeholder="Search Company Name"
                />
              </th>
            )}
            <th onClick={() => handleSort('municipalityName')}>
              Municipality Name
              <input
                type="text"
                name="municipalityName"
                value={filters.municipalityName}
                onChange={handleFilterChange}
                placeholder="Search Municipality Name"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer.customerID} onClick={() => handleCustomerClick(customer.customerID)}>
              <td>{customer.customerID}</td>
              <td>{customer.firstName}</td>
              <td>{customer.lastName}</td>
              <td>{customer.customerType}</td>
              {customer.customerType === "COMPANY" ? (
                <td>{customer.company ? customer.company.companyName : 'N/A'}</td>
              ) : (
                <td>N/A</td>
              )}
              <td>{customer.municipality.municipalityName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;

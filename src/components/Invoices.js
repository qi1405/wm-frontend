import React, { useState, useEffect } from 'react';
import EventBus from "../common/EventBus";
import UserService from "../services/user.service";
import '../App.css'; // Importing the CSS file for styling

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filters, setFilters] = useState({
    invoiceID: '',
    invoiceDate: '',
    totalAmount: '',
    month: '',
    isPaid: '',
    customerFirstName: '',
    customerLastName: '',
    municipalityName: '',
  });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });

  useEffect(() => {
    UserService.getInvoices().then(
      (response) => {
        setInvoices(response.data);
      },
      (error) => {
        const _invoices =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setInvoices(_invoices);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }, []);

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

  const sortedInvoices = [...invoices].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key] || a?.municipality?.[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || b?.municipality?.[sortConfig.key] || '';
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredInvoices = sortedInvoices.filter((invoice) => {
    return Object.keys(filters).every((key) => {
      if (!filters[key]) return true;
      const invoiceValue = invoice[key] || invoice?.municipality?.[key] || '';
      return invoiceValue.toString().toLowerCase().includes(filters[key].toLowerCase());
    });
  });

  return (
    <div className="page-container">
      <h1>Invoices</h1>
      <table className="invoices-table">
        <thead>
          <tr>
            <th className="table-cell" onClick={() => handleSort('invoiceID')}>
              Invoice ID
              <input
                type="text"
                name="invoiceID"
                value={filters.invoiceID}
                onChange={handleFilterChange}
                placeholder="Search Invoice ID"
              />
            </th>
            <th className="table-cell" onClick={() => handleSort('invoiceDate')}>
              Invoice Date
              <input
                type="text"
                name="invoiceDate"
                value={filters.invoiceDate}
                onChange={handleFilterChange}
                placeholder="Search Invoice Date"
              />
            </th>
            <th className="table-cell" onClick={() => handleSort('totalAmount')}>
              Total Amount
              <input
                type="text"
                name="totalAmount"
                value={filters.totalAmount}
                onChange={handleFilterChange}
                placeholder="Search Total Amount"
              />
            </th>
            <th className="table-cell" onClick={() => handleSort('month')}>
              Month
              <input
                type="text"
                name="month"
                value={filters.month}
                onChange={handleFilterChange}
                placeholder="Search Month"
              />
            </th>
            <th className="table-cell" onClick={() => handleSort('isPaid')}>
              Is Paid
              <input
                type="text"
                name="isPaid"
                value={filters.isPaid}
                onChange={handleFilterChange}
                placeholder="Search Is Paid"
              />
            </th>
            <th className="table-cell" onClick={() => handleSort('customerFirstName')}>
              Customer First Name
              <input
                type="text"
                name="customerFirstName"
                value={filters.customerFirstName}
                onChange={handleFilterChange}
                placeholder="Search Customer First Name"
              />
            </th>
            <th className="table-cell" onClick={() => handleSort('customerLastName')}>
              Customer Last Name
              <input
                type="text"
                name="customerLastName"
                value={filters.customerLastName}
                onChange={handleFilterChange}
                placeholder="Search Customer Last Name"
              />
            </th>
            <th className="table-cell" onClick={() => handleSort('municipalityName')}>
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
          {filteredInvoices.map((invoice) => (
            <tr key={invoice.invoiceID}>
              <td className="table-cell">{invoice.invoiceID}</td>
              <td className="table-cell">{invoice.invoiceDate}</td>
              <td className="table-cell">{invoice.totalAmount}</td>
              <td className="table-cell">{invoice.month}</td>
              <td className="table-cell">{invoice.isPaid ? 'Yes' : 'No'}</td>
              <td className="table-cell">{invoice.customerFirstName}</td>
              <td className="table-cell">{invoice.customerLastName}</td>
              <td className="table-cell">{invoice.municipalityName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Invoices;

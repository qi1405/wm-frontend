import React, { useState, useEffect } from 'react';
import UserService from "../services/user.service";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    // Fetch data from your API (replace with your actual API endpoint)
    UserService.getInvoices().then(
      (response) => {
        setInvoices(response.data);
      },
      (error) => {
        console.error('Error fetching invoices:', error);
      }
    );
  }, []);

  return (
    <div>
      <h1>Invoices</h1>
      <table>
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Invoice Date</th>
            <th>Total Amount</th>
            <th>Month</th>
            <th>Is Paid</th>
            <th>Customer ID</th>
            <th>Customer First Name</th>
            <th>Customer Last Name</th>
            <th>Company Name</th>
            <th>Employee ID</th>
            <th>Employee First Name</th>
            <th>Employee Last Name</th>
            <th>Municipality ID</th>
            <th>Municipality Name</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.invoiceId}>
              <td>{invoice.invoiceId}</td>
              <td>{invoice.invoiceDate}</td>
              <td>{invoice.totalAmount}</td>
              <td>{invoice.month}</td>
              <td>{invoice.isPaid ? 'Yes' : 'No'}</td>
              <td>{invoice.customerId}</td>
              <td>{invoice.customerFirstName}</td>
              <td>{invoice.customerLastName}</td>
              <td>{invoice.companyName ? invoice.companyName : 'N/A'}</td>
              <td>{invoice.employeeId ? invoice.employeeId : 'N/A'}</td>
              <td>{invoice.employeeFirstName ? invoice.employeeFirstName : 'N/A'}</td>
              <td>{invoice.employeeLastName ? invoice.employeeLastName : 'N/A'}</td>
              <td>{invoice.municipalityId ? invoice.municipalityId : 'N/A'}</td>
              <td>{invoice.municipalityName ? invoice.municipalityName : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Invoices;

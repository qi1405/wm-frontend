import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserService from '../services/user.service';

const AddInvoice = () => {
  const [invoiceData, setInvoiceData] = useState({
    customerId: '',
    municipalityId: '',
    months: '',
    additionalProducts: [{ productId: '', quantity: '' }],
    isPaid: false,
  });

  const [customers, setCustomers] = useState([]);
  const employeeId = localStorage.getItem('employeeId');

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
        //   EventBus.dispatch("logout");
        }
      }
    );
  }, []);

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    const selectedCustomer = customers.find(customer => customer.id === parseInt(customerId));

    setInvoiceData({
      ...invoiceData,
      customerId,
      municipalityId: selectedCustomer?.municipality?.municipalityId || ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({
      ...invoiceData,
      [name]: value,
    });
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const products = [...invoiceData.additionalProducts];
    products[index][name] = value;
    setInvoiceData({ ...invoiceData, additionalProducts: products });
  };

  const addProduct = () => {
    setInvoiceData({
      ...invoiceData,
      additionalProducts: [...invoiceData.additionalProducts, { productId: '', quantity: '' }],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...invoiceData,
      employeeId: parseInt(employeeId),
      customerId: parseInt(invoiceData.customerId),
      municipalityId: parseInt(invoiceData.municipalityId),
      additionalProducts: invoiceData.additionalProducts.map(product => ({
        ...product,
        productId: parseInt(product.productId),
        quantity: parseInt(product.quantity)
      })),
      months: invoiceData.months.split(',').map(month => month.trim())
    };

    axios.post('/api/invoices', payload)
      .then(response => {
        console.log('Invoice added successfully', response.data);
      })
      .catch(error => {
        console.error('There was an error adding the invoice!', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Customer:
        <select name="customerId" value={invoiceData.customerId} onChange={handleCustomerChange}>
          <option value="">Select Customer</option>
          {customers.map(customer => (
            <option key={customer.customerID} value={customer.customerID}>{customer.customerID} - {customer.firstName} {customer.lastName}</option>
          ))}
        </select>
      </label>
      <label>
        Municipality:
        <input type="text" name="municipalityId" value={invoiceData.municipalityId} readOnly />
      </label>
      <label>
        Months (comma-separated):
        <input type="text" name="months" value={invoiceData.months} onChange={handleChange} />
      </label>
      <label>
        Is Paid:
        <input type="checkbox" name="isPaid" checked={invoiceData.isPaid} onChange={(e) => setInvoiceData({ ...invoiceData, isPaid: e.target.checked })} />
      </label>
      {invoiceData.additionalProducts.map((product, index) => (
        <div key={index}>
          <label>
            Product ID:
            <input type="number" name="productId" value={product.productId} onChange={(e) => handleProductChange(index, e)} />
          </label>
          <label>
            Quantity:
            <input type="number" name="quantity" value={product.quantity} onChange={(e) => handleProductChange(index, e)} />
          </label>
        </div>
      ))}
      <button type="button" onClick={addProduct}>Add Product</button>
      <button type="submit">Add Invoice</button>
    </form>
  );
};

export default AddInvoice;

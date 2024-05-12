import React, { useState, useEffect } from 'react';
import EventBus from "../common/EventBus";
import UserService from "../services/user.service";

const Customers = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch data from your API (replace with your actual API endpoint)
    UserService.getProducts().then(
      (response) => {
        setProducts(response.data);
      },
      (error) => {
        const _products =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

          setProducts(_products);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }, []);

  // Function to handle click on a customer row
  const handleCustomerClick = (productId) => {
    // Navigate to the customer details page using the customer ID
    // You can replace '/customer/' with your actual route path
    window.location.href = `/product-details/${productId}`;
  };
  console.log(products);

  return (
    <div>
      <h1>Products</h1>
      <table>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Product Description</th>
            <th>Price</th>
            <th>Municipality ID</th>
            <th>Municipality Name</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productID} onClick={() => handleCustomerClick(product.productID)}>
              <td>{product.productID}</td>
              <td>{product.productName}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.municipality.municipalityID}</td>
              <td>{product.municipality.municipalityName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;

import React, { useState, useEffect } from 'react';
import EventBus from "../common/EventBus";
import UserService from "../services/user.service";
import './Products.css'; // Importing the CSS file for styling

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    productID: '',
    productName: '',
    description: '',
    price: '',
    municipalityID: '',
    municipalityName: '',
  });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });

  useEffect(() => {
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

  const handleProductClick = (productID) => {
    window.location.href = `/product-details/${productID}`;
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

  const sortedProducts = [...products].sort((a, b) => {
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

  const filteredProducts = sortedProducts.filter((product) => {
    return Object.keys(filters).every((key) => {
      if (!filters[key]) return true;
      const productValue = product[key] || product?.municipality?.[key] || '';
      return productValue.toString().toLowerCase().includes(filters[key].toLowerCase());
    });
  });

  return (
    <div className="page-container">
      <h1>Products</h1>
      <table className="products-table">
        <thead>
          <tr>
            <th className="table-cell" onClick={() => handleSort('productID')}>
              Product ID
              <input
                type="text"
                name="productID"
                value={filters.productID}
                onChange={handleFilterChange}
                placeholder="Search Product ID"
              />
            </th>
            <th className="table-cell" onClick={() => handleSort('productName')}>
              Product Name
              <input
                type="text"
                name="productName"
                value={filters.productName}
                onChange={handleFilterChange}
                placeholder="Search Product Name"
              />
            </th>
            <th className="table-cell" onClick={() => handleSort('description')}>
              Product Description
              <input
                type="text"
                name="description"
                value={filters.description}
                onChange={handleFilterChange}
                placeholder="Search Description"
              />
            </th>
            <th className="table-cell" onClick={() => handleSort('price')}>
              Price
              <input
                type="text"
                name="price"
                value={filters.price}
                onChange={handleFilterChange}
                placeholder="Search Price"
              />
            </th>
            <th className="table-cell" onClick={() => handleSort('municipalityID')}>
              Municipality ID
              <input
                type="text"
                name="municipalityID"
                value={filters.municipalityID}
                onChange={handleFilterChange}
                placeholder="Search Municipality ID"
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
          {filteredProducts.map((product) => (
            <tr key={product.productID} onClick={() => handleProductClick(product.productID)}>
              <td className="table-cell">{product.productID}</td>
              <td className="table-cell">{product.productName}</td>
              <td className="table-cell">{product.description}</td>
              <td className="table-cell">{product.price}</td>
              <td className="table-cell">{product.municipality.municipalityID}</td>
              <td className="table-cell">{product.municipality.municipalityName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;

import React, { useEffect, useState } from 'react';
import "./AddCustomer.css";
import { useParams } from "react-router-dom";
import UserService from '../services/user.service';

function CustomerDetails() {
    const { customerID } = useParams();
    const [customer, setCustomer] = useState(null);

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

    return (
        <div className="App">
            <div className="container">
                {customer && (
                    <>
                        <div className="customer-details">
                            <h2>Customer Details</h2>
                            <p><strong>Name:</strong> {customer.firstName} {customer.lastName}</p>
                            <p><strong>Email:</strong> {customer.email}</p>
                            <p><strong>Phone Number:</strong> {customer.phoneNumber}</p>
                            <p><strong>Address:</strong> {customer.address}</p>
                            <p><strong>Customer Type:</strong> {customer.customerType}</p>
                            {customer.customerType === "COMPANY" && (
                                <p><strong>Company:</strong> {customer.company.companyName}</p>
                            )}
                            <p><strong>Municipality:</strong> {customer.municipality.municipalityName}</p>
                        </div>
                        <div className="products-list">
                            <h2>Associated Products</h2>
                            <ul>
                                {customer.products.map(product => (
                                    <li key={product.productID}>
                                        <p><strong>Name:</strong> {product.productName}</p>
                                        <p><strong>Description:</strong> {product.description}</p>
                                        <p><strong>Price:</strong> {product.price}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CustomerDetails;

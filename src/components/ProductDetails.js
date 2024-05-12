import React, { useEffect, useState } from 'react';
import "./AddCustomer.css";
import { useParams } from "react-router-dom";
import UserService from '../services/user.service';

function CustomerDetails() {
    const { productID } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        UserService.getProductByID(productID).then(
            (response) => {
                setProduct(response.data);
            },
            (error) => {
                console.error("Error fetching product details:", error);
            }
        );
    }, [productID]);

    return (
        <div className="App">
            <div className="container">
                {product && (
                    <>
                        <div className="customer-details">
                            <h2>Product Details</h2>
                            <p><strong>Product Name:</strong> {product.productName}</p>
                            <p><strong>Description:</strong> {product.description}</p>
                            <p><strong>Price:</strong> {product.price}</p>
                            <p><strong>Municipality:</strong> {product.municipality.municipalityName}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CustomerDetails;

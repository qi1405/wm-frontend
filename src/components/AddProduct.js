
import React, {useEffect, useState} from 'react';
import "./AddProduct.css";
import {useNavigate} from "react-router-dom";
import UserService from '../services/user.service';
import EventBus from "../common/EventBus";


function AddProduct() {
    // const [divType, setDivType] = useState(null);
    const navigate = useNavigate();
    const [municipalities, setMunicipalities] = useState([]);
    const [products, setProducts] = useState({
        productName: "",
        description: "",
        price: null,
        municipalityID: null,
    });
    const [errorMessage, setErrorMessage] = useState("");
    // const [isSaveDisabled, setIsSaveDisabled] = useState(false);

    useEffect(() => {
        UserService.getMunicipalities().then(
            (response) => {
                setMunicipalities(response.data);
            },
            (error) => {
                // Handle error
            }
        );
    }, []);



    // useEffect(() => {
    //     UserService.getProducts().then(
    //         (response) => {
    //             setProducts(response.data);
    //         },
    //         (error) => {
    //             // Handle error
    //         }
    //     );
    // }, []);


    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setProducts({...products, [name]: value});
    };

    const productPage = () => {
        navigate("/products", { replace: true }); // Replace the current entry in the history stack
        window.location.reload(); // Reload the page to get the most recent data
    }    

    function handleSubmit(event) {
        event.preventDefault();
        const data = {
                productName: products.productName,
                description: products.description,
                price: products.price,
                municipality: {
                    municipalityID: products.municipalityID
                }
        };
    
        UserService.createProduct(data).then(
            (response) => {
                // Customer created successfully
                console.log("Product created successfully", response.data);
                // Navigate to customers page and reload
                // productPage();
            },
            (error) => {
                // Handle error
                console.error("Error creating product", error);
                if (error.response && error.response.data) {
                    // If server returns error message, set it as errorMessage state
                    setErrorMessage(error.response.data);
                } else {
                    // If no specific error message received from server, set a generic error message
                    setErrorMessage("An error occurred while creating the product.");
                }
            }
        );
    }


        // const GetDivType = () => {
        //     switch (divType) {
        //         case "INDIVIDUAL":
        //             return (
        //                 <>
        //                     <p>You have choosen Customer type INDIVIDUAL.</p>
        //                 </>
        //             );
        //         case "COMPANY":
        //             return (
        //                 <>
        //                     <div className="">
        //                         <label htmlFor="companyName">Company Name</label>
        //                         <input
        //                             type="text"
        //                             id="companyName"
        //                             required
        //                             value={customer.companyName || ""}
        //                             onChange={handleInputChange}
        //                             name="companyName"
        //                         />
        //                     </div>
        //                 </>
        //             );
        //         default:
        //             return null;
        //     }
        // }

        console.log(products);

        return (
            <div className="App">
                <div className="container">
                        <form onSubmit={handleSubmit} onChange={handleInputChange} id="product_form">
                            <div className="">
                                <label htmlFor="productName">Product Name</label>
                                <input
                                    type="text"
                                    id="productName"
                                    required
                                    value={products.productName}
                                    onChange={handleInputChange}
                                    name="productName"
                                />
                            </div>
                            <div className="">
                                <label htmlFor="description">Description</label>
                                <input
                                    type="text"
                                    id="description"
                                    required
                                    value={products.description}
                                    onChange={handleInputChange}
                                    name="description"
                                />
                            </div>
                            <div className="">
                                <label htmlFor="price">Price</label>
                                <input
                                    type="text"
                                    id="price"
                                    // pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
                                    value={products.price}
                                    onChange={handleInputChange}
                                    name="price"
                                />
                            </div>
                            {/* <div className="">
                                <label htmlFor="municipalityID">Municipality</label>
                                <input
                                    type="text"
                                    id="municipalityID"
                                    required
                                    value={products.municipalityID}
                                    onChange={handleInputChange}
                                    name="municipalityID"
                                />
                            </div> */}
                            {/* <div className="">
                                <label htmlFor="address">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    value={customer.address || ""}
                                    onChange={handleInputChange}
                                    name="address"
                                />
                            </div> */}
                            <div>
                        <label htmlFor="municipality">Municipality</label>
                        <select name="municipalityID" value={products.municipalityID} onChange={handleInputChange}>
                            <option value="" defaultValue="selected" hidden>Choose municipality</option>
                            {municipalities.map((municipality) => (
                                <option key={municipality.municipalityID} value={municipality.municipalityID}>
                                    {municipality.municipalityID} - {municipality.municipalityName}
                                </option>
                            ))}
                        </select>
                    </div>
                            {/* <div>
                                <label htmlFor="customerType">Customer Type</label>
                                <select name="customerType" id="customerType" onClick={(event) => {
                                    setDivType(event.target.value);
                                }} onChange={handleInputChange}>
                                    <option value="" defaultValue="selected" hidden="hidden">Choose type</option>
                                    <option value="INDIVIDUAL" onChange={handleInputChange}>INDIVIDUAL</option>
                                    <option value="COMPANY" onChange={handleInputChange}>COMPANY</option>
                                </select>
                            </div> */}
                            {/* <div id="productType">
                            {GetDivType()}
                            </div> */}
                            {/* <div>
                        <label htmlFor="productIds">Product</label>
                        <select name="productIds" value={customer.productIds} onChange={handleInputChange}>
                            <option value="" defaultValue="selected" hidden>Assign product</option>
                            {products.map((product) => (
                                <option key={product.productID} value={product.productID}>
                                    {product.productID} - {product.productName} - {product.price} - {product.municipality.municipalityID} - {product.municipality.municipalityName}
                                </option>
                            ))}
                        </select>
                    </div> */}
                            <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                                <button
                                    type="submit"
                                    className="button"
                                    style={{marginBottom: "0.6rem"}}
                                    // disabled={isSaveDisabled}
                                >
                                    Save
                                </button>
                                {/* {errorMessage && <p>{errorMessage}</p>} */}
                                <button
                                    type="button"
                                    onClick={productPage}
                                    className="button"
                                    style={{marginBottom: "0.6rem"}}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                </div>
            </div>
        )

}
export default AddProduct;

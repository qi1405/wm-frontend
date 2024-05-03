import React, {useEffect, useState} from 'react';
import "./AddCustomer.css";
import {useNavigate} from "react-router-dom";
import userService from '../services/user.service';
import EventBus from "../common/EventBus";


function AddProduct() {
    const [divType, setDivType] = useState(null);
    const navigate = useNavigate();
    const [municipalities, setMunicipalities] = useState([]);
    const [products, setProducts] = useState([]);
    const [customer, setCustomer] = useState({
        firstName: "",
        surname: "",
        email: "",
        phonenumber: "",
        address: "",
        customerType: "",
        municipalityID: null,
        productIds: null,
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [isSaveDisabled, setIsSaveDisabled] = useState(false);

    useEffect(() => {
        userService.getMunicipalities().then(
            (response) => {
                setMunicipalities(response.data);
            },
            (error) => {
                // Handle error
            }
        );
    }, []);



    useEffect(() => {
        userService.getProducts().then(
            (response) => {
                setProducts(response.data);
                // const prodData = response.data;
                // const loadedProd = [];

                // for (const key in prodData){
                //     loadedProd.push({
                //         key: prodData[key].productID,
                //         productID: prodData[key].productID,
                //         description: prodData[key].description,
                //         productName: prodData[key].productName,
                //         price: prodData[key].price,
                //         municipalityID: prodData[key].municipality.municipalityID,
                //         municipalityName: prodData[key].municipality.municipalityName
                //     })
                // }
                // console.log("prodData: ", prodData);
                // console.log("loadedProd: ", loadedProd);
            },
            (error) => {
                // Handle error
            }
        );
    }, []);


    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setCustomer({...customer, [name]: value});
    };

    const customerPage = () => {
        navigate("/customers");
    }     

    function handleSubmit(event) {
        event.preventDefault();
        const data = {
            customer: {
                firstName: customer.firstName,
                lastName: customer.surname,
                email: customer.email,
                phoneNumber: customer.phonenumber,
                address: customer.address,
                customerType: customer.customerType,
                // Conditionally include company name based on customer type
                ...(customer.customerType === "INDIVIDUAL" ? {} : { company: { companyName: customer.companyName } }),
                municipality: {
                    municipalityID: customer.municipalityID
                }
            },
            productIds: [customer.productIds] // Assuming only one product is selected
        };

        userService.createCustomer(data).then(
            (response) => {
                // Handle success
                console.log("Customer created successfully", response.data);
            },
            (error) => {
                // Handle error
                console.error("Error creating customer", error);
            }
        );
    }


        const GetDivType = () => {
            switch (divType) {
                case "INDIVIDUAL":
                    return (
                        <>
                            <p>You have choosen Customer type INDIVIDUAL.</p>
                        </>
                    );
                case "COMPANY":
                    return (
                        <>
                            <div className="">
                                <label htmlFor="companyName">Company Name</label>
                                <input
                                    type="text"
                                    id="companyName"
                                    required
                                    value={customer.companyName || ""}
                                    onChange={handleInputChange}
                                    name="companyName"
                                />
                            </div>
                        </>
                    );
                default:
                    return null;
            }
        }

        console.log(customer);

        return (
            <div className="App">
                <div className="container">
                        <form onSubmit={handleSubmit} onChange={handleInputChange} id="product_form">
                            <div className="">
                                <label htmlFor="firstName">Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    required
                                    value={customer.name}
                                    onChange={handleInputChange}
                                    name="firstName"
                                />
                            </div>
                            <div className="">
                                <label htmlFor="surname">Surname</label>
                                <input
                                    type="text"
                                    id="surname"
                                    required
                                    value={customer.surname || ""}
                                    onChange={handleInputChange}
                                    name="surname"
                                />
                            </div>
                            <div className="">
                                <label htmlFor="email">E-mail</label>
                                <input
                                    type="text"
                                    id="email"
                                    pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
                                    value={customer.email || ""}
                                    onChange={handleInputChange}
                                    name="email"
                                />
                            </div>
                            <div className="">
                                <label htmlFor="phonenumber">Phone Number</label>
                                <input
                                    type="text"
                                    id="phonenumber"
                                    required
                                    value={customer.phonenumber || ""}
                                    onChange={handleInputChange}
                                    name="phonenumber"
                                />
                            </div>
                            <div className="">
                                <label htmlFor="address">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    value={customer.address || ""}
                                    onChange={handleInputChange}
                                    name="address"
                                />
                            </div>
                            <div>
                        <label htmlFor="municipality">Municipality</label>
                        <select name="municipalityID" value={customer.municipalityID} onChange={handleInputChange}>
                            <option value="" defaultValue="selected" hidden>Choose municipality</option>
                            {municipalities.map((municipality) => (
                                <option key={municipality.municipalityID} value={municipality.municipalityID}>
                                    {municipality.municipalityID} - {municipality.municipalityName}
                                </option>
                            ))}
                        </select>
                    </div>
                            <div>
                                <label htmlFor="customerType">Customer Type</label>
                                <select name="customerType" id="customerType" onClick={(event) => {
                                    setDivType(event.target.value);
                                }} onChange={handleInputChange}>
                                    <option value="" defaultValue="selected" hidden="hidden">Choose type</option>
                                    <option value="INDIVIDUAL" onChange={handleInputChange}>INDIVIDUAL</option>
                                    <option value="COMPANY" onChange={handleInputChange}>COMPANY</option>
                                </select>
                            </div>
                            <div id="productType">
                            {GetDivType()}
                            </div>
                            <div>
                        <label htmlFor="productIds">Product</label>
                        <select name="productIds" value={customer.productIds} onChange={handleInputChange}>
                            <option value="" defaultValue="selected" hidden>Assign product</option>
                            {products.map((product) => (
                                <option key={product.productID} value={product.productID}>
                                    {product.productID} - {product.productName} - {product.price} - {product.municipality.municipalityName}
                                </option>
                            ))}
                        </select>
                    </div>
                            <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                                <button
                                    type="submit"
                                    className="button"
                                    style={{marginBottom: "0.6rem"}}
                                    disabled={isSaveDisabled}
                                >
                                    Save
                                </button>
                                {errorMessage && <p>{errorMessage}</p>}
                                <button
                                    type="button"
                                    onClick={customerPage}
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

import React, { useEffect, useState } from "react";
import "./AddProduct.css";
import { useNavigate } from "react-router-dom";
import UserService from "../services/user.service";

function AddProduct() {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);

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

  useEffect(() => {
    let timer;
    if (isModalOpen && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      navigateToProductsPage();
    }
    return () => clearTimeout(timer);
  }, [isModalOpen, countdown]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProducts({ ...products, [name]: value });
  };

  const navigateToProductsPage = () => {
    navigate("/products", { replace: true }); // Replace the current entry in the history stack
    window.location.reload(); // Reload the page to get the most recent data
  };

  function handleSubmit(event) {
    event.preventDefault();
    const data = {
      productName: products.productName,
      description: products.description,
      price: products.price,
      municipality: {
        municipalityID: products.municipalityID,
      },
    };

    UserService.createProduct(data).then(
      (response) => {
        // Customer created successfully
        console.log("Product created successfully", response.data);
        setIsModalOpen(true); // Open the modal after saving
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

  console.log(products);

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} onChange={handleInputChange}>
        <div className="first-row">
          <div className="add-product-details">
            <label htmlFor="productName">Product Name</label>
            <label htmlFor="description">Description</label>
            <label htmlFor="price">Price</label>
            <label htmlFor="municipality">Municipality</label>
          </div>
          <div className="add-product-data">
            <input
              type="text"
              id="productName"
              required
              value={products.productName}
              onChange={handleInputChange}
              name="productName"
            />
            <input
              type="text"
              id="description"
              required
              value={products.description}
              onChange={handleInputChange}
              name="description"
            />
            <input
              type="text"
              id="price"
              // pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
              value={products.price}
              onChange={handleInputChange}
              name="price"
            />
            <select
              name="municipalityID"
              value={products.municipalityID}
              onChange={handleInputChange}
            >
              <option value="" defaultValue="selected" hidden>
                Choose municipality
              </option>
              {municipalities.map((municipality) => (
                <option
                  key={municipality.municipalityID}
                  value={municipality.municipalityID}
                >
                  {municipality.municipalityID} -{" "}
                  {municipality.municipalityName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="second-row">
        <div className="save-button-container">
          <button
            type="submit"
          >
            Save
          </button>
          </div>
          <div className="cancel-button-container">
          <button
            type="button"
            onClick={navigateToProductsPage}
          >
            Cancel
          </button>
          </div>
        </div>
      </form>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>
              In {countdown} seconds, you will be redirected to the products
              page, or click the button below to go there directly.
            </p>
            <button onClick={navigateToProductsPage}>
              Go to Customers Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default AddProduct;

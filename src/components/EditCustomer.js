import React, { useEffect, useState } from "react";
import UserService from "../services/user.service";

function EditCustomer({ customer, onSave, onClose, errorMessage }) {
  const [editedCustomer, setEditedCustomer] = useState(customer);
  const [municipalities, setMunicipalities] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "municipalityID") {
      const selectedMunicipality = municipalities.find(
        (municipality) => municipality.municipalityID === parseInt(value)
      );
      setEditedCustomer({
        ...editedCustomer,
        municipality: selectedMunicipality,
      });
    } else if (name === "companyName") {
      setEditedCustomer({
        ...editedCustomer,
        company: { ...editedCustomer.company, companyName: value },
      });
    } else {
      setEditedCustomer({ ...editedCustomer, [name]: value });
    }
  };

  const handleSaveClick = () => {
    onSave(editedCustomer);
  };

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

  return (
    <div className="edit-customer-modal">
      <h2>Edit Customer</h2>
      <input
        type="text"
        name="firstName"
        value={editedCustomer.firstName}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="lastName"
        value={editedCustomer.lastName}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="email"
        value={editedCustomer.email}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="phoneNumber"
        value={editedCustomer.phoneNumber}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="address"
        value={editedCustomer.address}
        onChange={handleInputChange}
      />
      {customer.customerType === "COMPANY" && (
        <input
          type="text"
          name="companyName"
          value={editedCustomer.company.companyName}
          onChange={handleInputChange}
        />
      )}
      <label htmlFor="municipality">Municipality</label>
      <select
        name="municipalityID"
        value={editedCustomer.municipality.municipalityID}
        onChange={handleInputChange}
      >
        <option value="" defaultValue={editedCustomer.municipality.municipalityID} hidden>
          {editedCustomer.municipality.municipalityID} - {editedCustomer.municipality.municipalityName}
        </option>
        {municipalities.map((municipality) => (
          <option
            key={municipality.municipalityID}
            value={municipality.municipalityID}
          >
            {municipality.municipalityID} - {municipality.municipalityName}
          </option>
        ))}
      </select>
      <button onClick={handleSaveClick}>Save</button>
      <button onClick={onClose}>Cancel</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default EditCustomer;

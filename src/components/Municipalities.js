import React, { useState, useEffect } from 'react';
import userService from '../services/user.service';
import EventBus from "../common/EventBus";

const Municipalities = () => {
  const [municipalities, setMunicipalities] = useState([]);

  useEffect(() => {
    // Fetch data from your API (replace with your actual API endpoint)
    userService.getMunicipalities().then(
      (response) => {
        setMunicipalities(response.data);
      },
      (error) => {
        const _municipalities =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

          setMunicipalities(_municipalities);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }, []);
  console.log(municipalities);

  return (
    <div>
      <h1>Municipalities</h1>
      <table>
        <thead>
          <tr>
            <th>Municipality ID</th>
            <th>Municipality Name</th>
          </tr>
        </thead>
        <tbody>
          {municipalities.map((municipality) => (
            <tr key={municipality.municipalityID}>
              <td>{municipality.municipalityID}</td>
              <td>{municipality.municipalityName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Municipalities;

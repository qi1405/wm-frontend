import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authHeader from '../services/auth-header';

const Municipalities = () => {
  const [municipalities, setMunicipalities] = useState([]);

  useEffect(() => {
    // Fetch data from your API (replace with your actual API endpoint)
    axios.get('http://localhost:8080/api/municipalities/list', {headers: authHeader()})
      .then((response) => {
        setMunicipalities(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

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

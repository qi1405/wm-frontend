import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";
const API_MAIN = "http://localhost:8080/api/customers/";
const API_MUNICIPALITIES = "http://localhost:8080/api/municipalities/";
const API_PRODUCTS = "http://localhost:8080/api/products/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "mod", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};

const getCustomers = () => {
  return axios.get(API_MAIN + "list", { headers: authHeader() });
};

const createCustomer = data => {
  return axios.post(API_MAIN + "create", data, { headers: authHeader() });
};

const getMunicipalities = () => {
  return axios.get(API_MUNICIPALITIES + "list", { headers: authHeader() });
};

const getProducts = () => {
  return axios.get(API_PRODUCTS + "list", { headers: authHeader() });
};

const userService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
  getCustomers,
  createCustomer,
  getMunicipalities,
  getProducts
};

export default userService
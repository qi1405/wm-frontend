import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";
const API_MAIN = "http://localhost:8080/api/customers/";
const API_MUNICIPALITIES = "http://localhost:8080/api/municipalities/";
const API_PRODUCTS = "http://localhost:8080/api/products/";
const API_INVOICES = "http://localhost:8080/api/invoices/";

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

const getCustomerWithProducts = customerID => {
  return axios.get(API_MAIN + `${customerID}`, { headers: authHeader() });
};

const getProductByID = productID => {
  return axios.get(API_PRODUCTS + `${productID}`, { headers: authHeader() });
};

const createProduct = data => {
  return axios.post(API_PRODUCTS + "create", data, { headers: authHeader() });
}

const getInvoices = () => {
  return axios.get(API_INVOICES + "list", { headers: authHeader() });
};

const editCustomer = (customerID, data) => {
  return axios.put(API_MAIN + `update/${customerID}`, data, { headers: authHeader() });
};

const createInvoice = (data) => {
  return axios.post(API_INVOICES + "create-without-default", data, { headers: authHeader() });
};


const userService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
  getCustomers,
  createCustomer,
  getMunicipalities,
  getProducts,
  getCustomerWithProducts,
  createProduct,
  getProductByID,
  getInvoices,
  editCustomer,
  createInvoice
};

export default userService
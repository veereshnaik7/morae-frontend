import axios from "axios";

const API = axios.create({
  baseURL: "https://morae-backend.onrender.com/api/auth",
  withCredentials: true,
});

export default API;
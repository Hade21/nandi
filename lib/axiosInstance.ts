import axios from "axios";

const url = process.env.NEXT_PUBLIC_URL_SERVER;

const axiosInstance = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

import axios from "axios";
import { getAccessToken } from "../localStorage";

export const AuthService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 20000,
});

AuthService.interceptors.request.use(
  async (config) => {
    // Lấy token từ local storage
    const token = getAccessToken();

    // Nếu có token, thêm vào header Authorization với dạng "Bearer token"
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AuthService.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

export default AuthService;

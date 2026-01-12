import axios from "axios";
import Cookies from "universal-cookie";

export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

apiClient.interceptors.request.use((request) => {
  const cookies = new Cookies();
  const accessToken = cookies.get("access_token");

  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`;
  }
  return request;
});

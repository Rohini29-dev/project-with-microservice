import axios from "axios";

const API = "http://localhost:3004/api/payments";

export function createPayment(orderId) {
  return axios.post(
    `${API}/create/${orderId}`,
    {},
    {
      withCredentials: true,
    }
  );
}

export function verifyPayment(data) {
  return axios.post(`${API}/verify`, data, {
    withCredentials: true,
  });
}
import axios from "axios";

const API = "http://localhost:3007/api/seller/dashboard";

export function getMetrics() {
  return axios.get(`${API}/metrics`, {
    withCredentials: true,
  });
}

export function getOrders(page = 1, limit = 5) {
  return axios.get(`${API}/orders?page=${page}&limit=${limit}`, {
    withCredentials: true,
  });
}

export function getProducts() {
  return axios.get(`${API}/products`, {
    withCredentials: true,
  });
}

export function getOrderById(id) {
  return axios.get(`${API}/orders/${id}`, {
    withCredentials: true,
  });
}

export async function updateOrderStatus(orderId, status) {
  return axios.patch(
    `${API}/orders/${orderId}/status`,
    {
      status,
    },
    {
      withCredentials: true,
    }
  );
}

export function deleteProduct(id) {
  return axios.delete(`${API}/products/${id}`, {
    withCredentials: true,
  });
}
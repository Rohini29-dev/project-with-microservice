import axios from "axios";

const API = "http://localhost:3003/api/orders";

export function createOrder(shippingAddress) {
  return axios.post(
    API,
    {
      shippingAddress,
    },
    {
      withCredentials: true,
    }
  );
}

export function getMyOrders() {
  return axios.get(`${API}/me`, {
    withCredentials: true,
  });
}

export function getOrderById(id) {
  return axios.get(`${API}/${id}`, {
    withCredentials: true,
  });
}

export function cancelOrder(id) {
  return axios.post(
    `${API}/${id}/cancel`,
    {},
    {
      withCredentials: true,
    }
  );
}

export function updateOrderAddress(id, shippingAddress) {
  return axios.patch(
    `${API}/${id}/address`,
    {
      shippingAddress,
    },
    {
      withCredentials: true,
    }
  );
}
import axios from "axios";

const API = "http://localhost:3002/api/carts";

export function addToCart(productId, qty = 1) {
  return axios.post(
    API,
    {
      productId,
      qty,
    },
    {
      withCredentials: true,
    }
  );
}

export function getCart() {
  return axios.get(API, {
    withCredentials: true,
  });
}

export function updateCartItem(productId, qty) {
  return axios.patch(
    `${API}/items/${productId}`,
    { qty },
    {
      withCredentials: true,
    }
  );
}

export function removeCartItem(productId) {
  return axios.delete(`${API}/items/${productId}`, {
    withCredentials: true,
  });
}
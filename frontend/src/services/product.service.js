import axios from "axios";

const API = "http://localhost:3001/api/products";

export const getProducts = () => axios.get(API);


export async function createProduct(formData) {
  return axios.post(API_URL, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export const getSellerProducts = () => {
  return axios.get(
    "http://localhost:3001/api/products/seller",
    {
      withCredentials: true,
    }
  );
};

export const updateProduct = (id, data) => {
  return axios.patch(
    `http://localhost:3001/api/products/${id}`,
    data,
    {
      withCredentials: true,
    }
  );
};

export const getProductById = (id) => {
  return axios.get(
    `http://localhost:3001/api/products/${id}`
  );
};



export const deleteProduct = async (id) => {
  return axios.delete(`${API}/${id}`, {
    withCredentials: true,
  });
};
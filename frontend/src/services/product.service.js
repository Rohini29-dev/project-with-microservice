import axios from "axios";

const API_URL = "http://localhost:3001/api/products";

// CREATE PRODUCT
export const createProduct = async (formData) => {
  return await axios.post(API_URL, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// GET ALL PRODUCTS
// GET PRODUCTS WITH PAGINATION
export const getProducts = async ({
  skip = 0,
  limit = 6,
} = {}) => {
  return await axios.get(API_URL, {
    withCredentials: true,
    params: {
      skip,
      limit,
    },
  });
};

// GET PRODUCT BY ID
export const getProductById = async (productId) => {
  return await axios.get(`${API_URL}/${productId}`, {
    withCredentials: true,
  });
};

// UPDATE PRODUCT
export const updateProduct = async (productId, formData) => {
  return await axios.patch(
    `${API_URL}/${productId}`,
    formData,
    {
      withCredentials: true,
    }
  );
};

// DELETE PRODUCT
export const deleteProduct = async (productId) => {
  return await axios.delete(`${API_URL}/${productId}`, {
    withCredentials: true,
  });
};
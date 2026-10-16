import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

export const getCurrentUser = async () => {
  const response = await axios.get(
    `${API_URL}/me`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};


export const updateCurrentUser = async (payload) => {
  const response = await axios.put(
    `${API_URL}/users/me`,
    payload,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const registerUser = async (payload) => {
  const response = await axios.post(
    `${API_URL}/register`,
    payload,
    {
      withCredentials: true,
    }
  );

  return response.data;
};
export const loginUser = async (payload) => {
  const response = await axios.post(
    `${API_URL}/login`,
    payload,
    {
      withCredentials: true,
    }
  );

  return response.data;
};
export const logoutUser = async () => {
  const response = await axios.get(
    `${API_URL}/logout`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};



export const getUserAddresses = async () => {
  const response = await axios.get(
    `${API_URL}/users/me/addresses`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};


export const addUserAddress = async (payload) => {
  const response = await axios.post(
    `${API_URL}/users/me/addresses`,
    payload,
    {
      withCredentials: true,
    }
  );

  return response.data;
};


export const deleteUserAddress = async (addressId) => {
  const response = await axios.delete(
    `${API_URL}/users/me/addresses/${addressId}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const changePassword = async (payload) => {
  const response = await axios.put(
    `${API_URL}/users/me/password`,
    payload,
    {
      withCredentials: true,
    }
  );

  return response.data;
};
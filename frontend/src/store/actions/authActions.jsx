import {
  changePassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateCurrentUser,
  getUserAddresses,
  addUserAddress,
  deleteUserAddress,
} from "../../services/auth.service";

import { loadauth } from "../reducers/authSlice";

// ================= REGISTER =================
export const asyncauthRegister =
  (payload) => async (dispatch) => {
    try {
      const response =
        await registerUser(payload);

      if (response?.user) {
        dispatch(
          loadauth({
            user: response.user,
          })
        );
      }

      return response;
    } catch (error) {
      console.log(
        "REGISTER ERROR =>",
        error?.response?.data || error
      );

      throw error;
    }
  };


// ================= LOGIN =================
export const asyncauthLogin =
  (payload) => async (dispatch) => {
    try {
      const response =
        await loginUser(payload);

      if (response?.user) {
        dispatch(
          loadauth({
            user: response.user,
          })
        );
      }

      return response;
    } catch (error) {
      console.log(
        "LOGIN ERROR =>",
        error?.response?.data || error
      );

      throw error;
    }
  };


// ================= CHANGE PASSWORD =================
export const asyncChangePassword =
  (payload) => async (dispatch) => {
    try {
      const response =
        await changePassword(payload);

      console.log(
        "CHANGE PASSWORD RESPONSE =>",
        response
      );

      return response;
    } catch (error) {
      console.log(
        "CHANGE PASSWORD ERROR =>",
        error?.response?.data || error
      );

      throw error;
    }
  };


// ================= LOGOUT =================
export const asyncauthLogout =
  () => async (dispatch) => {
    try {
      const response =
        await logoutUser();

      dispatch(
        loadauth({
          user: null,
        })
      );

      return response;
    } catch (error) {
      console.log(
        "LOGOUT ERROR =>",
        error?.response?.data || error
      );

      throw error;
    }
  };


// ================= CURRENT USER =================
export const asyncCurrentUser =
  () => async (dispatch) => {
    try {
      const response =
        await getCurrentUser();

      console.log(
        "CURRENT USER RESPONSE =>",
        response
      );

      if (response?.user) {
        dispatch(
          loadauth({
            user: response.user,
          })
        );
      }

      return response;
    } catch (error) {
      console.log(
        "CURRENT USER ERROR =>",
        error?.response?.data ||
          error?.message
      );

      throw error;
    }
  };


// ================= UPDATE USER =================
export const asyncUpdateUser =
  (payload) => async (dispatch) => {
    try {
      console.log(
        "UPDATE USER PAYLOAD =>",
        payload
      );

      const response =
        await updateCurrentUser(payload);

      console.log(
        "UPDATE USER RESPONSE =>",
        response
      );

      if (response?.user) {
        dispatch(
          loadauth({
            user: response.user,
          })
        );
      }

      return response;
    } catch (error) {
      console.log(
        "UPDATE USER ERROR =>",
        error?.response?.data ||
          error?.message
      );

      throw error;
    }
  };


// =====================================================
// GET USER ADDRESSES
// =====================================================

export const asyncGetUserAddresses =
  () => async (dispatch) => {
    try {
      const response =
        await getUserAddresses();

      console.log(
        "GET USER ADDRESSES RESPONSE =>",
        response
      );

      return response;
    } catch (error) {
      console.log(
        "GET USER ADDRESSES ERROR =>",
        error?.response?.data ||
          error?.message
      );

      throw error;
    }
  };


// =====================================================
// ADD USER ADDRESS
// =====================================================

export const asyncAddUserAddress =
  (payload) => async (dispatch) => {
    try {
      console.log(
        "ADD USER ADDRESS PAYLOAD =>",
        payload
      );

      const response =
        await addUserAddress(payload);

      console.log(
        "ADD USER ADDRESS RESPONSE =>",
        response
      );

      return response;
    } catch (error) {
      console.log(
        "ADD USER ADDRESS ERROR =>",
        error?.response?.data ||
          error?.message
      );

      throw error;
    }
  };


// =====================================================
// DELETE USER ADDRESS
// =====================================================

export const asyncDeleteUserAddress =
  (addressId) => async (dispatch) => {
    try {
      

      const response =
        await deleteUserAddress(
          addressId
        );

     

      return response;
    } catch (error) {
      console.log(
        "DELETE USER ADDRESS ERROR =>",
        error?.response?.data ||
          error?.message
      );

      throw error;
    }
  };

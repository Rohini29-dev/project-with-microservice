import {
  cancelOrder,
  createOrder,
  getMyOrders,
  getOrderById,
} from "../../services/order.service";

import { loadorder } from "../reducers/orderSlice";

// =========================================
// GET MY ORDERS
// =========================================

export const asyncGetOrder =
  () => async (dispatch) => {
    try {
      const { data } = await getMyOrders();

      console.log(
        "CURRENT ORDER RESPONSE =>",
        data.orders
      );

      dispatch(
        loadorder(data.orders)
      );

      return data;

    } catch (error) {
      console.log(
        "CURRENT ORDER ERROR =>",
        error?.response?.data ||
          error?.message
      );

      throw error;
    }
  };


// =========================================
// CREATE ORDER
// =========================================

export const asyncCreateOrder =
  (payload) => async (dispatch) => {
    try {
      const res = await createOrder(
        payload
      );

      console.log(
        "CREATE ORDER RESPONSE =>",
        res
      );

      return res;

    } catch (error) {
      console.log(
        "CREATE ORDER ERROR =>",
        error?.response?.data ||
          error?.message
      );

      throw error;
    }
  };


// =========================================
// CANCEL ORDER
// =========================================

export const asyncCancelOrder =
  (id) => async (dispatch) => {
    try {
      const { data } =
        await cancelOrder(id);

      console.log(
        "CURRENT ORDER CANCEL RESPONSE =>",
        data
      );

      return data;

    } catch (error) {
      console.log(
        "CURRENT ORDER ERROR =>",
        error?.response?.data ||
          error?.message
      );

      throw error;
    }
  };


// =========================================
// GET ORDER BY ID
// =========================================

export const asyncgetorderById =
  (id) => async (dispatch) => {
    try {
      const { data } =
        await getOrderById(id);

      console.log(
        "GET ORDER BY ID RESPONSE =>",
        data
      );

      return data;

    } catch (error) {
      console.log(
        "GET ORDER BY ID ERROR =>",
        error?.response?.data ||
          error?.message
      );

      throw error;
    }
  };

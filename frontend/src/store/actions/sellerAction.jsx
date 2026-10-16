import {
  deleteProduct,
  getMetrics,
  getOrderById,
  getOrders,
  getProducts,
  updateOrderStatus,
} from "../../services/seller.service";

import {
  loadMetrics,
  loadOrders,
  loadProducts,
} from "../reducers/sellerSlice";


// ===============================
// GET SELLER METRICS
// ===============================

export const asyncGetMetrics =
  () =>
  async (dispatch) => {
    try {
      const { data } =
        await getMetrics();

      console.log(
        "ALL getMetrics RESPONSE =>",
        data
      );

      dispatch(
        loadMetrics(data)
      );

      return data;
    } catch (error) {
      console.log(
        "LOAD getMetrics ERROR =>",
        error
      );

      throw error;
    }
  };


// ===============================
// GET SELLER ORDERS
// ===============================

export const asyncGetOrder =
  (page = 1) =>
  async (dispatch) => {
    try {
      const { data } =
        await getOrders(page);

      console.log(
        "ALL getorder RESPONSE =>",
        data
      );

      dispatch(
        loadOrders(data)
      );

      return data;
    } catch (error) {
      console.log(
        "LOAD getOrders ERROR =>",
        error
      );

      throw error;
    }
  };


// ===============================
// GET SELLER PRODUCTS
// ===============================

export const asyncGetProduct =
  () =>
  async (dispatch) => {
    try {
      const { data } =
        await getProducts();

      console.log(
        "ALL getProduct RESPONSE =>",
        data
      );

      dispatch(
        loadProducts(data)
      );

      // data is already an array
      return data;
    } catch (error) {
      console.log(
        "LOAD getProducts ERROR =>",
        error
      );

      throw error;
    }
  };


// ===============================
// GET ORDER BY ID
// ===============================

export const asyncgetOrderById =
  (id) =>
  async (dispatch) => {
    try {
      const { data } =
        await getOrderById(id);

      console.log(
        "ALL getOrderById RESPONSE =>",
        data
      );

      return data;
    } catch (error) {
      console.log(
        "GET ORDER BY ID ERROR =>",
        error
      );

      throw error;
    }
  };


// ===============================
// UPDATE ORDER STATUS
// ===============================

export const asyncupdateOrder =
  (id, status) =>
  async (dispatch) => {
    try {
      console.log(
        "UPDATE ORDER =>",
        {
          id,
          status,
        }
      );

      const res =
        await updateOrderStatus(
          id,
          status
        );

      console.log(
        "UPDATE ORDER RESPONSE =>",
        res
      );

      return res;
    } catch (error) {
      console.log(
        "UPDATE ORDER ERROR =>",
        error
      );

      throw error;
    }
  };


// ===============================
// DELETE SELLER PRODUCT
// ===============================

export const asyncdeleteproduct =
  (id) =>
  async (dispatch) => {
    try {
      const res =
        await deleteProduct(id);

      console.log(
        "DELETE PRODUCT RESPONSE =>",
        res
      );

      /*
        SellerProducts.jsx already removes
        the deleted product from local state.

        So we do NOT need asyncloadproduct()
        here.
      */

      return res;
    } catch (error) {
      console.log(
        "DELETE PRODUCT ERROR =>",
        error
      );

      throw error;
    }
  };

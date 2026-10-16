import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../../services/product.service";

import {
  loadproduct,
  appendProducts,
  loadSingleProduct,
} from "../reducers/productSlice";


// =====================================================
// CREATE PRODUCT
// ==============================================
// =======

export const asynccreateProduct =
  (payload) => async (dispatch) => {
    try {
      const res = await createProduct(payload);

      await dispatch(
        asyncloadproduct(0, true)
      );

      return res;

    } catch (error) {
      console.log(
        "CREATE PRODUCT ERROR =>",
        error
      );

      throw error;
    }
  };


// =====================================================
// GET PRODUCTS - 6 AT A TIME
// =====================================================

export const asyncloadproduct =
  (skip = 0, firstLoad = false) =>
  async (dispatch) => {

    try {

      // Backend se sirf 6 products
      const { data } = await getProducts({
        skip,
        limit: 6,
      });

      console.log(
        "PRODUCT RESPONSE =>",
        data
      );


      // First request
      if (firstLoad || skip === 0) {

        dispatch(
          loadproduct(data.data)
        );

      }

      // Next requests
      else {

        dispatch(
          appendProducts(data.data)
        );

      }

      return data;

    } catch (error) {

      console.log(
        "LOAD PRODUCTS ERROR =>",
        error
      );

      throw error;
    }
  };


// =====================================================
// GET SINGLE PRODUCT BY ID
// =====================================================

export const asyncgetProductById = (id) => async (dispatch) => {
  try {
    const response = await getProductById(id);

    console.log("GET PRODUCT BY ID RESPONSE =>", response);

    dispatch(loadSingleProduct(response.data.data));

    return response;
  } catch (error) {
    console.log(
      "GET PRODUCT BY ID ERROR =>",
      error?.response?.data || error?.message
    );

    throw error;
  }
};

// =====================================================
// UPDATE PRODUCT
// =====================================================

export const asyncupdateproduct =
  (id, product) =>
  async (dispatch) => {

    try {

      const res =
        await updateProduct(
          id,
          product
        );

      await dispatch(
        asyncloadproduct(0, true)
      );

      return res;

    } catch (error) {

      console.log(
        "UPDATE PRODUCT ERROR =>",
        error
      );

      throw error;
    }
  };


// =====================================================
// DELETE PRODUCT
// =====================================================

export const asyncdeleteproduct =
  (id) =>
  async (dispatch) => {

    try {

      const res =
        await deleteProduct(id);

      

      await dispatch(
        asyncloadproduct(0, true)
      );

      return res;

    } catch (error) {

      console.log(
        "DELETE PRODUCT ERROR =>",
        error
      );

      throw error;
    }
  };
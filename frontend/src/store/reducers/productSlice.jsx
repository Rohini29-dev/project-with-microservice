import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  singleProduct: null,
};

const productSlice = createSlice({
  name: "products",

  initialState,

  reducers: {
    loadproduct: (state, action) => {
      state.products = action.payload;
    },

    appendProducts: (state, action) => {
      state.products = [
        ...state.products,
        ...action.payload,
      ];
    },

    loadSingleProduct: (state, action) => {
      state.singleProduct = action.payload;
    },
  },
});

export default productSlice.reducer;

export const {
  loadproduct,
  appendProducts,
  loadSingleProduct,
} = productSlice.actions;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  metrics: null,
  orders: [],
  products: [],
};

const sellerSlice = createSlice({
  name: "seller",

  initialState,

  reducers: {
    loadMetrics: (state, action) => {
      state.metrics = action.payload;
    },

    loadOrders: (state, action) => {
      state.orders = action.payload;
    },

    loadProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export default sellerSlice.reducer;

export const {
  loadMetrics,
  loadOrders,
  loadProducts,
} = sellerSlice.actions;
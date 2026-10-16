import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import productSlice from "./reducers/productSlice";
import cartSlice from "./reducers/cartSlice";
import orderSlice from "./reducers/orderSlice";
import paymentSlice from "./reducers/paymentSlice";
import sellerSlice from "./reducers/sellerSlice";

export const store = configureStore({
  reducer: {
    authReducer: authSlice,
    productReducer: productSlice,
    cartReducer: cartSlice,
    orderReducer: orderSlice,
    paymentReducer: paymentSlice,
    sellerReducer: sellerSlice,
  },
});
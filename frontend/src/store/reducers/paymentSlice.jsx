import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  payments: null,
};

const paymentSlice = createSlice({
  name: "payment",

  initialState,

  reducers: {
    loadpayment: (state, action) => {
      console.log("🔥 REDUCER RECEIVED PAYMENT =>", action.payload);
      state.payments = action.payload;
    },
  },
});

export default paymentSlice.reducer;

export const { loadpayment } = paymentSlice.actions;
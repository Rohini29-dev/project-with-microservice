import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
};

const orderSlice = createSlice({
  name: "order",

  initialState,

  reducers: {
    loadorder: (state, action) => {
      state.orders = action.payload;
    },
  },
});


export default orderSlice.reducer;
export const  {loadorder} = orderSlice.actions
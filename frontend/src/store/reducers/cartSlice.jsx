import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  carts: null,
};

const cartSlice = createSlice({
  name: "carts",

  initialState,

  reducers: {
    loadcart: (state, action) => {
      state.carts = action.payload;
    },
  },
});


export default cartSlice.reducer;
export const  {loadcart} = cartSlice.actions
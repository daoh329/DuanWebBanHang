import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
};

export const orders = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrders: (state, action) => {
      state.orders = action.payload.orders;
    },
  },
});
export const { addOrders } = orders.actions;
export default orders.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
};

export const reloadSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reloadPage: (state, action) => {
      state.status = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { reloadPage } = reloadSlice.actions;

export default reloadSlice.reducer;

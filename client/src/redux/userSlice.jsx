import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  name: "",
  email: "",
  phone: "",
  picture: "",
  permission: "",
  isLocked: null,
};

export const counterSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    update: (state, action) => {
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.phone = action.payload.phone;
        state.picture = action.payload.picture;
        state.permission = action.payload.permission;
        state.isLocked = action.payload.isLocked;
    },
  },
});

// Action creators are generated for each case reducer function
export const { update } = counterSlice.actions;

export default counterSlice.reducer;

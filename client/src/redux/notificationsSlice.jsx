import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification:(state, action) => {
      state.notifications = action.payload;
    },
    updateNotification: (state, action) => {
      const { id, newStatus } = action.payload;
      const notificationToUpdate = state.notifications.find((notification) => notification.id === id);

      if (notificationToUpdate) {
        notificationToUpdate.is_read = newStatus;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { addNotification, updateNotification } = notificationsSlice.actions;

export default notificationsSlice.reducer;

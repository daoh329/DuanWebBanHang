import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./userSlice";
import notificationsReducer from "./notificationsSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        notifications: notificationsReducer,
    },
  })
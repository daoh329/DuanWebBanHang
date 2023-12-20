import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import notificationsReducer from "./notificationsSlice";
import cartReducer from "./cartSlice";
import orders from "./testNotifiOrder";


export const store = configureStore({
  reducer: {
    user: userReducer,
    notifications: notificationsReducer,
    cart: cartReducer,
    orders: orders,
  },
});

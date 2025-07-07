import { configureStore } from "@reduxjs/toolkit";
import deviceReducer from "./features/deviceSlice";
import tabReducer from "./features/tabSlice";

export const store = configureStore({
  reducer: {
    device: deviceReducer,
    tab:tabReducer,
  },
});

// 👇 These are types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

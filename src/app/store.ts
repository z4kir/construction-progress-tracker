import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import deviceReducer from "./features/deviceSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    device: deviceReducer,
  },
});

// 👇 These are types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

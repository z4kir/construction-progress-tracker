import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// 👇 TypeScript: describes the shape of your state
interface CounterState {
  value: number;
}

// 👇 Initial state
const initialState: CounterState = {
  value: 0,
};

// 👇 Redux logic
const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

// 👇 Export actions and reducer
export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;

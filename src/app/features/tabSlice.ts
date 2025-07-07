// store/tabSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface TabState {
  currentTab: string;
}

const initialState: TabState = {
  currentTab: "typical", // 👈 Initial tab
};

export const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    setTab: (state, action: PayloadAction<string>) => {
      state.currentTab = action.payload;
    },
  },
});

export const { setTab } = tabSlice.actions;

export default tabSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

type DeviceType = "mobile" | "tablet" | "desktop";

interface DeviceState {
  type: DeviceType;
}

const getDeviceType = (): DeviceType => {
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
};

const initialState: DeviceState = {
  type: getDeviceType(),
};

const deviceSlice = createSlice({
  name: "devce",
  initialState,
  reducers: {
    setDeviceType: (state, action) => {
      state.type = action.payload;
    },
  },
});

export const { setDeviceType } = deviceSlice.actions;
export default deviceSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

export const navbarSlice = createSlice({
  name: "navbar",
  initialState: {
    activeKey: "1",
  },
  reducers: {
    setActiveKey: (state, { payload }) => {
      state.activeKey = payload;
    },
  },
});

export const { setActiveKey } = navbarSlice.actions;
export default navbarSlice.reducer;

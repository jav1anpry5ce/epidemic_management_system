import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getGraphicalData = createAsyncThunk(
  "get/graphical/data",
  async (data) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(
      `/api/graph/${data.year}/${data.month}`,
      config
    );
    if (response.status === 200) {
      const data = response.data;
      return { data };
    }
  }
);

export const graphSlice = createSlice({
  name: "graph",
  initialState: {
    loading: false,
    data: null,
  },
  reducers: {
    clearState: (state) => {
      state.data = null;
    },
  },
  extraReducers: {
    [getGraphicalData.pending]: (state) => {
      state.loading = true;
    },
    [getGraphicalData.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.data = payload.data;
    },
    [getGraphicalData.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export const { clearState } = graphSlice.actions;
export default graphSlice.reducer;

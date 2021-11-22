import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getTest = createAsyncThunk(
  "get/test",
  async (id, { rejectWithValue }) => {
    const config = {
      headers: {
        "CONTENT-TYPE": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    const data = {
      id,
    };
    try {
      const response = await axios.post("/api/testing/", data, config);
      if (response.status === 200) {
        const testing = response.data;
        return { testing };
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getVac = createAsyncThunk(
  "get/vac",
  async (id, { rejectWithValue }) => {
    const config = {
      headers: {
        "CONTENT-TYPE": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    const data = {
      id,
    };
    try {
      const response = await axios.post("/api/vaccination/", data, config);
      if (response.status === 200) {
        const vaccination = response.data;
        return { vaccination };
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateVac = createAsyncThunk(
  "update/vac",
  async (data, { rejectWithValue }) => {
    const config = {
      headers: {
        "CONTENT-TYPE": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    try {
      await axios.patch("/api/vaccination/", data, config);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateTest = createAsyncThunk(
  "update/test",
  async (data, { rejectWithValue }) => {
    const config = {
      headers: {
        "CONTENT-TYPE": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    try {
      await axios.patch("/api/testing/", data, config);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const TestVacSlice = createSlice({
  name: "TestVac",
  initialState: {
    loading: false,
    Testing: null,
    Vaccination: null,
    returnType: null,
    success: false,
    testMessage: null,
    vacMessage: null,
    message: null,
    unauthorized: false,
    dose: null,
  },
  reducers: {
    clearState: (state) => {
      state.Vaccination = null;
      state.Testing = null;
      state.returnType = null;
      state.success = false;
      state.testMessage = null;
      state.vacMessage = null;
      state.unauthorized = false;
      state.message = null;
      state.loading = false;
      state.dose = null;
    },
  },
  extraReducers: {
    [getTest.pending]: (state) => {
      state.loading = true;
      state.message = null;
    },
    [getTest.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.Testing = payload.testing;
      state.returnType = "Testing";
      state.message = null;
    },
    [getTest.rejected]: (state) => {
      state.loading = false;
      state.unauthorized = true;
      state.message = null;
    },
    [getVac.pending]: (state) => {
      state.loading = true;
      state.message = null;
    },
    [getVac.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.Vaccination = payload.vaccination.data;
      state.dose = payload.vaccination.shot;
      state.returnType = "Vaccination";
      state.message = null;
    },
    [getVac.rejected]: (state, { payload }) => {
      state.loading = false;
      try {
        state.vacMessage = payload.Message;
      } catch (err) {
        state.message = "Something went wrong!";
      }
      state.unauthorized = true;
      state.message = null;
    },
    [updateVac.pending]: (state) => {
      state.loading = true;
      state.message = null;
    },
    [updateVac.fulfilled]: (state) => {
      state.loading = false;
      state.success = true;
      state.message = null;
    },
    [updateVac.rejected]: (state, { payload }) => {
      state.loading = false;
      try {
        state.message = payload.Message;
      } catch (err) {
        state.message = "Something went wrong!";
      }
    },
    [updateTest.pending]: (state) => {
      state.loading = true;
      state.message = null;
    },
    [updateTest.fulfilled]: (state) => {
      state.loading = false;
      state.success = true;
      state.message = null;
    },
    [updateTest.rejected]: (state, { payload }) => {
      state.loading = false;
      try {
        state.message = payload.Message;
      } catch (err) {
        state.message = "Something went wrong!";
      }
      state.success = false;
    },
  },
});

export default TestVacSlice.reducer;
export const { clearState } = TestVacSlice.actions;

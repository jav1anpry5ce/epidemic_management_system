import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const register = createAsyncThunk(
  "register",
  async (data, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    try {
      await axios.post("auth/register/", data, config);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const activate = createAsyncThunk(
  "activate",
  async (data, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      await axios.post("auth/activate/", data, config);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "login",
  async (data, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.post("auth/login/", data, config);
      if (response.status === 200) {
        const data = response.data;
        return { data };
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const logout = createAsyncThunk("logout", async () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + sessionStorage.getItem("token"),
    },
  };
  const data = {};
  await axios.post("auth/logout", data, config);
});

export const changePassword = createAsyncThunk(
  "changePassword",
  async (data, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    try {
      await axios.patch("auth/change-password/", data, config);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const resetRequest = createAsyncThunk(
  "reset/request",
  async (data, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    try {
      await axios.post("auth/reset-request/", data, config);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "reset/password",
  async (data, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      await axios.post("auth/reset/", data, config);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    username: sessionStorage.getItem("username"),
    is_auth: String(true) === sessionStorage.getItem("is_auth"),
    is_location_admin:
      String(true) === sessionStorage.getItem("is_location_admin"),
    is_moh_staff: String(true) === sessionStorage.getItem("is_moh_staff"),
    is_moh_admin: String(true) === sessionStorage.getItem("is_moh_admin"),
    can_update_test: String(true) === sessionStorage.getItem("can_update_test"),
    can_update_vaccine:
      String(true) === sessionStorage.getItem("can_update_vaccine"),
    can_check_in: String(true) === sessionStorage.getItem("can_check_in"),
    can_receive_location_batch:
      String(true) === sessionStorage.getItem("can_receive_location_batch"),
    token: sessionStorage.getItem("token"),
    location: sessionStorage.getItem("location"),
    message: null,
    success: false,
  },
  reducers: {
    clearState: (state) => {
      state.success = false;
      state.message = null;
      state.loading = false;
    },
  },
  extraReducers: {
    [register.pending]: (state) => {
      state.loading = true;
      state.message = null;
    },
    [register.fulfilled]: (state) => {
      state.loading = false;
      state.success = true;
      state.message = null;
    },
    [register.rejected]: (state, { payload }) => {
      state.loading = false;
      state.success = false;
      try {
        state.message = payload.Message;
      } catch (err) {
        state.message = "Something went wrong!";
      }
    },
    [activate.pending]: (state) => {
      state.loading = true;
      state.message = null;
    },
    [activate.fulfilled]: (state) => {
      state.loading = false;
      state.success = true;
    },
    [activate.rejected]: (state, { payload }) => {
      state.loading = false;
      state.success = false;
      try {
        state.message = payload.Message;
      } catch (err) {
        state.message = "Something went wrong!";
      }
    },
    [login.pending]: (state) => {
      state.loading = true;
      state.message = null;
    },
    [login.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.username = payload.data.username;
      state.is_auth = true;
      state.token = payload.data.auth_token;
      state.is_location_admin = payload.data.is_location_admin;
      state.is_moh_staff = payload.data.is_moh_staff;
      state.is_moh_admin = payload.data.is_moh_admin;
      state.can_check_in = payload.data.can_check_in;
      state.can_update_test = payload.data.can_update_test;
      state.can_update_vaccine = payload.data.can_update_vaccine;
      state.can_receive_location_batch =
        payload.data.can_receive_location_batch;
      state.location = payload.data.location;
      state.message = null;
      sessionStorage.setItem("username", payload.data.username);
      sessionStorage.setItem("is_auth", true);
      sessionStorage.setItem(
        "is_location_admin",
        payload.data.is_location_admin
      );
      sessionStorage.setItem("token", payload.data.auth_token);
      sessionStorage.setItem("can_update_test", payload.data.can_update_test);
      sessionStorage.setItem(
        "can_update_vaccine",
        payload.data.can_update_vaccine
      );
      sessionStorage.setItem("can_check_in", payload.data.can_check_in);
      sessionStorage.setItem("location", payload.data.location);
      sessionStorage.setItem("is_moh_staff", payload.data.is_moh_staff);
      sessionStorage.setItem("is_moh_admin", payload.data.is_moh_admin);
      sessionStorage.setItem(
        "can_receive_location_batch",
        payload.data.can_receive_location_batch
      );
      sessionStorage.setItem("_expiredTime", Date.now() + 60 * 60 * 1000);
    },
    [login.rejected]: (state, { payload }) => {
      state.loading = false;
      try {
        state.message = payload.Message;
      } catch (err) {
        state.message = "Something went wrong!";
      }
    },
    [logout.pending]: (state) => {
      state.loading = true;
    },
    [logout.fulfilled]: (state) => {
      state.loading = false;
      state.username = null;
      state.is_auth = false;
      state.token = null;
      state.is_location_admin = false;
      state.is_moh_staff = false;
      state.is_moh_admin = false;
      state.can_update_vaccine = false;
      state.can_update_test = false;
      state.can_check_in = false;
      state.can_receive_location_batch = false;
      state.location = null;
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("is_auth");
      sessionStorage.removeItem("is_location_admin");
      sessionStorage.removeItem("can_update_test");
      sessionStorage.removeItem("can_update_vaccine");
      sessionStorage.removeItem("can_check_in");
      sessionStorage.removeItem("is_moh_staff");
      sessionStorage.removeItem("is_moh_admin");
      sessionStorage.removeItem("can_receive_location_batch");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("location");
    },
    [logout.rejected]: (state) => {
      state.loading = false;
    },
    [changePassword.pending]: (state) => {
      state.loading = true;
      state.message = null;
    },
    [changePassword.fulfilled]: (state) => {
      state.loading = false;
      state.message = null;
      state.success = true;
    },
    [changePassword.rejected]: (state, { payload }) => {
      state.loading = false;
      try {
        state.message = payload.Message;
      } catch (err) {
        state.message = "Something went wrong.";
      }
    },
    [resetRequest.pending]: (state) => {
      state.loading = true;
      state.message = null;
    },
    [resetRequest.fulfilled]: (state) => {
      state.loading = false;
      state.message = null;
      state.success = true;
    },
    [resetRequest.rejected]: (state, { payload }) => {
      state.loading = false;
      try {
        state.message = payload.Message;
      } catch (err) {
        state.message = "Something went wrong.";
      }
    },
    [resetPassword.pending]: (state) => {
      state.loading = true;
      state.message = null;
    },
    [resetPassword.fulfilled]: (state) => {
      state.loading = false;
      state.message = null;
      state.success = true;
    },
    [resetPassword.rejected]: (state, { payload }) => {
      state.loading = false;
      try {
        state.message = payload.Message;
      } catch (err) {
        state.message = "Something went wrong.";
      }
    },
  },
});

export const { clearState } = authSlice.actions;
export default authSlice.reducer;

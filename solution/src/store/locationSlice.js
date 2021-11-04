import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getLocation = createAsyncThunk("get/location", async () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.get("api/location", config);
  if (response.status === 200) {
    const location = response.data;
    return { location };
  }
});

export const getLocationByParish = createAsyncThunk(
  "get/location/byParish",
  async (parish) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(`api/get-location/${parish}`, config);
    if (response.status === 200) {
      const locations = response.data;
      return { locations };
    }
  }
);

export const getType = createAsyncThunk("get/type", async (value) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const data = {
    value,
  };
  const response = await axios.post("api/location/", data, config);
  if (response.status === 200) {
    const offers = response.data;
    return { offers };
  }
});

export const getAppointments = createAsyncThunk(
  "get/appointments",
  async (data) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    const response = await axios.post(
      "api/location/appointments",
      data,
      config
    );
    if (response.status === 200) {
      const appointments = response.data;
      return { appointments };
    }
  }
);

export const getAppointment = createAsyncThunk(
  "get/appointment",
  async (data) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    const response = await axios.post(
      "api/location/appointments",
      data,
      config
    );
    if (response.status === 200) {
      const appointment = response.data;
      return { appointment };
    }
  }
);

export const checkIn = createAsyncThunk(
  "check/in",
  async (data, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    try {
      await axios.patch("api/location/appointments", data, config);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const locationBreakdown = createAsyncThunk(
  "location/breakdown",
  async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    const response = await axios.get("/api/location-breakdown/", config);
    if (response.status === 200) {
      const data = response.data;
      return { data };
    }
  }
);

export const receiveBatch = createAsyncThunk(
  "receive/batch",
  async (data, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      await axios.patch("/api/update-batch/", data, config);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const locationSlice = createSlice({
  name: "location",
  initialState: {
    locations: [],
    data: [],
    loading: false,
    aLoading: false,
    appointments: null,
    appointment: null,
    success: false,
    message: null,
    error: false,
    locationData: null,
  },
  reducers: {
    clearState: (state) => {
      state.appointment = null;
      state.appointments = null;
      state.success = false;
      state.message = null;
      state.error = false;
      state.loading = false;
      state.locationData = null;
    },
  },
  extraReducers: {
    [getLocation.pending]: (state) => {
      state.loading = true;
    },
    [getLocation.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.locations = payload.location;
    },
    [getLocation.rejected]: (state) => {
      state.loading = false;
    },
    [getLocationByParish.pending]: (state) => {
      state.loading = true;
    },
    [getLocationByParish.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.locations = payload.locations;
    },
    [getLocationByParish.rejected]: (state) => {
      state.loading = false;
    },
    [getType.pending]: (state) => {
      state.loading = true;
    },
    [getType.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.data = payload.offers;
    },
    [getType.rejected]: (state) => {
      state.loading = false;
    },
    [getAppointments.pending]: (state) => {
      state.loading = true;
      state.appointments = null;
    },
    [getAppointments.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.appointments = payload.appointments;
    },
    [getAppointments.rejected]: (state) => {
      state.loading = false;
    },
    [getAppointment.pending]: (state) => {
      state.aLoading = true;
      state.appointment = null;
      state.error = false;
    },
    [getAppointment.fulfilled]: (state, { payload }) => {
      state.aLoading = false;
      state.appointment = payload.appointment;
    },
    [getAppointment.rejected]: (state) => {
      state.aLoading = false;
    },
    [checkIn.pending]: (state) => {
      state.aLoading = true;
      state.success = false;
      state.message = null;
      state.error = false;
    },
    [checkIn.fulfilled]: (state) => {
      state.aLoading = false;
      state.success = true;
      state.appointment = null;
      state.message = null;
      state.error = false;
    },
    [checkIn.rejected]: (state, { payload }) => {
      state.aLoading = false;
      state.success = false;
      try {
        state.message = payload.Message;
      } catch (err) {
        state.message = "Something went wrong!";
      }
      state.error = true;
    },
    [locationBreakdown.pending]: (state) => {
      state.loading = true;
    },
    [locationBreakdown.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.locationData = payload.data;
    },
    [locationBreakdown.rejected]: (state) => {
      state.loading = false;
    },
    [receiveBatch.pending]: (state) => {
      state.loading = true;
      state.message = null;
      state.success = false;
    },
    [receiveBatch.fulfilled]: (state) => {
      state.loading = false;
      state.success = true;
    },
    [receiveBatch.rejected]: (state, { payload }) => {
      state.loading = false;
      state.success = false;
      try {
        state.message = payload.Message;
      } catch (err) {
        state.message = "Something went wrong!";
      }
    },
  },
});

export const { clearState } = locationSlice.actions;
export default locationSlice.reducer;

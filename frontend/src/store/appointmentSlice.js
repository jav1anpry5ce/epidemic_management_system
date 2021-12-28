import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const makeAppointment = createAsyncThunk(
  "make/appointment",
  async (data, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    let formData = new FormData();
    formData.append("tax_number", data.tax_number);
    formData.append("title", data.title);
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("date_of_birth", data.date_of_birth);
    formData.append("gender", data.gender);
    formData.append("street_address", data.street_address);
    formData.append("city", data.city);
    formData.append("parish", data.parish);
    formData.append("country", data.country);
    formData.append("location", data.location);
    formData.append("date", data.date);
    formData.append("time", data.time);
    formData.append("type", data.type);
    formData.append("patient_choice", data.patient_choice);
    if (data.image) {
      formData.append("image", data.image);
    }
    formData.append("identification", data.identification);
    formData.append("kin_first_name", data.kin_first_name);
    formData.append("kin_last_name", data.kin_last_name);
    formData.append("kin_email", data.kin_email);
    formData.append("kin_phone", data.kin_phone);
    formData.append("rep_first_name", data.rep_first_name);
    formData.append("rep_last_name", data.rep_last_name);
    formData.append("rep_email", data.rep_email);
    formData.append("rep_phone", data.rep_phone);
    try {
      const response = await axios.post("/api/appointments/", formData, config);
      if (response.status === 201) {
        const info = response.data;
        return { info };
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const searchAppointments = createAsyncThunk(
  "search/appointments",
  async (q) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = {
      q,
    };
    const response = await axios.post(
      "/api/manage/appointments/",
      data,
      config
    );
    if (response.status === 200) {
      const appointments = response.data;
      return { appointments };
    }
  }
);

export const AppointmentSearch = createAsyncThunk(
  "appointment/search",
  async (shorten_id) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(
      `api/appointment-search/${shorten_id}`,
      config
    );
    if (response.status === 200) {
      const appointment = response.data;
      return { appointment };
    }
  }
);

export const updateAppointments = createAsyncThunk(
  "update/appointments",
  async (data, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.put(
        "/api/manage/appointments/",
        data,
        config
      );
      if (response.status === 202) {
        const appointments = response.data;
        return { appointments };
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {
    loading: false,
    success: false,
    appointmentInfo: null,
    appointments: null,
    appointment: null,
    message: null,
    searchMessage: null,
    secondDose: false,
  },
  reducers: {
    clearAppointments: (state) => {
      state.appointments = null;
      state.appointment = null;
    },
    updateState: (state) => {
      state.success = false;
    },
    clearState: (state) => {
      state.message = null;
      state.success = false;
      state.appointments = null;
      state.appointment = null;
      state.searchMessage = null;
      state.loading = false;
      state.secondDose = false;
    },
  },
  extraReducers: {
    [makeAppointment.pending]: (state) => {
      state.loading = true;
      state.message = null;
    },
    [makeAppointment.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.appointmentInfo = payload.info;
      state.message = null;
    },
    [makeAppointment.rejected]: (state, { payload }) => {
      state.loading = false;
      try {
        if (payload.email) {
          state.message = payload.email[0];
        }
        if (payload.tax_number) {
          state.message = payload.tax_number[0];
        }
        if (payload.image) {
          state.message = payload.image[0];
        }
        if (payload.identification) {
          state.message = payload.identification[0];
        }
        if (payload.Message) {
          state.message = payload.Message;
        }
      } catch (err) {
        state.message = "Something went wrong.";
      }
    },
    [searchAppointments.pending]: (state) => {
      state.loading = true;
      state.searchMessage = null;
    },
    [searchAppointments.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.appointments = payload.appointments.appointment;
      state.secondDose = payload.appointments.second_dose;
      state.searchMessage = null;
    },
    [searchAppointments.rejected]: (state) => {
      state.loading = false;
      state.searchMessage = "No results found for your search!";
    },
    [updateAppointments.pending]: (state) => {
      state.loading = true;
      state.message = null;
    },
    [updateAppointments.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.appointments = payload.appointments;
      state.message = null;
      state.success = true;
    },
    [updateAppointments.rejected]: (state, { payload }) => {
      state.loading = false;
      try {
        state.message = payload.Message;
      } catch (err) {
        state.message = "Something went wrong.";
      }
    },
    [AppointmentSearch.pending]: (state) => {
      state.loading = true;
      state.searchMessage = null;
    },
    [AppointmentSearch.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.appointment = payload.appointment;
      state.searchMessage = null;
    },
    [AppointmentSearch.rejected]: (state) => {
      state.loading = false;
      state.searchMessage = "No results found for your search!";
    },
  },
});

export const { clearAppointments, updateState, clearState } =
  appointmentSlice.actions;
export default appointmentSlice.reducer;

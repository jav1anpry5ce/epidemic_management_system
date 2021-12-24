import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const info = createAsyncThunk("info", async (id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  const response = await axios.get(`/api/patients/${id}`, config);
  if (response.status === 200) {
    const patient = response.data;
    return { patient };
  }
});

export const verify = createAsyncThunk("verify", async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  const response = await axios.post("/api/patients/verify/", data, config);
  if (response.status === 202) {
    const message = response.data;
    return { message };
  }
});

export const detailedInfo = createAsyncThunk(
  "details",
  async (data, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    try {
      const response = await axios.post(
        "/api/patients/detailed/verify/",
        data,
        config
      );
      if (response.status === 200) {
        const data = response.data;
        return { data };
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const vaccineInfo = createAsyncThunk("vaccine/Info", async (id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  const data = {
    id: id,
  };

  const response = await axios.post("/api/vaccination-record/", data, config);
  if (response.status === 200) {
    const record = response.data;
    return { record };
  }
});

export const testingInfo = createAsyncThunk("testing/Info", async (id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  const data = {
    id: id,
  };
  const response = await axios.post("/api/testing-record/", data, config);
  if (response.status === 200) {
    const record = response.data;
    return { record };
  }
});

export const updateInfoVerify = createAsyncThunk(
  "update/verify",
  async (data, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      await axios.post("api/patients/update/code/", data, config);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const codeVerify = createAsyncThunk(
  "code/verify",
  async (data, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.post(
        "/api/patients/verify/code/",
        data,
        config
      );
      if (response.status === 202) {
        const code = response.data;
        return { code };
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const UpdatePatientInfo = createAsyncThunk(
  "patient/update",
  async (data, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    let formData = new FormData();
    if (data.image) {
      formData.append("code", data.code);
      formData.append("phone", data.phone);
      formData.append("street_address", data.street_address);
      formData.append("city", data.city);
      formData.append("parish", data.parish);
      formData.append("country", data.country);
      formData.append("image", data.image);
    } else {
      formData.append("code", data.code);
      formData.append("phone", data.phone);
      formData.append("street_address", data.street_address);
      formData.append("city", data.city);
      formData.append("parish", data.parish);
      formData.append("country", data.country);
    }
    try {
      await axios.put("api/patients/update", formData, config);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getPreviousVaccine = createAsyncThunk(
  "getPreviousVaccine",
  async (data) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post("api/previous-vaccine/", data, config);
    const previousVaccine = response.data;
    return { previousVaccine };
  }
);

export const patientSlice = createSlice({
  name: "patient",
  initialState: {
    info: null,
    detailedinfo: null,
    vaccineRecord: null,
    testingRecord: null,
    kinInfo: null,
    loading: false,
    message: null,
    vMessage: null,
    success: false,
    previousVaccine: [],
  },
  reducers: {
    clearState: (state) => {
      state.info = null;
      state.vaccineRecord = null;
      state.testingRecord = null;
      state.loading = false;
      state.message = null;
      state.vMessage = null;
      state.detailedinfo = null;
      state.kinInfo = null;
    },
    updateSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: {
    [info.pending]: (state) => {
      state.loading = true;
    },
    [info.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.info = payload.patient;
    },
    [info.rejected]: (state) => {
      state.loading = false;
    },
    [vaccineInfo.pending]: (state) => {
      state.loading = true;
    },
    [vaccineInfo.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.vaccineRecord = payload.record;
    },
    [vaccineInfo.rejected]: (state) => {
      state.loading = false;
    },
    [testingInfo.pending]: (state) => {
      state.loading = true;
    },
    [testingInfo.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.testingRecord = payload.record;
    },
    [testingInfo.rejected]: (state) => {
      state.loading = false;
    },
    [verify.pending]: (state) => {
      state.loading = true;
      state.message = null;
      state.vMessage = null;
    },
    [verify.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.message = payload.message.Message;
    },
    [verify.rejected]: (state) => {
      state.loading = false;
      state.message = null;
    },
    [detailedInfo.pending]: (state) => {
      state.loading = true;
      state.vMessage = null;
    },
    [detailedInfo.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.detailedinfo = payload.data.patient;
      state.kinInfo = payload.data.kin;
      state.message = null;
      state.vMessage = null;
      state.success = true;
    },
    [detailedInfo.rejected]: (state, { payload }) => {
      state.loading = false;
      try {
        state.vMessage = payload.Message;
      } catch (err) {
        state.message = "Something went wrong!";
      }
    },
    [updateInfoVerify.pending]: (state) => {
      state.loading = true;
      state.message = null;
    },
    [updateInfoVerify.fulfilled]: (state) => {
      state.loading = false;
      state.success = true;
    },
    [updateInfoVerify.rejected]: (state, { payload }) => {
      state.loading = false;
      state.success = false;
      try {
        if (payload.Message) {
          state.message = payload.Message;
        } else {
          state.message = "Could not verify you!";
        }
      } catch (err) {
        state.message = "Could not verify you!";
      }
    },
    [codeVerify.pending]: (state) => {
      state.loading = true;
      state.message = null;
    },
    [codeVerify.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      sessionStorage.setItem("code", payload.code.Code);
    },
    [codeVerify.rejected]: (state, { payload }) => {
      state.loading = false;
      state.success = false;
      try {
        state.message = payload.Message;
      } catch (err) {
        state.message = "Could not verify";
      }
    },
    [UpdatePatientInfo.pending]: (state) => {
      state.loading = true;
    },
    [UpdatePatientInfo.fulfilled]: (state) => {
      state.loading = false;
      state.success = true;
      sessionStorage.removeItem("code");
    },
    [UpdatePatientInfo.rejected]: (state, { payload }) => {
      state.loading = false;
      state.success = false;
      try {
        state.message = payload.Message;
      } catch (err) {
        state.message = "Something went wrong!";
      }
    },
    [getPreviousVaccine.pending]: (state) => {
      state.loading = true;
    },
    [getPreviousVaccine.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.previousVaccine = payload.previousVaccine;
    },
    [getPreviousVaccine.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export const { clearState, updateSuccess } = patientSlice.actions;
export default patientSlice.reducer;

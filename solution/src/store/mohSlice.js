import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllPatients = createAsyncThunk("all/patients", async () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + sessionStorage.getItem("token"),
    },
  };
  const response = await axios.get("api/all-patients/", config);
  if (response.status === 200) {
    const patients = response.data;
    return { patients };
  }
});

export const getPatient = createAsyncThunk("get/patient", async (trn) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + sessionStorage.getItem("token"),
    },
  };
  const response = await axios.get(`api/get-patient/${trn}`, config);
  if (response.status === 200) {
    const data = response.data;
    return { data };
  }
});

export const getAllBatch = createAsyncThunk("getAllBatch", async () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + sessionStorage.getItem("token"),
    },
  };
  const response = await axios.get("api/location-batch/", config);
  if (response.status === 200) {
    const data = response.data;
    return { data };
  }
});

export const getBatchInfo = createAsyncThunk("getBatchInfo", async () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + sessionStorage.getItem("token"),
    },
  };
  const response = await axios.get("api/batch-info/", config);
  if (response.status === 200) {
    const data = response.data;
    return { data };
  }
});

export const addBatch = createAsyncThunk(
  "addBatch",
  async (data, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    try {
      const response = await axios.post("api/location-batch/", data, config);
      if (response.status === 201) {
        const data = response.data;
        return { data };
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const locationDetails = createAsyncThunk(
  "location/Details",
  async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    const response = await axios.get("api/location-details/", config);
    if (response.status === 200) {
      const data = response.data;
      return { data };
    }
  }
);

export const addLocation = createAsyncThunk(
  "add/location",
  async (data, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    try {
      await axios.post("api/add-location/", data, config);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getBreakdown = createAsyncThunk("get/breakdown", async () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + sessionStorage.getItem("token"),
    },
  };
  const response = await axios.get("api/get-breakdown/", config);
  if (response.status === 200) {
    const data = response.data;
    return { data };
  }
});

export const getPositiveCases = createAsyncThunk(
  "get/positive/cases",
  async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    const response = await axios.get("api/get-positive-cases/", config);
    if (response.status === 200) {
      const data = response.data;
      return { data };
    }
  }
);

export const getCase = createAsyncThunk("get/case", async (case_id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + sessionStorage.getItem("token"),
    },
  };
  const response = await axios.get(`api/get-case/${case_id}`, config);
  if (response.status === 200) {
    const data = response.data;
    return { data };
  }
});

export const updateCase = createAsyncThunk(
  "update/case",
  async (data, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    try {
      await axios.patch(`api/update-case/${data.case_id}`, data, config);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const mohSlice = createSlice({
  name: "MOH",
  initialState: {
    loading: false,
    caseLoading: false,
    patientLoading: false,
    patients: null,
    patient: null,
    test: null,
    vaccine: null,
    batches: null,
    batchInfo: null,
    batchData: null,
    success: false,
    message: null,
    locationDetails: null,
    breakdownData: null,
    positiveCases: null,
    caseData: null,
    updating: false,
  },
  reducers: {
    clearPatient: (state) => {
      state.patient = null;
    },
    clearState: (state) => {
      state.loading = false;
      state.caseLoading = false;
      state.patient = null;
      state.patients = null;
      state.batches = null;
      state.batchData = null;
      state.success = false;
      state.batchInfo = null;
      state.locationDetails = null;
      state.breakdownData = null;
      state.message = null;
      state.positiveCases = null;
      state.caseData = null;
      state.updating = false;
    },
    updateSuccess: (state) => {
      state.success = false;
      state.batchData = null;
    },
  },
  extraReducers: {
    [getAllPatients.pending]: (state) => {
      state.loading = true;
    },
    [getAllPatients.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.patients = payload.patients;
    },
    [getAllPatients.rejected]: (state) => {
      state.loading = false;
    },
    [getPatient.pending]: (state) => {
      state.patientLoading = true;
    },
    [getPatient.fulfilled]: (state, { payload }) => {
      state.patientLoading = false;
      state.patient = payload.data.patient;
      state.test = payload.data.tests;
      state.vaccine = payload.data.vaccines;
    },
    [getPatient.rejected]: (state) => {
      state.patientLoading = false;
    },
    [getAllBatch.pending]: (state) => {
      state.loading = true;
    },
    [getAllBatch.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.batches = payload.data;
    },
    [getAllBatch.rejected]: (state) => {
      state.loading = false;
    },
    [getBatchInfo.pending]: (state) => {
      state.loading = true;
    },
    [getBatchInfo.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.batchInfo = payload.data;
    },
    [getBatchInfo.rejected]: (state) => {
      state.loading = false;
    },
    [addBatch.pending]: (state) => {
      state.loading = true;
      state.message = null;
    },
    [addBatch.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.batchData = payload.data;
      state.message = null;
    },
    [addBatch.rejected]: (state, { payload }) => {
      state.loading = false;
      try {
        state.message = payload.Message;
      } catch (err) {
        state.message = "Something went wrong!";
      }
    },
    [locationDetails.pending]: (state) => {
      state.loading = true;
    },
    [locationDetails.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.locationDetails = payload.data;
    },
    [locationDetails.rejected]: (state) => {
      state.loading = false;
    },
    [addLocation.pending]: (state) => {
      state.loading = true;
      state.message = null;
    },
    [addLocation.fulfilled]: (state) => {
      state.loading = false;
      state.message = null;
      state.success = true;
    },
    [addLocation.rejected]: (state, { payload }) => {
      state.loading = false;
      try {
        state.message = payload.Message;
      } catch (err) {
        state.message = "Something went wrong!";
      }
    },
    [getBreakdown.pending]: (state) => {
      state.loading = true;
    },
    [getBreakdown.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.breakdownData = payload.data;
    },
    [getBreakdown.rejected]: (state) => {
      state.loading = false;
    },
    [getPositiveCases.pending]: (state) => {
      state.loading = true;
    },
    [getPositiveCases.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.positiveCases = payload.data;
    },
    [getPositiveCases.rejected]: (state) => {
      state.loading = false;
    },
    [getCase.pending]: (state) => {
      state.caseLoading = true;
    },
    [getCase.fulfilled]: (state, { payload }) => {
      state.caseLoading = false;
      state.caseData = payload.data;
    },
    [getCase.rejected]: (state) => {
      state.caseLoading = false;
    },
    [updateCase.pending]: (state) => {
      state.updating = true;
      state.message = null;
    },
    [updateCase.fulfilled]: (state) => {
      state.updating = false;
      state.success = true;
    },
    [updateCase.rejected]: (state, { payload }) => {
      state.updating = false;
      state.message = null;
      state.message = payload.Message;
    },
  },
});

export const { clearPatient, clearState, updateSuccess } = mohSlice.actions;
export default mohSlice.reducer;

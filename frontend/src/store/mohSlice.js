import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllPatients = createAsyncThunk("all/patients", async () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + sessionStorage.getItem("token"),
    },
  };
  const response = await axios.get("api/patients/", config);
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
  const response = await axios.get(`api/patients/details/${trn}/`, config);
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

export const getCase = createAsyncThunk("get/case", async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + sessionStorage.getItem("token"),
    },
  };
  const response = await axios.get(`api/cases/${data.type}/${data.id}`, config);
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
      await axios.patch(`api/cases/update/${data.case_id}`, data, config);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getAllLocations = createAsyncThunk(
  "get/all/locations",
  async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    const response = await axios.get("api/get-all-locations/", config);
    const data = response.data;
    return { data };
  }
);

export const getBatch = createAsyncThunk(
  "get/batch",
  async (batch_id, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    try {
      const response = await axios.get(`api/get-batch/${batch_id}`, config);
      const data = response.data;
      return { data };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const generateCsv = createAsyncThunk("generate/csv", async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + sessionStorage.getItem("token"),
    },
  };
  const response = await axios.get(
    `api/generate-csv/${data.date}/${data.type}`,
    config
  );
  if (response.status === 200) {
    const data = response.data;
    return { data };
  }
});

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
    batchInfo: null,
    locations: null,
    vaccinationSites: null,
    batchData: null,
    success: false,
    message: null,
    breakdownData: null,
    positiveCases: null,
    caseData: null,
    updating: false,
    bLoading: false,
    batch: null,
    generating: false,
    link: null,
    genSuccess: false,
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
      state.batchData = null;
      state.success = false;
      state.batchInfo = null;
      state.breakdownData = null;
      state.message = null;
      state.positiveCases = null;
      state.caseData = null;
      state.updating = false;
      state.vaccinationSites = null;
      state.locations = null;
      state.bLoading = false;
      state.batch = null;
      state.generating = false;
      state.link = null;
      state.genSuccess = false;
    },
    updateSuccess: (state) => {
      state.success = false;
      state.batchData = null;
      state.bLoading = false;
    },
    resetLink: (state) => {
      state.link = null;
      state.genSuccess = false;
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
    [getAllLocations.pending]: (state) => {
      state.loading = true;
    },
    [getAllLocations.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.locations = payload.data;
    },
    [getAllLocations.rejected]: (state) => {
      state.loading = false;
    },
    [getBatch.pending]: (state) => {
      state.bLoading = true;
    },
    [getBatch.fulfilled]: (state, { payload }) => {
      state.bLoading = false;
      state.batch = payload.data;
    },
    [getBatch.rejected]: (state) => {
      state.bLoading = false;
    },
    [generateCsv.pending]: (state) => {
      state.generating = true;
    },
    [generateCsv.fulfilled]: (state, { payload }) => {
      state.generating = false;
      state.link = payload.data.link;
      state.genSuccess = true;
    },
    [generateCsv.rejected]: (state) => {
      state.generating = false;
    },
  },
});

export const { clearPatient, clearState, updateSuccess, resetLink } =
  mohSlice.actions;
export default mohSlice.reducer;

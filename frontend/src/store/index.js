import { configureStore } from "@reduxjs/toolkit";
import patientReducer from "./patientSlice";
import appointmentReducer from "./appointmentSlice";
import TestVacReducer from "./TestVacSlice";
import locationReducer from "./locationSlice";
import authReducer from "./authSlice";
import navbarReducer from "./navbarSlice";
import mohReducer from "./mohSlice";
import graphReducer from "./graphSlice";

export default configureStore({
  reducer: {
    patient: patientReducer,
    appointment: appointmentReducer,
    testVac: TestVacReducer,
    location: locationReducer,
    auth: authReducer,
    navbar: navbarReducer,
    moh: mohReducer,
    graph: graphReducer,
  },
  devTools: false,
});

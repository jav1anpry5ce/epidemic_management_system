import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/authSlice";
import { Container, Header, Content, Footer as Foot } from "rsuite";
import { BackTop } from "antd";
import "./App.css";
import {
  ActivateAccount,
  AddLocation,
  MohAdd,
  AddStaff,
  AppointmentManagement,
  Appointments,
  BatchManagement,
  ChangePassword,
  CreateBatch,
  LocationAppointments,
  LocationHome,
  Locations,
  Login,
  MakeAppointment,
  Moh,
  NavBar,
  PatientInfo,
  Patients,
  PositiveCases,
  ReceiveBatch,
  ResetPassword,
  ResetPasswordRequest,
  UpdateInfo,
  VaccinationAndTesting,
  Home,
  Footer,
  NotFound,
  AddAvailability,
  GetRecords,
  PrivateRoutes,
  MOHRoutes,
  MOHAdminRoutes,
  AdminRoutes,
} from "./components";

import IdleTimer from "./utils/IdleTimer";

import background from "./asset/images/background2.jpg";

axios.defaults.baseURL = "http://192.168.0.200:8000/";

function App() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = new IdleTimer({
      timeout: 300,
      onTimeout: () => {
        if (auth.is_auth) {
          dispatch(logout()).then(() => (window.location = "/accounts/login"));
          alert("Your session was inactive for too long!");
        }
      },
      onExpired: () => {
        if (auth.is_auth) {
          dispatch(logout()).then(() => (window.location = "/accounts/login"));
          alert("You session is expired!");
        }
      },
    });
    return () => timer.cleanUp();
    // eslint-disable-next-line
  }, [auth.is_auth]);

  return (
    <Container
      style={{
        backgroundColor: "#f5f5f5",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
      className="min-h-screen"
    >
      <Router>
        <Header>
          <NavBar hide={hide} setHide={setHide} />
        </Header>

        <Content style={{ backgroundColor: "rgba(28, 37, 59, 0.3)" }}>
          <BackTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="patient-info/:uuid" element={<PatientInfo />} />
            <Route path="appointments">
              <Route index element={<Appointments />} />
              <Route path="create" element={<MakeAppointment />} />
              <Route path=":uuid" element={<AppointmentManagement />} />
            </Route>
            <Route path="accounts">
              <Route path="login" element={<Login />} />
              <Route
                path="activation/:token1/:token2"
                element={<ActivateAccount />}
              />
              <Route
                path="change-password"
                element={
                  <PrivateRoutes>
                    <ChangePassword />
                  </PrivateRoutes>
                }
              />
              <Route
                path="reset/password/request"
                element={
                  <PrivateRoutes>
                    <ResetPasswordRequest />
                  </PrivateRoutes>
                }
              />
              <Route path="password/reset/:token" element={<ResetPassword />} />
            </Route>
            <Route path={`${auth.location}`}>
              <Route
                index
                element={
                  <PrivateRoutes>
                    <LocationHome />
                  </PrivateRoutes>
                }
              />
              <Route
                path="test-vac/management"
                element={
                  <PrivateRoutes>
                    <VaccinationAndTesting />
                  </PrivateRoutes>
                }
              />
              <Route
                path="add-staff"
                element={
                  <AdminRoutes>
                    <AddStaff />
                  </AdminRoutes>
                }
              />
              <Route
                path="appointments"
                element={
                  <PrivateRoutes>
                    <LocationAppointments />
                  </PrivateRoutes>
                }
              />
              <Route
                path="add/availability"
                element={
                  <PrivateRoutes>
                    <AddAvailability />
                  </PrivateRoutes>
                }
              />
            </Route>
            <Route path="update/patient/info" element={<UpdateInfo />} />
            <Route path="moh">
              <Route
                index
                element={
                  <MOHRoutes>
                    <Moh />
                  </MOHRoutes>
                }
              />
              <Route
                path="patients"
                element={
                  <MOHRoutes>
                    <Patients />
                  </MOHRoutes>
                }
              />
              <Route
                path="positive-cases"
                element={
                  <MOHRoutes>
                    <PositiveCases />
                  </MOHRoutes>
                }
              />
              <Route path="batches">
                <Route
                  index
                  element={
                    <MOHRoutes>
                      <BatchManagement />
                    </MOHRoutes>
                  }
                />
                <Route
                  path="create"
                  element={
                    <MOHRoutes>
                      <CreateBatch />
                    </MOHRoutes>
                  }
                />
              </Route>
              <Route path="locations">
                <Route
                  index
                  element={
                    <MOHRoutes>
                      <Locations />
                    </MOHRoutes>
                  }
                />
                <Route
                  path="create"
                  element={
                    <MOHRoutes>
                      <AddLocation />
                    </MOHRoutes>
                  }
                />
              </Route>
              <Route
                path="add-staff"
                element={
                  <MOHAdminRoutes>
                    <MohAdd />
                  </MOHAdminRoutes>
                }
              />
            </Route>
            <Route path="got-the-stach/:uuid" element={<ReceiveBatch />} />
            <Route path="records" element={<GetRecords />} />
            <Route path="*" element={<NotFound setHide={setHide} />} />
          </Routes>
        </Content>
        <Foot>
          <Footer />
        </Foot>
      </Router>
    </Container>
  );
}

export default App;

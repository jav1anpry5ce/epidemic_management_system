import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/authSlice";
import { Container, Header, Content, Footer as Foot } from "rsuite";
import { BackTop } from "antd";
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
  Footer,
  NotFound,
  AddAvailability,
  GetRecords,
  PrivateRoutes,
  Home,
  StaffManagement,
  Inventory,
  UpdateInventory,
} from "./components";

import IdleTimer from "./utils/IdleTimer";

axios.defaults.baseURL = "https://javaughnpryce.live:8001/";

function App() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = new IdleTimer({
      timeout: 180,
      onTimeout: () => {
        if (auth.is_auth) {
          dispatch(logout()).then(() => {
            window.location = "/accounts/login";
          });
        }
      },
      onExpired: () => {
        if (auth.is_auth) {
          dispatch(logout()).then(() => {
            window.location = "/accounts/login";
          });
        }
      },
    });
    return () => timer.cleanUp();
    // eslint-disable-next-line
  }, [auth.is_auth]);

  return (
    <Container className="min-h-screen bg-[url('https://wallpaperaccess.com/full/624111.jpg')] bg-cover bg-fixed bg-no-repeat object-cover">
      <Router>
        <Header>
          <NavBar hide={hide} setHide={setHide} />
        </Header>

        <Content style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
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
              <Route index path="login" element={<Login />} />
              <Route
                path="activation/:token1/:token2"
                element={<ActivateAccount />}
              />
              <Route
                path="change-password"
                element={
                  <PrivateRoutes accessUser="staff">
                    <ChangePassword />
                  </PrivateRoutes>
                }
              />
              <Route
                path="reset/password/request"
                element={
                  <PrivateRoutes accessUser="reset">
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
                  <PrivateRoutes accessUser="staff">
                    <LocationHome />
                  </PrivateRoutes>
                }
              />
              <Route
                path="test-vac/management"
                element={
                  <PrivateRoutes accessUser="staff">
                    <VaccinationAndTesting />
                  </PrivateRoutes>
                }
              />
              <Route path="staff">
                <Route
                  index
                  element={
                    <PrivateRoutes accessUser="siteAdmin">
                      <StaffManagement />
                    </PrivateRoutes>
                  }
                />
                <Route
                  path="add"
                  element={
                    <PrivateRoutes accessUser="siteAdmin">
                      <AddStaff />
                    </PrivateRoutes>
                  }
                />
              </Route>
              <Route
                path="appointments"
                element={
                  <PrivateRoutes accessUser="staff">
                    <LocationAppointments />
                  </PrivateRoutes>
                }
              />
              <Route
                path="add/availability"
                element={
                  <PrivateRoutes accessUser="staff">
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
                  <PrivateRoutes accessUser="moh">
                    <Moh />
                  </PrivateRoutes>
                }
              />
              <Route
                path="patients"
                element={
                  <PrivateRoutes accessUser="moh">
                    <Patients />
                  </PrivateRoutes>
                }
              />
              <Route
                path="cases"
                element={
                  <PrivateRoutes accessUser="moh">
                    <PositiveCases />
                  </PrivateRoutes>
                }
              />
              <Route path="batches">
                <Route
                  index
                  element={
                    <PrivateRoutes accessUser="moh">
                      <BatchManagement />
                    </PrivateRoutes>
                  }
                />
                <Route
                  path="create"
                  element={
                    <PrivateRoutes accessUser="moh">
                      <CreateBatch />
                    </PrivateRoutes>
                  }
                />
              </Route>
              <Route path="sites">
                <Route
                  index
                  element={
                    <PrivateRoutes accessUser="moh">
                      <Locations />
                    </PrivateRoutes>
                  }
                />
                <Route
                  path="create"
                  element={
                    <PrivateRoutes accessUser="moh">
                      <AddLocation />
                    </PrivateRoutes>
                  }
                />
              </Route>
              <Route path="staff">
                <Route
                  index
                  element={
                    <PrivateRoutes accessUser="mohAdmin">
                      <StaffManagement />
                    </PrivateRoutes>
                  }
                />
                <Route
                  path="add"
                  element={
                    <PrivateRoutes accessUser="mohAdmin">
                      <MohAdd />
                    </PrivateRoutes>
                  }
                />
              </Route>
              <Route path="inventory">
                <Route
                  index
                  element={
                    <PrivateRoutes accessUser="mohAdmin">
                      <Inventory />
                    </PrivateRoutes>
                  }
                />
                <Route
                  path="update"
                  element={
                    <PrivateRoutes accessUser="mohAdmin">
                      <UpdateInventory />
                    </PrivateRoutes>
                  }
                />
              </Route>
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

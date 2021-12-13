import React, { useEffect, useState } from "react";
import axios from "axios";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
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
} from "./components";

import IdleTimer from "./functions/IdleTimer";

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
          dispatch(logout());
          alert("Your session was inactive for too long!");
        }
      },
      onExpired: () => {
        if (auth.is_auth) {
          dispatch(logout());
          alert("You session is expired!");
        }
      },
    });
    return () => timer.cleanUp();
  }, [auth.is_auth, dispatch]);

  return (
    <Container
      style={{
        backgroundColor: "#f5f5f5",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
      className="App"
    >
      <Router>
        <Header>
          <NavBar hide={hide} setHide={setHide} />
        </Header>

        <Content style={{ backgroundColor: "rgba(28, 37, 59, 0.3)" }}>
          <BackTop />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/patient-info/:uuid" component={PatientInfo} />
            <Route exact path="/appointments" component={Appointments} />
            <Route
              exact
              path="/create-appointment"
              component={MakeAppointment}
            />
            <Route
              exact
              path="/appointment/management/:uuid"
              component={AppointmentManagement}
            />
            <Route
              exact
              path="/test-vac/management"
              component={VaccinationAndTesting}
            />
            <Route exact path="/account/login" component={Login} />
            <Route exact path="/admin/add-staff" component={AddStaff} />
            <Route
              exact
              path="/account/activation/:token1/:token2"
              component={ActivateAccount}
            />
            <Route
              exact
              path={`/${auth.location}/appointments`}
              component={LocationAppointments}
            />
            <Route
              exact
              path="/account/change-password"
              component={ChangePassword}
            />
            <Route
              exact
              path="/reset/password/request"
              component={ResetPasswordRequest}
            />
            <Route
              exact
              path="/password/reset/:token"
              component={ResetPassword}
            />
            <Route exact path="/update/patient/info" component={UpdateInfo} />
            <Route exact path="/moh/patients" component={Patients} />
            <Route exact path="/moh/home" component={Moh} />
            <Route
              exact
              path="/moh/batch-management"
              component={BatchManagement}
            />
            <Route exact path="/moh/batch-creation" component={CreateBatch} />
            <Route exact path="/moh/locations" component={Locations} />
            <Route exact path="/moh/add-location" component={AddLocation} />
            <Route exact path="/moh/add-staff" component={MohAdd} />
            <Route
              exact
              path={`/${auth.location}/home`}
              component={LocationHome}
            />
            <Route exact path="/got-the-stach/:uuid" component={ReceiveBatch} />
            <Route exact path="/moh/positive-cases" component={PositiveCases} />
            <Route exact path="/add/availability" component={AddAvailability} />
            <Route component={() => <NotFound setHide={setHide} />} />
          </Switch>
        </Content>
        <Foot>
          <Footer />
        </Foot>
      </Router>
    </Container>
  );
}

export default App;

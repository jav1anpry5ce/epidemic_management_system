import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import { Input, InputGroup, Icon } from "rsuite";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import {
  searchAppointments,
  clearAppointments,
  updateState,
  clearState,
} from "../../store/appointmentSlice";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { Button, Placeholder } from "rsuite";
import { useHistory } from "react-router-dom";
import CustomPagination from "../CustomPagination";
import { open } from "../../functions/Notifications";
import { setActiveKey } from "../../store/navbarSlice";

export default function Appointments() {
  const dispatch = useDispatch();
  const history = useHistory();
  const appointments = useSelector((state) => state.appointment);
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage] = useState(6);
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItem =
    appointments.appointments && appointments.appointments.length >= 1
      ? appointments.appointments.slice(indexOfFirstItem, indexOfLastItem)
      : null;
  const pages = Math.ceil(
    appointments.appointments
      ? appointments.appointments.length / itemsPerPage
      : null
  );
  const paginate = (pageNumber) => {
    setActivePage(pageNumber);
  };
  const handelSearch = () => {
    dispatch(clearAppointments());
    setActivePage(1);
    dispatch(searchAppointments(q));
  };
  function navigate(link) {
    dispatch(clearAppointments());
    history.push(link);
  }
  const [q, setQ] = useState();
  useEffect(() => {
    dispatch(setActiveKey("4"));
    dispatch(clearAppointments());
  }, [dispatch]);
  useEffect(() => {
    if (appointments.success) {
      open(
        "success",
        "Appointment made successfully",
        "You can go to the appointment home page to reschedule or cancel your appointments"
      );
      dispatch(updateState());
    }
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [appointments.success]);
  return (
    <Container
      maxWidth="md"
      style={{ marginTop: "2%", marginBottom: "3%", color: "#f5f5f5" }}
    >
      <div>
        <Typography variant="h4">
          Learn the facts about COVID-19! Get vaccinated!
        </Typography>
        <Typography variant="h6" paragraph={true}>
          Here you are able to create and manage appointments.
        </Typography>
      </div>
      <Card>
        <CardHeader
          style={{ backgroundColor: "#383d42", color: "#fff" }}
          title={
            <Typography variant="h5" align="center">
              Appointment Finder
            </Typography>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="caption">
                Enter appointment ID to find your appointment
              </Typography>
              <InputGroup size="lg">
                <Input
                  onChange={(e) => {
                    setQ(e);
                  }}
                />
                <InputGroup.Button onClick={handelSearch}>
                  <Icon icon="search" />
                </InputGroup.Button>
              </InputGroup>
            </Grid>
            {appointments.searchMessage ? (
              <Grid item xs={12}>
                <Typography variant="h5" align="center">
                  {appointments.searchMessage}
                </Typography>
              </Grid>
            ) : null}
            {appointments.loading ? (
              <Grid item xs={12}>
                <Placeholder.Paragraph rows={2} active></Placeholder.Paragraph>
              </Grid>
            ) : null}
            <Grid item xs={12}>
              {appointments.appointments &&
              appointments.appointments.length >= 1 ? (
                currentItem.map((appointment) => (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Grid container spacing={1}>
                            <Grid item xs={2}>
                              <Typography variant="caption">
                                First Name
                              </Typography>
                              <br />
                              <Typography variant="caption">
                                {appointment.patient.first_name}
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Typography variant="caption">
                                Last Name
                              </Typography>
                              <br />
                              <Typography variant="caption">
                                {appointment.patient.last_name}
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Typography variant="caption">Date</Typography>
                              <br />
                              <Typography variant="caption">
                                {appointment.date}
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Typography variant="caption">Time</Typography>
                              <br />
                              <Typography variant="caption">
                                {appointment.time}
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Typography variant="caption">Type</Typography>
                              <br />
                              <Typography variant="caption">
                                {appointment.type}
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Typography variant="caption">Manage</Typography>
                              <br />
                              <Button
                                size="xs"
                                onClick={() =>
                                  navigate(
                                    "/appointment/management/" + appointment.id
                                  )
                                }
                                appearance="primary"
                              >
                                View
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                ))
              ) : appointments.appointments ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Grid container spacing={0}>
                          <Grid item xs={2}>
                            <Typography variant="caption">
                              First Name
                            </Typography>
                            <br />
                            <Typography variant="caption">
                              {appointments.appointments.patient.first_name}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant="caption">Last Name</Typography>
                            <br />
                            <Typography variant="caption">
                              {appointments.appointments.patient.last_name}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant="caption">Date</Typography>
                            <br />
                            <Typography variant="caption">
                              {appointments.appointments.date}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant="caption">Time</Typography>
                            <br />
                            <Typography variant="caption">
                              {new Date(
                                "1990-01-01 " + appointments.appointments.time
                              )
                                .toLocaleTimeString()
                                .replace(/:\d+ /, " ")}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant="caption">Status</Typography>
                            <br />
                            <Typography variant="caption">
                              {appointments.appointments.status}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant="caption">Manage</Typography>
                            <br />
                            <Button
                              size="xs"
                              onClick={() =>
                                navigate(
                                  "/appointment/management/" +
                                    appointments.appointments.id
                                )
                              }
                              appearance="primary"
                            >
                              View
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={() => history.push("/create-appointment")}
                appearance="primary"
              >
                Make an Appointment
              </Button>
            </Grid>

            {appointments.appointments &&
            appointments.appointments.length >= 6 ? (
              <Grid item xs={12}>
                <CustomPagination
                  pages={pages}
                  activePage={activePage}
                  paginate={paginate}
                />
              </Grid>
            ) : null}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

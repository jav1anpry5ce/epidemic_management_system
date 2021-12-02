import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import { Input, Card } from "antd";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import {
  AppointmentSearch,
  clearAppointments,
  updateState,
  clearState,
} from "../../store/appointmentSlice";
import Typography from "@mui/material/Typography";
import { Button, Placeholder } from "rsuite";
import { useHistory } from "react-router-dom";
import CustomPagination from "../CustomPagination";
import { open } from "../../functions/Notifications";
import { setActiveKey } from "../../store/navbarSlice";

const { Search } = Input;

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
    dispatch(AppointmentSearch(q));
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
        "A text message has been sent to the you confirming your appointment.\n You can managing your appointment by clicking on the link that was sent to you or use the code provided in the text message."
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
        <Typography variant="h4" style={{ color: "white" }}>
          Learn the facts about COVID-19! Get vaccinated!
        </Typography>
        <Typography variant="h6" paragraph={true}>
          Here you are able to create and manage appointments.
        </Typography>
      </div>
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Typography variant="h5" style={{ color: "white" }} align="center">
            Appointment Finder
          </Typography>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="caption">
              Enter appointment ID to find your appointment
            </Typography>
            <Search
              onChange={(e) => setQ(e.target.value)}
              onSearch={handelSearch}
              style={{ marginBottom: -18 }}
              size="large"
            />
          </Grid>
          {appointments.searchMessage && (
            <Grid item xs={12}>
              <Typography variant="h5" align="center">
                {appointments.searchMessage}
              </Typography>
            </Grid>
          )}
          {appointments.loading && (
            <Grid item xs={12}>
              <Placeholder.Paragraph rows={2} active></Placeholder.Paragraph>
            </Grid>
          )}
          <Grid item xs={12}>
            {appointments.appointments && appointments.appointments.length >= 1
              ? currentItem.map((appointment) => (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Card>
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
                            <Typography variant="caption">Last Name</Typography>
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
                              style={{ border: "none" }}
                              className="rounded-sm bg-gray-700 text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white transition duration-300"
                            >
                              View
                            </Button>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  </Grid>
                ))
              : appointments.appointment && (
                  <Grid container spacing={2} style={{ marginTop: 2 }}>
                    <Grid item xs={12}>
                      <Card className="shadow-lg rounded-lg">
                        <Grid container spacing={0}>
                          <Grid item xs={2}>
                            <Typography variant="caption">
                              First Name
                            </Typography>
                            <br />
                            <Typography variant="caption">
                              {appointments.appointment.patient.first_name}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant="caption">Last Name</Typography>
                            <br />
                            <Typography variant="caption">
                              {appointments.appointment.patient.last_name}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant="caption">Date</Typography>
                            <br />
                            <Typography variant="caption">
                              {appointments.appointment.date}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant="caption">Time</Typography>
                            <br />
                            <Typography variant="caption">
                              {new Date(
                                "1990-01-01 " + appointments.appointment.time
                              )
                                .toLocaleTimeString()
                                .replace(/:\d+ /, " ")}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant="caption">Status</Typography>
                            <br />
                            <Typography variant="caption">
                              {appointments.appointment.status}
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
                                    appointments.appointment.id
                                )
                              }
                              appearance="primary"
                              style={{ border: "none" }}
                              className="rounded-sm bg-gray-700 text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white transition duration-300"
                            >
                              View
                            </Button>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  </Grid>
                )}
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={() => history.push("/create-appointment")}
              appearance="primary"
              style={{ border: "none" }}
              className="rounded-sm bg-gray-700 text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white transition duration-300"
            >
              Make an Appointment
            </Button>
          </Grid>

          {appointments.appointments && appointments.appointments.length >= 6 && (
            <Grid item xs={12}>
              <CustomPagination
                pages={pages}
                activePage={activePage}
                paginate={paginate}
              />
            </Grid>
          )}
        </Grid>
      </Card>
    </Container>
  );
}

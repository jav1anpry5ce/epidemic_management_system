import React, { useState, useEffect } from "react";
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
import { Placeholder } from "rsuite";
import { useNavigate } from "react-router-dom";
import { open } from "../../utils/Notifications";
import { setActiveKey } from "../../store/navbarSlice";
import { Link } from "react-router-dom";

const { Search } = Input;

export default function Appointments() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const appointments = useSelector((state) => state.appointment);

  const handelSearch = () => {
    dispatch(clearAppointments());
    dispatch(AppointmentSearch(q));
  };

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
    <div className="sm:max-w-4xl sm:my-4 sm:mx-auto px-2">
      <div>
        <Typography variant="h4" style={{ color: "white" }}>
          Learn the facts about COVID-19! Get vaccinated!
        </Typography>
        <Typography variant="h6" paragraph={true} className="text-white">
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
              <h3 className="text-center text-3xl font-medium mt-4">
                {appointments.searchMessage}
              </h3>
            </Grid>
          )}
          {appointments.loading && (
            <Grid item xs={12}>
              <Placeholder.Paragraph rows={2} active />
            </Grid>
          )}
          <Grid item xs={12}>
            {appointments.appointment && (
              <Grid container spacing={2} style={{ marginTop: 2 }}>
                <Grid item xs={12}>
                  <Card className="shadow-lg rounded-lg">
                    <Grid container spacing={0}>
                      <Grid item xs={2}>
                        <Typography variant="caption">First Name</Typography>
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
                        <button
                          onClick={() =>
                            navigate(
                              "/appointments/" + appointments.appointment.id
                            )
                          }
                          appearance="primary"
                          style={{ border: "none" }}
                          className="rounded-sm px-2 bg-gray-700 text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white transition duration-300"
                        >
                          View
                        </button>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid item xs={12}>
            <Link to="/appointments/create">
              <button
                appearance="primary"
                style={{ border: "none" }}
                className="rounded-sm px-4 py-2 bg-gray-700
               text-white hover:bg-gray-800 
               hover:text-white focus:bg-gray-800 
               focus:text-white transition duration-300 shadow shadow-slate-700/40 hover:shadow-lg hover:shadow-slate-800/70"
              >
                Make an Appointment
              </button>
            </Link>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}

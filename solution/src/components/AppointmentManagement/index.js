import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import {
  searchAppointments,
  updateAppointments,
  clearState,
  updateState,
} from "../../store/appointmentSlice";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { getType, clearState as CS } from "../../store/locationSlice";
import formatDate from "../../functions/formatDate";
import { setActiveKey } from "../../store/navbarSlice";
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  DatePicker,
  SelectPicker,
} from "rsuite";
import { Button } from "./AMElemets";
import { open } from "../../functions/Notifications";
import PatientCard from "../PatientCard";
import Loading from "../Loading";

export default function AppointmentManagement({ match }) {
  const dispatch = useDispatch();
  const appointment = useSelector((state) => state.appointment);
  const location = useSelector((state) => state.location);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [patient_choice, setPatientChoice] = useState();
  const [disabledList, setDisabledList] = useState([]);
  const dateFns = require("date-fns");

  useEffect(() => {
    dispatch(clearState());
    dispatch(setActiveKey("4"));
    dispatch(searchAppointments(match.params.uuid));
    return () => {
      dispatch(clearState());
      dispatch(CS());
    };
  }, [dispatch, match.params.uuid]);

  useEffect(() => {
    if (appointment.appointments) {
      dispatch(getType(appointment.appointments.location.value));

      setDate(appointment.appointments.date);
      setTime(appointment.appointments.time);
      setPatientChoice(appointment.appointments.patient_choice);
    }
    if (appointment.message) {
      open("error", "Error", appointment.message);
    }
    if (appointment.success) {
      open("success", "Success", "Your appointment was successfully updated!");
      dispatch(updateState());
    }
    // eslint-disable-next-line
  }, [appointment.appointments, appointment.message, appointment.success]);

  const handelClick = (type) => {
    if (type === "Update") {
      const data = {
        id: appointment.appointments.id,
        date,
        time,
        patient_choice,
      };
      dispatch(updateAppointments(data));
    } else if (type === "Cancel") {
      const data = {
        id: appointment.appointments.id,
        request: "Cancel",
      };
      dispatch(updateAppointments(data));
    }
  };

  useEffect(() => {
    if (location.data)
      if (location.data.Vaccine && appointment.appointments) {
        if (appointment.secondDose) {
          if (appointment.appointments.patient_choice) {
            const result = location.data.Vaccine.filter(
              (vaccine) =>
                vaccine.value !== appointment.appointments.patient_choice
            );
            if (result) {
              var array = [];
              result.map((result) => {
                array.push(result.value);
                return array;
              });
              setDisabledList(array);
            }
          }
        }
      }
    if (!appointment.secondDose) {
      setDisabledList([]);
    }
  }, [location.data, appointment.appointments, appointment.secondDose]);

  return (
    <Container maxWidth="lg">
      {appointment.loading ? <Loading /> : null}
      {appointment.appointments ? (
        <Grid
          container
          spacing={2}
          className={appointment.loading ? "blur" : ""}
        >
          <Grid item xs={12} sm={12} md={6}>
            <PatientCard
              raised
              image={appointment.appointments.patient.image_url}
              first_name={appointment.appointments.patient.first_name}
              last_name={appointment.appointments.patient.last_name}
              date_of_birth={appointment.appointments.patient.date_of_birth}
              gender={appointment.appointments.patient.gender}
              city={appointment.appointments.patient.city}
              country={appointment.appointments.patient.country}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            style={{
              borderRadius: "7px",
              marginBottom: "2%",
            }}
          >
            <Card
              style={{
                backgroundColor: "rgba(255,255,255, 0.5)",
                color: "black",
              }}
            >
              <CardHeader
                style={{ backgroundColor: "#383d42", color: "#fff" }}
                title={
                  <Typography align="center" variant="h6">
                    Appointment Information
                  </Typography>
                }
              />
              <CardContent>
                <Form fluid>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormGroup>
                        <ControlLabel>Appointment ID</ControlLabel>
                        <FormControl
                          value={appointment.appointments.id}
                          readonly
                        ></FormControl>
                      </FormGroup>
                    </Grid>
                    <Grid item xs={12}>
                      <FormGroup>
                        <ControlLabel>Appointment Location</ControlLabel>
                        <FormControl
                          value={appointment.appointments.location.value}
                          readonly
                        ></FormControl>
                      </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                      <FormGroup>
                        <ControlLabel>Appointment Date</ControlLabel>
                        <DatePicker
                          ranges={[]}
                          oneTap
                          block
                          defaultValue={appointment.appointments.date}
                          onChange={(e) => setDate(formatDate(e))}
                          cleanable={false}
                          disabledDate={(date) =>
                            dateFns.isBefore(date, new Date())
                          }
                        />
                      </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                      <FormGroup>
                        <ControlLabel>Appointment Time</ControlLabel>
                        <DatePicker
                          disabledMinutes={(minute) => minute % 15 !== 0}
                          hideMinutes={(minute) => minute % 15 !== 0}
                          hideHours={(hour) => hour < 8 || hour > 16}
                          disabled={location.loading}
                          ranges={[]}
                          format="HH:mm"
                          //showMeridian
                          block
                          onSelect={(e) =>
                            setTime(e.toLocaleTimeString("it-IT"))
                          }
                          defaultValue={
                            new Date(
                              "2021-11-11 " + appointment.appointments.time
                            )
                          }
                        />
                      </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                      <FormGroup>
                        <ControlLabel>Type</ControlLabel>
                        <FormControl
                          value={appointment.appointments.type}
                          readonly
                        ></FormControl>
                      </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                      <FormGroup>
                        {appointment.appointments.type === "Testing" ? (
                          <div>
                            <ControlLabel>Test Type</ControlLabel>
                            <SelectPicker
                              block
                              defaultValue={
                                appointment.appointments.patient_choice
                              }
                              data={location.data ? location.data.Test : []}
                              onChange={(e) => setPatientChoice(e)}
                              cleanable={false}
                              searchable={false}
                            />
                          </div>
                        ) : (
                          <div>
                            <ControlLabel>Vaccine Choice</ControlLabel>
                            <SelectPicker
                              block
                              defaultValue={
                                appointment.appointments.patient_choice
                              }
                              data={location.data ? location.data.Vaccine : []}
                              disabledItemValues={disabledList}
                              onChange={(e) => setPatientChoice(e)}
                              cleanable={false}
                              searchable={false}
                            />
                          </div>
                        )}
                      </FormGroup>
                    </Grid>
                    <Grid item xs={12}>
                      <FormGroup>
                        <ControlLabel>Status</ControlLabel>
                        <FormControl
                          value={appointment.appointments.status}
                          readonly
                        ></FormControl>
                      </FormGroup>
                    </Grid>
                    {appointment.appointments.status === "Pending" ? (
                      <Grid item xs={6}>
                        <Button
                          block
                          color="red"
                          onClick={() => handelClick("Cancel")}
                        >
                          Cancel Appointment
                        </Button>
                      </Grid>
                    ) : null}
                    {appointment.appointments.status === "Pending" ? (
                      <Grid item xs={6}>
                        <Button
                          block
                          color="green"
                          onClick={() => handelClick("Update")}
                        >
                          Update
                        </Button>
                      </Grid>
                    ) : null}
                  </Grid>
                </Form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : !appointment.loading && !appointment.appointments ? (
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              align="center"
              style={{ marginTop: "25%" }}
              color="white"
            >
              This appointment does not exist in our records.
            </Typography>
          </Grid>
        </Grid>
      ) : null}
    </Container>
  );
}

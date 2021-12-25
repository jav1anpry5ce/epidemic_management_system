import React, { useEffect, useState } from "react";
import {
  searchAppointments,
  updateAppointments,
  clearState,
  updateState,
} from "../../store/appointmentSlice";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import { getType, clearState as CS } from "../../store/locationSlice";
import formatDate from "../../functions/formatDate";
import { setActiveKey } from "../../store/navbarSlice";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Card,
  Typography,
} from "antd";
import { useParams } from "react-router-dom";
import { open } from "../../functions/Notifications";
import PatientCard from "../PatientCard";
import Loading from "../Loading";
import shortid from "shortid";
const moment = require("moment");

const { Title } = Typography;
const { Option } = Select;

export default function AppointmentManagement({ match }) {
  const dispatch = useDispatch();
  const appointment = useSelector((state) => state.appointment);
  const location = useSelector((state) => state.location);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [patient_choice, setPatientChoice] = useState();
  const [form] = Form.useForm();
  const [availableDates, setAvailableDates] = useState([]);
  const dateFns = require("date-fns");

  const { uuid } = useParams();

  useEffect(() => {
    dispatch(clearState());
    dispatch(setActiveKey("4"));
    dispatch(searchAppointments(uuid));
    return () => {
      dispatch(clearState());
      dispatch(CS());
    };
  }, [dispatch, uuid]);

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
    if (appointment.appointments)
      form.setFieldsValue({
        id: appointment.appointments.id,
        location: appointment.appointments.location.value,
        date: moment(moment(appointment.appointments.date)),
        time: new Date(
          `2020-12-12 ${appointment.appointments.time}`
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: appointment.appointments.type,
        choice: appointment.appointments.patient_choice,
        status: appointment.appointments.status,
      });
    // eslint-disable-next-line
  }, [location.data, appointment.appointments, appointment.secondDose]);

  useEffect(() => {
    if (location.data) {
      let dates = location.data.availability.filter(
        (item) => formatDate(item.date) === formatDate(date)
      );
      setAvailableDates(dates);
    }
  }, [location.data, date]);

  return (
    <div className="mx-2 sm:max-w-7xl sm:mx-auto my-2">
      {appointment.loading && <Loading />}
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
              headStyle={{ backgroundColor: "#374151", border: "none" }}
              title={
                <Title level={4} style={{ color: "white" }} align="center">
                  Appointment Information
                </Title>
              }
              bordered={false}
              style={{ width: "100%", marginBottom: "3%" }}
            >
              <Form layout="vertical" form={form}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Form.Item
                      label="Appointment Id"
                      name="id"
                      className="mb-0"
                    >
                      <Input readOnly />
                    </Form.Item>
                  </Grid>
                  <Grid item xs={12}>
                    <Form.Item
                      label="Appointment Location"
                      name="location"
                      className="mb-0"
                    >
                      <Input readOnly />
                    </Form.Item>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Form.Item
                      label="Appointment Date"
                      name="date"
                      className="mb-0"
                    >
                      <DatePicker
                        className="w-full"
                        disabledDate={(date) =>
                          dateFns.isBefore(date, new Date())
                        }
                        format="DD/MM/YYYY"
                        onChange={(e) => setDate(formatDate(e))}
                      />
                    </Form.Item>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Form.Item
                      label="Appointment Time"
                      name="time"
                      className="mb-0"
                    >
                      <Select
                        vlaue={time}
                        onChange={(e) =>
                          setTime(
                            new Date(`2021-12-12 ${e}`).toLocaleTimeString(
                              "it-IT"
                            )
                          )
                        }
                      >
                        {availableDates.map((item) => (
                          <Option value={item.time} key={shortid.generate()}>
                            {new Date(
                              `$2021-12-12 ${item.time}`
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Form.Item label="Type" name="type" className="mb-0">
                      <Input readOnly />
                    </Form.Item>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Form.Item
                      label={
                        appointment.appointments.type === "Testing"
                          ? "Test Type"
                          : "Vaccine Choice"
                      }
                      name="choice"
                      className="mb-0"
                    >
                      <Select
                        value={appointment.appointments.patient_choice}
                        onChange={(e) => setPatientChoice(e)}
                      >
                        {appointment.appointments.type === "Testing" ? (
                          location.data &&
                          location.data.Test.map((item) => (
                            <Option value={item.value} key={shortid.generate()}>
                              {item.label}
                            </Option>
                          ))
                        ) : location.data && appointment.secondDose ? (
                          <Option
                            value={appointment.appointments.patient_choice}
                          >
                            {appointment.appointments.patient_choice}
                          </Option>
                        ) : (
                          location.data &&
                          location.data.Vaccine.map((item) => (
                            <Option value={item.value} key={shortid.generate()}>
                              {item.label}
                            </Option>
                          ))
                        )}
                      </Select>
                    </Form.Item>
                  </Grid>
                  <Grid item xs={12}>
                    <Form.Item label="Status" name="status" className="mb-0">
                      <Input readOnly />
                    </Form.Item>
                  </Grid>
                  {appointment.appointments.status === "Pending" && (
                    <Grid item xs={12}>
                      <Form.Item className="mb-0">
                        <div className="flex justify-between">
                          <Button
                            style={{ border: "none" }}
                            className="rounded-md bg-red-600 text-white hover:bg-red-700 hover:text-white focus:bg-red-700 focus:text-white transition duration-300"
                            onClick={() => handelClick("Cancel")}
                          >
                            Cancel Appointment
                          </Button>
                          <Button
                            style={{ border: "none" }}
                            className="rounded-md bg-green-600 text-white hover:bg-green-700 hover:text-white focus:bg-green-700 focus:text-white transition duration-300"
                            onClick={() => handelClick("Update")}
                          >
                            Update
                          </Button>
                        </div>
                      </Form.Item>
                    </Grid>
                  )}
                </Grid>
              </Form>
            </Card>
          </Grid>
        </Grid>
      ) : (
        !appointment.loading &&
        !appointment.appointments && (
          <Grid
            container
            spacing={0}
            className="h-full"
            style={{ height: "80vh" }}
          >
            <Grid
              item
              xs={12}
              className="flex items-center justify-center h-full"
            >
              <p className=" text-white text-3xl text-semibold text-center">
                This appointment does not exist in our records.
              </p>
            </Grid>
          </Grid>
        )
      )}
    </div>
  );
}

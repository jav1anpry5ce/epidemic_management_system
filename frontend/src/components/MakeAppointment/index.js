import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Modal,
  TimePicker,
  Card,
  Checkbox,
} from "antd";
import { Uploader, Icon } from "rsuite";
import PhoneMask from "../../functions/PhoneMask";
import TRNMask from "../../functions/TRNMask";
import FileUploadIcon from "@rsuite/icons/FileUpload";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {
  makeAppointment,
  clearState as cs,
} from "../../store/appointmentSlice";
import { getType, getLocationByParish } from "../../store/locationSlice";
import {
  detailedInfo,
  verify,
  clearState,
  updateSuccess,
  getPreviousVaccine,
} from "../../store/patientSlice";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import formatDate from "../../functions/formatDate";
import { open } from "../../functions/Notifications";
import { setActiveKey } from "../../store/navbarSlice";
import Loading from "../Loading";
const moment = require("moment");

const { Option } = Select;

export default function MakeAppointment() {
  const dispatch = useDispatch();
  const appointment = useSelector((state) => state.appointment);
  const location = useSelector((state) => state.location);
  const patient = useSelector((state) => state.patient);
  const history = useHistory();
  const dateFns = require("date-fns");
  const genderData = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];
  const titledata = [
    { label: "Mr.", value: "Mr." },
    { label: "Mrs.", value: "Mrs." },
    { label: "Ms.", value: "Ms." },
    { label: "Dr.", value: "Dr." },
  ];
  const parishData = [
    { label: "Kingston", value: "Kingston" },
    { label: "St. Andrew", value: "St. Andrew" },
    { label: "Portland ", value: "Portland " },
    { label: "St. Thomas", value: "St. Thomas" },
    { label: "St. Catherine", value: "St. Catherine" },
    { label: "St. Mary", value: "St. Mary" },
    { label: "St. Ann", value: "St. Ann" },
    { label: "Manchester", value: "Manchester" },
    { label: "Clarendon", value: "Clarendon" },
    { label: "Hanover", value: "Hanover" },
    { label: "Westmoreland", value: "Westmoreland" },
    { label: "St. James", value: "St. James" },
    { label: "Trelawny", value: "Trelawny" },
    { label: "St. Elizabeth", value: "St. Elizabeth" },
  ];

  const [taxNumber, setTaxNumber] = useState("");
  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [DOB, setDOB] = useState();
  const [gender, setGender] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [parish, setParish] = useState("");
  const [country, setCountry] = useState("Jamaica");
  const [image, setImage] = useState(null);
  const [id, setId] = useState();
  const [kinFirstName, setKinFirstName] = useState("");
  const [kinLastName, setKinLastName] = useState("");
  const [kinEmail, setKinEmail] = useState("");
  const [kinPhone, setKinPhone] = useState("");
  const [appointmentLocation, setAppointmentLocation] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [pChoice, setPChoice] = useState("");
  const [error, setError] = useState(false);
  const [verifyDOB, setVerifyDOB] = useState("");
  const [verifyLastName, setVerifyLastName] = useState("");
  const [show, setShow] = useState(false);
  const [form] = Form.useForm();
  const [someoneElse, setSomeoneElse] = useState(false);
  const [repFirstName, setRepFirstName] = useState("");
  const [repLastName, setRepLastName] = useState("");
  const [repEmail, setRepEmail] = useState("");
  const [repPhone, setRepPhone] = useState("");
  const [effect, setEffect] = useState("");

  useEffect(() => {
    dispatch(setActiveKey("4"));
    dispatch(getLocationByParish(parish));
    form.setFieldsValue({ country: "Jamaica" });
    return () => {
      dispatch(clearState());
      dispatch(cs());
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (parish) {
      dispatch(getLocationByParish(parish));
    }
    // eslint-disable-next-line
  }, [parish]);

  useEffect(() => {
    if (appointment.success) {
      history.push("/appointments");
    }
    if (appointment.message) {
      open("error", "Error", appointment.message);
    }
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [appointment.success, appointment.message]);

  useEffect(() => {
    if (patient.success) {
      setVerifyLastName("");
      setVerifyDOB("");
      dispatch(updateSuccess());
    }
    if (patient.loading || appointment.loading) {
      setEffect("blur");
    } else {
      setEffect("");
    }
    if (patient.message === "Verify") {
      setShow(true);
    } else {
      setShow(false);
    }
    if (patient.vMessage === "Verification failed!") {
      open("error", "Error", patient.vMessage);
    }
    if (patient.detailedinfo) {
      setTitle(patient.detailedinfo.title);
      setFirstName(patient.detailedinfo.first_name);
      setLastName(patient.detailedinfo.last_name);
      setEmail(patient.detailedinfo.email);
      setPhone(patient.detailedinfo.phone);
      setDOB(patient.detailedinfo.date_of_birth);
      setGender(patient.detailedinfo.gender);
      setStreetAddress(patient.detailedinfo.street_address);
      setCity(patient.detailedinfo.city);
      setParish(patient.detailedinfo.parish);
      setCountry(patient.detailedinfo.country);
      setShow(false);
      form.setFieldsValue({
        title: patient.detailedinfo.title,
        first_name: patient.detailedinfo.first_name,
        last_name: patient.detailedinfo.last_name,
        email: patient.detailedinfo.email,
        mobile_number: patient.detailedinfo.phone,
        date_of_birth: moment(moment(patient.detailedinfo.date_of_birth)),
        gender: patient.detailedinfo.gender,
        street_address: patient.detailedinfo.street_address,
        city: patient.detailedinfo.city,
        parish: patient.detailedinfo.parish,
        country: patient.detailedinfo.country,
      });
    }
    if (patient.kinInfo) {
      setKinFirstName(patient.kinInfo.kin_first_name);
      setKinLastName(patient.kinInfo.kin_last_name);
      setKinEmail(
        patient.kinInfo.kin_email ? patient.kinInfo.kin_email : kinEmail
      );
      setKinPhone(patient.kinInfo.kin_phone);
      form.setFieldsValue({
        kin_first_name: patient.kinInfo.kin_first_name,
        kin_last_name: patient.kinInfo.kin_last_name,
        kin_email: patient.kinInfo.kin_email
          ? patient.kinInfo.kin_email
          : kinEmail,
        kin_mobile_number: patient.kinInfo.kin_phone,
      });
    }
    if (id) {
      if (id.size > 10485760) {
        setError(true);
      } else {
        setError(false);
      }
    }
    // eslint-disable-next-line
  }, [
    patient.detailedinfo,
    patient.message,
    patient.loading,
    appointment.loading,
    patient.vMessage,
  ]);

  const getDetailedInfo = () => {
    const data = {
      tax_number: taxNumber,
    };
    dispatch(clearState());
    dispatch(verify(data));
    dispatch(getPreviousVaccine(data));
  };

  const submitForm = () => {
    if (!error) {
      const data = {
        tax_number: taxNumber,
        title: title,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        date_of_birth: DOB,
        gender,
        street_address: streetAddress,
        city,
        parish,
        country,
        location: appointmentLocation,
        patient_choice: pChoice,
        date: appointmentDate,
        time: appointmentTime,
        type: appointmentType,
        image,
        identification: id,
        kin_first_name: kinFirstName,
        kin_last_name: kinLastName,
        kin_email: kinEmail,
        kin_phone: kinPhone,
        rep_first_name: repFirstName,
        rep_last_name: repLastName,
        rep_email: repEmail,
        rep_phone: repPhone,
      };
      dispatch(makeAppointment(data));
    }
  };

  const handleClose = () => {
    dispatch(clearState());
    setShow(false);
  };

  const handelSubmit = () => {
    const data = {
      tax_number: taxNumber,
      date_of_birth: verifyDOB,
      last_name: verifyLastName,
    };
    dispatch(detailedInfo(data));
  };
  const cancel = () => {
    dispatch(clearState());
    dispatch(cs());
    history.push("/appointments");
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "2%" }}>
      <Modal
        title="Verify Identity"
        size="sm"
        visible={show}
        onCancel={handleClose}
        footer={[
          <Button key="back" onClick={handleClose}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={patient.loading}
            onClick={handelSubmit}
            style={{ border: "none" }}
            className="rounded-sm bg-gray-700 text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white transition duration-300"
          >
            Submit
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Form.Item
                required
                label="Date of Birth"
                name="dob"
                style={{ marginBottom: 2 }}
              >
                <DatePicker
                  onChange={(e) => setVerifyDOB(formatDate(e))}
                  format="DD/MM/YYYY"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your Date of Birth!",
                    },
                  ]}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={6}>
              <Form.Item
                required
                style={{ marginBottom: 2 }}
                label="Last Name"
                name="lname"
                rules={[
                  {
                    required: true,
                    message: "Please enter your last name!",
                  },
                ]}
              >
                <Input onChange={(e) => setVerifyLastName(e.target.value)} />
              </Form.Item>
            </Grid>
          </Grid>
        </Form>
      </Modal>
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Typography variant="h5" style={{ color: "white" }} align="center">
            Create Appointment
          </Typography>
        }
        bordered={false}
        style={{ width: "100%", marginBottom: "3%" }}
      >
        <Form
          layout="vertical"
          className={effect}
          onFinish={submitForm}
          form={form}
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6">Personal Information</Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Form.Item
                required
                label="Tax Registration Number"
                name="tax_number"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your Tax Number!",
                  },
                ]}
              >
                <TRNMask
                  value={taxNumber}
                  onChange={(e) => setTaxNumber(e.target.value)}
                  onBlur={getDetailedInfo}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Form.Item
                required
                label="Title"
                name="title"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please select your Title!",
                  },
                ]}
              >
                <Select value={title} onChange={(e) => setTitle(e)}>
                  {titledata.map((item, index) => (
                    <Option vlaue={item.value} key={index}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form.Item
                label="First Name"
                name="first_name"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your First Name!",
                  },
                ]}
              >
                <Input
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form.Item
                label="Last Name"
                name="last_name"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your Last Name!",
                  },
                ]}
              >
                <Input
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form.Item label="Email" name="email" style={{ marginBottom: 2 }}>
                <Input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form.Item
                label="Mobile Number"
                name="mobile_number"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your mobile number!",
                  },
                ]}
              >
                <PhoneMask
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form.Item
                label="Date of Birth"
                name="date_of_birth"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your date of birth!",
                  },
                ]}
              >
                <DatePicker
                  onChange={(e) => setDOB(formatDate(e))}
                  value={DOB}
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form.Item
                label="Gender"
                name="gender"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please select your gender!",
                  },
                ]}
              >
                <Select
                  data={genderData}
                  onChange={(e) => setGender(e)}
                  value={gender}
                >
                  {genderData.map((item, index) => (
                    <Option value={item.value} key={index}>
                      {item.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form.Item
                label="Street Address"
                name="street_address"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your street address!",
                  },
                ]}
              >
                <Input
                  onChange={(e) => setStreetAddress(e.target.value)}
                  value={streetAddress}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form.Item
                label="City"
                name="city"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your city!",
                  },
                ]}
              >
                <Input onChange={(e) => setCity(e.target.value)} value={city} />
              </Form.Item>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form.Item
                label="Parish"
                name="parish"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please select your parish!",
                  },
                ]}
              >
                <Select value={parish} onChange={(e) => setParish(e)}>
                  {parishData.map((item, index) => (
                    <Option value={item.value} key={index}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form.Item
                label="Country"
                name="country"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your country!",
                  },
                ]}
              >
                <Input
                  readOnly
                  onChange={(e) => setCountry(e)}
                  value="Jamaica"
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form.Item
                label="Picture"
                name="picture"
                style={{ marginBottom: 2 }}
              >
                <Uploader
                  autoUpload={false}
                  listType="picture"
                  onChange={(e) =>
                    setImage(e.length !== 0 ? e[0].blobFile : null)
                  }
                  // onChange={(e) => console.log(e)}
                >
                  <Button>
                    <Icon icon="camera-retro" size="lg" />
                  </Button>
                </Uploader>
              </Form.Item>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form.Item
                label="Identification"
                name="id"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please select your ID!",
                  },
                ]}
              >
                <Uploader
                  autoUpload={false}
                  listType="text"
                  onChange={(e) => setId(e.length !== 0 ? e[0].blobFile : null)}
                >
                  <Button size="lg" style={{ marginTop: 10 }}>
                    <FileUploadIcon style={{ fontSize: 24 }} />
                  </Button>
                </Uploader>
              </Form.Item>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Next of Kin</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form.Item
                label="First Name"
                name="kin_first_name"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your kin first name!",
                  },
                ]}
              >
                <Input
                  onChange={(e) => setKinFirstName(e.target.value)}
                  value={kinFirstName}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form.Item
                label="Last Name"
                name="kin_last_name"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your kin last name!",
                  },
                ]}
              >
                <Input
                  onChange={(e) => setKinLastName(e.target.value)}
                  value={kinLastName}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form.Item
                label="Email"
                name="kin_email"
                style={{ marginBottom: 2 }}
              >
                <Input
                  type="email"
                  onChange={(e) => setKinEmail(e.target.value)}
                  value={kinEmail}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form.Item
                label="Mobile Number"
                name="kin_mobile_number"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your kin mobile number!",
                  },
                ]}
              >
                <PhoneMask
                  onChange={(e) => setKinPhone(e.target.value)}
                  value={kinPhone}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Appointment Information</Typography>
            </Grid>
            <Grid item xs={12}>
              <Form.Item
                label="Appointment Loacation"
                name="appointment_location"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please select an appointment location!",
                  },
                ]}
              >
                <Select
                  onSelect={(e) => dispatch(getType(e))}
                  disabled={location.loading}
                  onChange={(e) => setAppointmentLocation(e)}
                >
                  {location.locations &&
                    location.locations.map((item) => (
                      <Option value={item.value}>{item.label}</Option>
                    ))}
                </Select>
              </Form.Item>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form.Item
                label="Appointment Date"
                name="appointment_date"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your appointment date!",
                  },
                ]}
              >
                <DatePicker
                  disabled={location.loading}
                  onChange={(e) => setAppointmentDate(formatDate(e))}
                  disabledDate={(date) => dateFns.isBefore(date, new Date())}
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form.Item
                label="Appointment Time"
                name="appointment_time"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your appointment time!",
                  },
                ]}
              >
                <TimePicker
                  disabledHours={() => [
                    0, 1, 2, 3, 4, 5, 6, 7, 17, 18, 19, 20, 21, 22, 23, 24,
                  ]}
                  minuteStep={15}
                  disabled={location.loading}
                  format="HH:mm"
                  hideDisabledOptions
                  showNow={false}
                  style={{ width: "100%" }}
                  //showMeridian
                  onSelect={(e) =>
                    setAppointmentTime(e._d.toLocaleTimeString("it-IT"))
                  }
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form.Item
                label="Appointment Type"
                name="appointment_type"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please select your appointment type!",
                  },
                ]}
              >
                <Select
                  onChange={(e) => setAppointmentType(e)}
                  disabled={location.loading}
                  searchable={false}
                >
                  {location.data &&
                    location.data.Offer.map((item, index) => (
                      <Option value={item.value} key={index}>
                        {item.label}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Grid>
            {appointmentType === "Testing" ? (
              <Grid item xs={12} sm={6}>
                <Form.Item
                  label="Test"
                  name="test"
                  style={{ marginBottom: 2 }}
                  rules={[
                    {
                      required: true,
                      message: "Please select your test type!",
                    },
                  ]}
                >
                  <Select
                    disabled={location.loading}
                    onChange={(e) => setPChoice(e)}
                  >
                    {location.data &&
                      location.data.Test.map((item, index) => (
                        <Option value={item.value} key={index}>
                          {item.label}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Grid>
            ) : appointmentType === "Vaccination" ? (
              <Grid item xs={12} sm={6}>
                <Form.Item
                  label="Vaccine"
                  name="vaccine"
                  style={{ marginBottom: 2 }}
                  rules={[
                    {
                      required: true,
                      message: "Please select your vaccine choice!",
                    },
                  ]}
                >
                  <Select
                    disabled={location.loading}
                    onChange={(e) => setPChoice(e)}
                  >
                    {location.data &&
                    location.data &&
                    patient.previousVaccine[0] ? (
                      <Option value={patient.previousVaccine[0].value}>
                        {patient.previousVaccine[0].value}
                      </Option>
                    ) : (
                      location.data.Vaccine.map((item, index) => (
                        <Option value={item.value} key={index}>
                          {item.label}
                        </Option>
                      ))
                    )}
                  </Select>
                </Form.Item>
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <Checkbox
                onChange={() => setSomeoneElse(!someoneElse)}
                className="mb-3"
              >
                Are you making this for someone else?
              </Checkbox>
            </Grid>
            {someoneElse && (
              <Grid container spacing={1} className="mt-2 pl-2">
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Representative Information
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Form.Item
                    label="First Name"
                    name="rep_first_name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your first name!",
                      },
                    ]}
                    style={{ marginBottom: 0 }}
                  >
                    <Input onChange={(e) => setRepFirstName(e.target.value)} />
                  </Form.Item>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Form.Item
                    label="Last Name"
                    name="rep_last_name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your last name!",
                      },
                    ]}
                    style={{ marginBottom: 0 }}
                  >
                    <Input onChange={(e) => setRepLastName(e.target.value)} />
                  </Form.Item>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Form.Item
                    label="Email"
                    name="rep_email"
                    style={{ marginBottom: 0 }}
                  >
                    <Input onChange={(e) => setRepEmail(e.target.value)} />
                  </Form.Item>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Form.Item
                    label="Phone"
                    name="rep_mobile"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your mobile number!",
                      },
                    ]}
                    style={{ marginBottom: 0 }}
                  >
                    <PhoneMask onChange={(e) => setRepPhone(e.target.value)} />
                  </Form.Item>
                </Grid>
              </Grid>
            )}
            <Grid item xs={6}>
              <Form.Item style={{ marginBottom: 2 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  appearance="primary"
                  disabled={location.loading}
                  style={{ border: "none" }}
                  className="rounded-sm bg-gray-700 text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white transition duration-300"
                >
                  Submit
                </Button>
              </Form.Item>
            </Grid>
            <Grid item xs={6} align="right">
              <Form.Item style={{ marginBottom: 2 }}>
                <Button
                  appearance="default"
                  onClick={cancel}
                  disabled={location.loading}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Grid>
          </Grid>
        </Form>
      </Card>
      {appointment.loading ? <Loading /> : null}
      {patient.loading ? <Loading /> : null}
    </Container>
  );
}

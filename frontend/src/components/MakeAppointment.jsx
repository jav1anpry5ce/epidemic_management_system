import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Modal,
  Card,
  Checkbox,
} from "antd";
import { Uploader, Icon } from "rsuite";
import PhoneMask from "../utils/PhoneMask";
import TRNMask from "../utils/TRNMask";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { makeAppointment, clearState as cs } from "../store/appointmentSlice";
import { getType, getLocationByParish } from "../store/locationSlice";
import {
  detailedInfo,
  verify,
  clearState,
  updateSuccess,
  getPreviousVaccine,
} from "../store/patientSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import formatDate from "../utils/formatDate";
import { open } from "../utils/Notifications";
import { setActiveKey } from "../store/navbarSlice";
import Loading from "./Loading";
import shortid from "shortid";
const moment = require("moment");

const { Option } = Select;

export default function MakeAppointment() {
  const dispatch = useDispatch();
  const appointment = useSelector((state) => state.appointment);
  const location = useSelector((state) => state.location);
  const patient = useSelector((state) => state.patient);
  const navigate = useNavigate();
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
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    dispatch(setActiveKey("4"));
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
      navigate("/appointments");
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
      setEffect("blur-sm");
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

  useEffect(() => {
    if (location.data) {
      let dates = location.data.availability.filter(
        (item) => formatDate(item.date) === formatDate(appointmentDate)
      );
      setAvailableDates(dates);
    }
  }, [location.data, appointmentDate]);

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
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email,
        phone,
        date_of_birth: DOB,
        gender,
        street_address: streetAddress.trim(),
        city: city.trim(),
        parish,
        country,
        location: appointmentLocation,
        patient_choice: pChoice,
        date: appointmentDate,
        time: appointmentTime,
        type: appointmentType,
        image,
        identification: id,
        kin_first_name: kinFirstName.trim(),
        kin_last_name: kinLastName.trim(),
        kin_email: kinEmail,
        kin_phone: kinPhone,
        rep_first_name: repFirstName.trim(),
        rep_last_name: repLastName.trim(),
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
    navigate("/appointments");
  };

  return (
    <div className="sm:mx-auto sm:mt-4 sm:max-w-4xl">
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
            className="rounded-sm bg-gray-700 text-white transition duration-300 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white"
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
        className="w-full sm:mb-4"
        // style={{ width: "100%", marginBottom: "3%" }}
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
                    <Option key={index} value={item.value}>
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
                  {genderData.map((item) => (
                    <Option value={item.value} key={shortid.generate()}>
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
                  {parishData.map((item) => (
                    <Option value={item.value} key={shortid.generate()}>
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
                    required: patient.detailedinfo === null ? true : false,
                    message: "Please select your ID!",
                  },
                ]}
              >
                <div className="mt-6 mb-2 flex h-full items-center">
                  <input
                    type="file"
                    onChange={(e) => setId(e.target.files[0])}
                    className="block w-full text-sm text-gray-500
      file:mr-4 file:rounded-full file:border-0
      file:bg-violet-50 file:py-2
      file:px-4 file:text-sm
      file:font-semibold file:text-violet-700
      hover:file:bg-violet-100"
                  />
                </div>
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
                label="Appointment Location"
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
                      <Option value={item.value} key={shortid.generate()}>
                        {item.label}
                      </Option>
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
                <Select
                  value={appointmentTime}
                  onChange={(e) =>
                    setAppointmentTime(
                      new Date(`2021-12-12 ${e}`).toLocaleTimeString("it-IT")
                    )
                  }
                >
                  {availableDates.map((item) => (
                    <Option value={item.time} key={shortid.generate()}>
                      {moment(
                        `2021-12-12 ${item.time}`,
                        "YYYY-MM-DD HH:mm"
                      ).format("LT")}
                    </Option>
                  ))}
                </Select>
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
                    location.data.Offer.map((item) => (
                      <Option value={item.value} key={shortid.generate()}>
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
                      location.data.Test.map((item) => (
                        <Option value={item.value} key={shortid.generate()}>
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
                    patient.previousVaccine[0]
                      ? location.data.Vaccine.find(
                          (item) =>
                            item.value === patient.previousVaccine[0].value
                        ) && (
                          <Option value={patient.previousVaccine[0].value}>
                            {patient.previousVaccine[0].value}
                          </Option>
                        )
                      : location.data.Vaccine.map((item) => (
                          <Option value={item.value} key={shortid.generate()}>
                            {item.label}
                          </Option>
                        ))}
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
                  className="rounded-sm bg-gray-700 text-white transition duration-300 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white"
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
      {appointment.loading && <Loading />}
      {patient.loading && <Loading />}
    </div>
  );
}

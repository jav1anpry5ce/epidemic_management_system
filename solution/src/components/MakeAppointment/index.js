import React, { useState, useEffect } from "react";
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  DatePicker,
  SelectPicker,
  Button,
  ButtonToolbar,
  Message,
  Modal,
  Uploader,
  Icon,
} from "rsuite";
import FileUploadIcon from "@rsuite/icons/FileUpload";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
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
import formatTrn from "../../functions/formatTrn";
import { setActiveKey } from "../../store/navbarSlice";
import Loading from "../Loading";
import InputMask from "react-input-mask";

const PhoneMask = (props) => {
  return (
    <InputMask
      value={props.value}
      onChange={props.onChange}
      mask={"+1\\(999) 999-9999"}
    >
      <FormControl placeholder="+1(876) 123-4567" required />
    </InputMask>
  );
};

export default function MakeAppointment() {
  const dispatch = useDispatch();
  const appointment = useSelector((state) => state.appointment);
  const location = useSelector((state) => state.location);
  const patient = useSelector((state) => state.patient);
  const history = useHistory();
  const dateFns = require("date-fns");
  const genderData = [
    { label: "Male", value: "Male", role: "Master" },
    { label: "Female", value: "Female", role: "Master" },
  ];
  const titledata = [
    { label: "Mr.", value: "Mr.", role: "Master" },
    { label: "Mrs.", value: "Mrs.", role: "Master" },
    { label: "Ms.", value: "Ms.", role: "Master" },
    { label: "Dr.", value: "Dr.", role: "Master" },
  ];
  const parishData = [
    { label: "Kingston", value: "Kingston", role: "Master" },
    { label: "St. Andrew", value: "St. Andrew", role: "Master" },
    { label: "Portland ", value: "Portland ", role: "Master" },
    { label: "St. Thomas", value: "St. Thomas", role: "Master" },
    { label: "St. Catherine", value: "St. Catherine", role: "Master" },
    { label: "St. Mary", value: "St. Mary", role: "Master" },
    { label: "St. Ann", value: "St. Ann", role: "Master" },
    { label: "Manchester", value: "Manchester", role: "Master" },
    { label: "Clarendon", value: "Clarendon", role: "Master" },
    { label: "Hanover", value: "Hanover", role: "Master" },
    { label: "Westmoreland", value: "Westmoreland", role: "Master" },
    { label: "St. James", value: "St. James", role: "Master" },
    { label: "Trelawny", value: "Trelawny", role: "Master" },
    { label: "St. Elizabeth", value: "St. Elizabeth", role: "Master" },
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
  const [m, setM] = useState("");
  const [sub, setSub] = useState("");
  const [verifyDOB, setVerifyDOB] = useState("");
  const [verifyLastName, setVerifyLastName] = useState("");
  const [show, setShow] = useState(false);
  const [effect, setEffect] = useState("");
  const [disabledList, setDisabledList] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const API_KEY = "AIzaSyCH4oqqpqsM2RdM-BxpdSNDFdphwinrz7A";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(position);
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
    dispatch(setActiveKey("4"));
    // dispatch(getLocationByParish(parish));
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
    if (longitude && latitude) {
      fetchAddress();
    }
    // eslint-disable-next-line
  }, [longitude, latitude]);

  const fetchAddress = () => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=false&key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

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
    } else {
      setTitle(title);
      setFirstName(firstName);
      setLastName(lastName);
      setEmail(email);
      setPhone(phone);
      setDOB(DOB);
      setGender(gender);
      setStreetAddress(streetAddress);
      setCity(city);
      setParish(parish);
      setCountry(country);
    }
    if (patient.kinInfo) {
      setKinFirstName(patient.kinInfo.kin_first_name);
      setKinLastName(patient.kinInfo.kin_last_name);
      setKinEmail(
        patient.kinInfo.kin_email ? patient.kinInfo.kin_email : kinEmail
      );
      setKinPhone(patient.kinInfo.kin_phone);
    }
    if (!patient.kinInfo) {
      setKinFirstName(kinFirstName);
      setKinLastName(kinLastName);
      setKinEmail(kinEmail);
      setKinPhone(kinPhone);
    }

    var message = "";
    if (
      !title ||
      !DOB ||
      !gender ||
      !parish ||
      !appointmentLocation ||
      !appointmentDate ||
      !appointmentTime ||
      !appointmentType ||
      !pChoice ||
      !id
    ) {
      setError(true);
    } else {
      setError(false);
    }
    if (id) {
      if (id.size > 10485760) {
        setError(true);
      } else {
        setError(false);
      }
    }
    if (sub) {
      if (error && !title) {
        message += "An title must be selected.\n";
      }
      if (error && !DOB) {
        message += "An date of birth must be selected.\n";
      }
      if (error && !gender) {
        message += "An gender must be selected.\n";
      }
      if (error && !appointmentLocation) {
        message += "An appointment location must be selected.\n";
      }
      if (error && !appointmentDate) {
        message += "An appointment date must be selected.\n";
      }
      if (error && !appointmentTime) {
        message += "An appointment time must be selected.\n";
      }
      if (error && !appointmentType) {
        message += "An appointment type must be selected.\n";
      }
      if (error && !pChoice) {
        message += "Please select a type.";
      }
      if (error && !parish) {
        message += "Please select a parish.";
      }
      if (id) {
        if (id.size > 10485760) {
          message += "File too large";
        }
      }
    }
    setM(message);
    // eslint-disable-next-line
  }, [
    title,
    gender,
    DOB,
    parish,
    appointmentDate,
    appointmentType,
    appointmentTime,
    pChoice,
    appointmentLocation,
    error,
    sub,
    id,
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
    setSub(true);
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

  useEffect(() => {
    if (location.data.Vaccine && patient.previousVaccine) {
      if (patient.previousVaccine[0]) {
        const result = location.data.Vaccine.filter(
          (vaccine) => vaccine.value !== patient.previousVaccine[0].value
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
  }, [patient.previousVaccine, location.data.Vaccine]);

  const onPhoneChange = (event) => {
    if (event) {
      if (event.type === "focus") {
        console.log("hi");
      } else if (event.type === "blur") {
        console.log("hii");
      } else {
        const p = event.slice(0, -1);
        setPhone(p);
      }
    }
  };

  const onKinPhoneChange = (event) => {
    if (event) {
      if (event.type === "focus") {
        console.log("hi");
      } else if (event.type === "blur") {
        console.log("hii");
      } else {
        const p = event.slice(0, -1);
        setKinPhone(p);
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Modal
        backdrop
        size="sm"
        show={show}
        onExiting={handleClose}
        overflow={false}
      >
        <Modal.Header>
          <Modal.Title>Verify Identity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Date of Birth</ControlLabel>
                  <DatePicker
                    block
                    oneTap
                    ranges={[]}
                    onChange={(e) => setVerifyDOB(formatDate(e))}
                    format="DD-MM-YYYY"
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Last Name</ControlLabel>
                  <FormControl onChange={(e) => setVerifyLastName(e)} />
                </FormGroup>
              </Grid>
            </Grid>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="blue"
            onClick={handelSubmit}
            disabled={patient.loading}
          >
            Submit
          </Button>
          <Button onClick={handleClose} disabled={patient.loading}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Card style={{ marginBottom: "4%", borderRadius: 9 }}>
        <CardHeader
          style={{ backgroundColor: "#383d42", color: "#fff" }}
          title={
            <Typography variant="h5" align="center">
              Create Appointment
            </Typography>
          }
        />
        <CardContent>
          <Form fluid className={effect} onSubmit={submitForm}>
            <Grid container spacing={1}>
              {error && sub ? (
                <Grid item xs={12}>
                  <Message showIcon type="error" description={m} />
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <Typography variant="h6">Personal Information</Typography>
              </Grid>
              <Grid item xs={12} sm={10}>
                <FormGroup>
                  <ControlLabel>Tax Number</ControlLabel>
                  <FormControl
                    type="tel"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{3}"
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(formatTrn(e))}
                    onBlur={getDetailedInfo}
                    placeholder="123-456-789"
                    required
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormGroup>
                  <ControlLabel>Title</ControlLabel>
                  <SelectPicker
                    data={titledata}
                    block
                    searchable={false}
                    value={title}
                    onChange={(e) => setTitle(e)}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <ControlLabel>First Name</ControlLabel>
                  <FormControl
                    onChange={(e) => setFirstName(e)}
                    required
                    value={firstName}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <ControlLabel>Last Name</ControlLabel>
                  <FormControl
                    onChange={(e) => setLastName(e)}
                    required
                    value={lastName}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <ControlLabel>Email</ControlLabel>
                  <FormControl
                    type="email"
                    name="email"
                    onChange={(e) => setEmail(e)}
                    required
                    value={email}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <ControlLabel>Phone Number</ControlLabel>
                  <PhoneMask onChange={onPhoneChange} value={phone} />
                  {/* <FormControl
                    name="phone"
                    type="tel"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    placeholder="(123) 456-7890"
                    onChange={(e) => setPhone(e)}
                    required
                    value={phone}
                  /> */}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <ControlLabel>Date of Birth</ControlLabel>
                  <DatePicker
                    oneTap
                    block
                    onChange={(e) => setDOB(formatDate(e))}
                    onClean={() => setDOB()}
                    value={DOB ? new Date(DOB.replace(/-/g, "/")) : null}
                    format="DD-MM-YYYY"
                    ranges={[]}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <ControlLabel>Gender</ControlLabel>
                  <SelectPicker
                    data={genderData}
                    block
                    onChange={(e) => setGender(e)}
                    searchable={false}
                    value={gender}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <ControlLabel>Street Address</ControlLabel>
                  <FormControl
                    name="street_address"
                    onChange={(e) => setStreetAddress(e)}
                    required
                    value={streetAddress}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <ControlLabel>City</ControlLabel>
                  <FormControl
                    name="city"
                    onChange={(e) => setCity(e)}
                    required
                    value={city}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <ControlLabel>Parish</ControlLabel>
                  {/* <FormControl
                    name="parish"
                    onChange={(e) => setParish(e)}
                    required
                    value={parish}
                  /> */}
                  <SelectPicker
                    data={parishData}
                    value={parish}
                    onChange={(e) => setParish(e)}
                    block
                    searchable={false}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <ControlLabel>Country</ControlLabel>
                  <FormControl
                    name="country"
                    readOnly
                    onChange={(e) => setCountry(e)}
                    required
                    value={country}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <ControlLabel>Photo Upload</ControlLabel>
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
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <ControlLabel>Identification Upload</ControlLabel>
                  <Uploader
                    autoUpload={false}
                    listType="text"
                    onChange={(e) =>
                      setId(e.length !== 0 ? e[0].blobFile : null)
                    }
                  >
                    <Button size="lg" style={{ marginTop: 10 }}>
                      <FileUploadIcon style={{ fontSize: 24 }} />
                    </Button>
                  </Uploader>
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Next of Kin</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <ControlLabel>First Name</ControlLabel>
                  <FormControl
                    onChange={(e) => setKinFirstName(e)}
                    required
                    value={kinFirstName}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <ControlLabel>Last Name</ControlLabel>
                  <FormControl
                    onChange={(e) => setKinLastName(e)}
                    required
                    value={kinLastName}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <ControlLabel>Email</ControlLabel>
                  <FormControl
                    type="email"
                    onChange={(e) => setKinEmail(e)}
                    value={kinEmail}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <ControlLabel>Phone</ControlLabel>
                  <PhoneMask onChange={onKinPhoneChange} value={kinPhone} />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Appointment Information</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <ControlLabel>Appointment Location</ControlLabel>
                  <SelectPicker
                    block
                    data={location.locations ? location.locations : []}
                    onSelect={(e) => dispatch(getType(e))}
                    disabled={location.loading}
                    onChange={(e) => setAppointmentLocation(e)}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <ControlLabel>Appointment Date</ControlLabel>
                  <DatePicker
                    disabled={location.loading}
                    oneTap
                    block
                    onChange={(e) => setAppointmentDate(formatDate(e))}
                    ranges={[]}
                    disabledDate={(date) => dateFns.isBefore(date, new Date())}
                    format="DD-MM-YYYY"
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <ControlLabel>Appointment Time</ControlLabel>
                  <DatePicker
                    hideMinutes={(minute) => minute % 15 !== 0}
                    disabledMinutes={(minute) => minute % 15 !== 0}
                    hideHours={(hour) => hour < 8 || hour > 16}
                    disabledHours={(hour) => hour < 8 || hour > 16}
                    disabled={location.loading}
                    ranges={[]}
                    format="HH:mm"
                    //showMeridian
                    block
                    onSelect={(e) =>
                      setAppointmentTime(e.toLocaleTimeString("it-IT"))
                    }
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  <ControlLabel>Type of Appointment</ControlLabel>
                  <SelectPicker
                    data={location.data ? location.data.Offer : []}
                    block
                    onChange={(e) => setAppointmentType(e)}
                    disabled={location.loading}
                    searchable={false}
                  />
                </FormGroup>
              </Grid>
              {appointmentType === "Testing" ? (
                <Grid item xs={12} sm={6}>
                  <FormGroup>
                    <ControlLabel>Test Type</ControlLabel>
                    <SelectPicker
                      data={location.data ? location.data.Test : []}
                      block
                      disabled={location.loading}
                      onChange={(e) => setPChoice(e)}
                      searchable={false}
                    />
                  </FormGroup>
                </Grid>
              ) : appointmentType === "Vaccination" ? (
                <Grid item xs={12} sm={6}>
                  <FormGroup>
                    <ControlLabel>Vaccine</ControlLabel>
                    <SelectPicker
                      data={location.data ? location.data.Vaccine : []}
                      block
                      disabled={location.loading}
                      disabledItemValues={disabledList}
                      onChange={(e) => setPChoice(e)}
                      searchable={false}
                    />
                  </FormGroup>
                </Grid>
              ) : null}

              <Grid item xs={12}>
                <FormGroup>
                  <ButtonToolbar>
                    <Button
                      type="submit"
                      appearance="primary"
                      disabled={location.loading}
                    >
                      Submit
                    </Button>
                    <Button
                      appearance="default"
                      onClick={cancel}
                      disabled={location.loading}
                    >
                      Cancel
                    </Button>
                  </ButtonToolbar>
                </FormGroup>
              </Grid>
            </Grid>
          </Form>
        </CardContent>
      </Card>
      {appointment.loading ? <Loading /> : null}
      {patient.loading ? <Loading /> : null}
    </Container>
  );
}

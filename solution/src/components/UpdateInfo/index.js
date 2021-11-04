import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import formatDate from "../../functions/formatDate";
import { useDispatch, useSelector } from "react-redux";
import formatTrn from "../../functions/formatTrn";
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  DatePicker,
  Button,
  Message,
  Uploader,
  Icon,
} from "rsuite";
import {
  updateInfoVerify,
  codeVerify,
  UpdatePatientInfo,
  clearState,
  updateSuccess,
} from "../../store/patientSlice";
import { setActiveKey } from "../../store/navbarSlice";

export default function UpdateInfo() {
  const dispatch = useDispatch();
  const patient = useSelector((state) => state.patient);
  const [page, setPage] = useState(1);
  const [taxNumber, setTaxNumber] = useState();
  const [DOB, setDOB] = useState();
  const [lastName, setLastName] = useState();
  const [code, setCode] = useState();
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [parish, setParish] = useState("");
  const [country, setCountry] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    dispatch(setActiveKey("5"));
    if (patient.success) {
      dispatch(clearState());
      dispatch(updateSuccess());
      setPage(page + 1);
      setTaxNumber("");
      setPhone("");
      setStreetAddress("");
      setCity("");
      setParish("");
      setCountry("");
      setImage("");
      setDOB("");
      setLastName("");
      setCode("");
    }
    if (page >= 4) {
      setPage(1);
    }
    return () => {
      dispatch(clearState());
      dispatch(updateSuccess());
    };
    // eslint-disable-next-line
  }, [patient.success, page]);

  const handelSubmit = (type) => {
    if (type === "verify-info") {
      const data = {
        tax_number: taxNumber,
        date_of_birth: DOB,
        last_name: lastName,
      };
      dispatch(updateInfoVerify(data));
    }
    if (type === "code-verify") {
      const data = {
        code,
      };
      dispatch(codeVerify(data));
    }
    if (type === "update-patient") {
      const data = {
        code: sessionStorage.getItem("code"),
        phone,
        street_address: streetAddress,
        city,
        parish,
        country,
        image,
      };
      dispatch(UpdatePatientInfo(data));
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "4%", marginBottom: "3%" }}>
      {page === 1 ? (
        <Card>
          <CardHeader
            style={{ backgroundColor: "#383d42", color: "#fff" }}
            title={
              <Typography variant="h5" align="center">
                Verify Identity
              </Typography>
            }
          />
          <CardContent>
            <Form fluid onSubmit={() => handelSubmit("verify-info")}>
              <Grid container spacing={2}>
                {patient.message ? (
                  <Grid item xs={12}>
                    <Message
                      closable
                      showIcon
                      type="error"
                      description={patient.message}
                    />
                  </Grid>
                ) : null}
                <Grid item xs={12}>
                  <FormGroup>
                    <ControlLabel>Tax Number</ControlLabel>
                    <FormControl
                      type="tel"
                      pattern="[0-9]{3}-[0-9]{3}-[0-9]{3}"
                      placeholder="123-456-789"
                      onChange={(e) => setTaxNumber(formatTrn(e))}
                      value={taxNumber}
                      required
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12}>
                  <FormGroup>
                    <ControlLabel>Date of Birth</ControlLabel>
                    <DatePicker
                      block
                      onChange={(e) => setDOB(formatDate(e))}
                      required
                      oneTap
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12}>
                  <FormGroup>
                    <ControlLabel>Last Name</ControlLabel>
                    <FormControl onChange={(e) => setLastName(e)} required />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} className="d-flex justify-content-between">
                  <Button type="submit" color="blue" disabled={patient.loading}>
                    Submit
                  </Button>
                  <Button onClick={() => setPage(2)} disabled={patient.loading}>
                    Already have a code?
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </CardContent>
        </Card>
      ) : null}
      {page === 2 ? (
        <Card>
          <CardHeader
            style={{ backgroundColor: "#383d42", color: "#fff" }}
            title={
              <Typography variant="h5" align="center">
                Code
              </Typography>
            }
          />
          <CardContent>
            <Form fluid onSubmit={() => handelSubmit("code-verify")}>
              <Grid container spacing={2}>
                {patient.message ? (
                  <Grid item xs={12}>
                    <Message
                      closable
                      showIcon
                      type="error"
                      description={patient.message}
                    />
                  </Grid>
                ) : null}

                <Grid item xs={12}>
                  <FormGroup>
                    <ControlLabel>Code</ControlLabel>
                    <FormControl onChange={(e) => setCode(e)} required />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} className="d-flex justify-content-between">
                  <Button color="blue" type="submit" disabled={patient.loading}>
                    Submit
                  </Button>
                  <Button disabled={patient.loading} onClick={() => setPage(1)}>
                    Go Back
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </CardContent>
        </Card>
      ) : null}
      {page === 3 ? (
        <Card>
          <CardHeader
            style={{ backgroundColor: "#383d42", color: "#fff" }}
            title={
              <Typography variant="h5" align="center">
                Update Information
              </Typography>
            }
          />
          <CardContent>
            <Form fluid onSubmit={() => handelSubmit("update-patient")}>
              <Grid container spacing={2}>
                {patient.message ? (
                  <Grid item xs={12}>
                    <Message
                      closable
                      showIcon
                      type="error"
                      description={patient.message}
                    />
                  </Grid>
                ) : null}
                <Grid item xs={12}>
                  <FormGroup>
                    <ControlLabel>Phone Number</ControlLabel>
                    <FormControl
                      name="phone"
                      type="tel"
                      pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                      placeholder="123-456-7890"
                      onChange={(e) => setPhone(e)}
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12}>
                  <FormGroup>
                    <ControlLabel>Street Address</ControlLabel>
                    <FormControl
                      name="street_address"
                      onChange={(e) => setStreetAddress(e)}
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12}>
                  <FormGroup>
                    <ControlLabel>City</ControlLabel>
                    <FormControl name="city" onChange={(e) => setCity(e)} />
                  </FormGroup>
                </Grid>
                <Grid item xs={12}>
                  <FormGroup>
                    <ControlLabel>Parish</ControlLabel>
                    <FormControl name="parish" onChange={(e) => setParish(e)} />
                  </FormGroup>
                </Grid>
                <Grid item xs={12}>
                  <FormGroup>
                    <ControlLabel>Country</ControlLabel>
                    <FormControl
                      name="country"
                      onChange={(e) => setCountry(e)}
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Uploader
                    autoUpload={false}
                    listType="picture"
                    onChange={(e) =>
                      setImage(e.length !== 0 ? e[0].blobFile : null)
                    }
                  >
                    <Button>
                      <Icon icon="camera-retro" size="lg" />
                    </Button>
                  </Uploader>
                </Grid>
                <Grid item xs={12}>
                  <Button color="blue" type="submit" disabled={patient.loading}>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </CardContent>
        </Card>
      ) : null}
    </Container>
  );
}

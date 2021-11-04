import React, { useState, useEffect, useRef } from "react";
import { addLocation, clearState } from "../../store/mohSlice";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setActiveKey } from "../../store/navbarSlice";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  Button,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Checkbox,
} from "rsuite";
import { open } from "../../functions/Notifications";

export default function AddLocation() {
  const data = useSelector((state) => state.moh);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [location, setLocation] = useState();
  const [streetAddress, setStreetAddress] = useState();
  const [city, setCity] = useState();
  const [parish, setParish] = useState();
  const [testing, setTesting] = useState(false);
  const [vaccination, setVaccination] = useState(false);
  const [antigen, setAntigen] = useState(false);
  const [pcr, setPcr] = useState(false);
  const formRef = useRef();

  useEffect(() => {
    if (!auth.is_moh_admin) {
      history.push("/moh/home");
    }
    dispatch(setActiveKey("5"));
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [auth.is_moh_admin]);

  useEffect(() => {
    if (data.success) {
      formRef.current._reactInternals.child.stateNode.reset();
      open(
        "success",
        "Location Added!",
        "A new location has been successfully added."
      );
      dispatch(clearState());
      setTesting(false);
      setVaccination(false);
      setAntigen(false);
      setPcr(false);
    }
    if (data.message) {
      open("error", "Error", data.message);
    }
    // eslint-disable-next-line
  }, [data.success, data.message]);

  const onSubmit = () => {
    const data = {
      location_name: location,
      street_address: streetAddress,
      city,
      parish,
      offer: {
        vaccination: vaccination,
        testing: {
          testing: testing,
          tests: [
            { name: "ANTIGEN", selected: antigen },
            { name: "PCR", selected: pcr },
          ],
        },
      },
    };
    if (!vaccination && !testing) {
      open("error", "Error", "Please provide an offer for this location");
    } else if (testing && !antigen && !pcr) {
      open("error", "Error", "Please selecte the tests offered here.");
    } else {
      dispatch(addLocation(data));
    }
  };

  const handelClick = (id) => {
    if (id === 1) {
      setTesting(!testing);
    }
    if (id === 2) {
      setVaccination(!vaccination);
    }
    if (id === 3) {
      setAntigen(!antigen);
    }
    if (id === 4) {
      setPcr(!pcr);
    }
  };

  return (
    <Container maxWidth="sm">
      <Card style={{ width: "100%", borderRadius: 15 }}>
        <CardHeader
          style={{ backgroundColor: "#383d42", color: "#fff" }}
          title={
            <Typography align="center" variant="h5">
              Add Location
            </Typography>
          }
        />
        <CardContent>
          <Form ref={formRef} fluid onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormGroup>
                  <ControlLabel>Location Name</ControlLabel>
                  <FormControl required onChange={(e) => setLocation(e)} />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <ControlLabel>Street Address</ControlLabel>
                  <FormControl required onChange={(e) => setStreetAddress(e)} />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <ControlLabel>City</ControlLabel>
                  <FormControl required onChange={(e) => setCity(e)} />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <ControlLabel>Parish</ControlLabel>
                  <FormControl required onChange={(e) => setParish(e)} />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <ControlLabel>Offers</ControlLabel>
                  <Checkbox checked={testing} onChange={() => handelClick(1)}>
                    Testing
                  </Checkbox>
                  <Checkbox
                    checked={vaccination}
                    onChange={() => handelClick(2)}
                  >
                    Vaccination
                  </Checkbox>
                </FormGroup>
              </Grid>
              {testing ? (
                <Grid item xs={12}>
                  <FormGroup>
                    <ControlLabel>Test Type</ControlLabel>
                    <Checkbox checked={antigen} onChange={() => handelClick(3)}>
                      ANTIGEN
                    </Checkbox>
                    <Checkbox checked={pcr} onChange={() => handelClick(4)}>
                      PCR
                    </Checkbox>
                  </FormGroup>
                </Grid>
              ) : null}
              <Grid item xs={12} className="d-flex justify-content-between">
                <Button color="blue" type="submit" disabled={data.loading}>
                  Submit
                </Button>
                <Button
                  onClick={() => history.push("/moh/locations")}
                  disabled={data.loading}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Form>
        </CardContent>
      </Card>
    </Container>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { getBatchInfo, clearState } from "../../store/mohSlice";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setActiveKey } from "../../store/navbarSlice";
import { register, clearState as CS } from "../../store/authSlice";
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
  SelectPicker,
} from "rsuite";
import { open } from "../../functions/Notifications";

export default function AddLocationAdmin() {
  const data = useSelector((state) => state.moh);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [location, setLocation] = useState();
  const formRef = useRef();

  useEffect(() => {
    if (!auth.is_moh_admin) {
      history.push("/moh/home");
    }
    dispatch(setActiveKey("6"));
    dispatch(getBatchInfo());
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [auth.is_moh_admin]);

  useEffect(() => {
    if (auth.success) {
      formRef.current._reactInternals.child.stateNode.reset();
      setLocation("");
      open("success", "Success", "Location Admin successfully added");
      dispatch(CS());
    }
    if (auth.message) {
      open("error", "Error", auth.message);
    }
    // eslint-disable-next-line
  }, [auth.success, auth.message]);

  const handelSubmit = () => {
    const data = {
      email,
      username,
      first_name: firstName,
      last_name: lastName,
      location,
      is_location_admin: true,
      can_receive_location_batch: true,
    };
    dispatch(register(data));
  };

  return (
    <Container maxWidth="sm">
      <Card style={{ width: "100%", borderRadius: 9 }}>
        <CardHeader
          style={{ backgroundColor: "#383d42", color: "#fff" }}
          title={
            <Typography align="center" variant="h5">
              Add Location Admin
            </Typography>
          }
        />
        <CardContent>
          <Form fluid onSubmit={handelSubmit} ref={formRef}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormGroup>
                  <ControlLabel>Email</ControlLabel>
                  <FormControl
                    onChange={(e) => setEmail(e)}
                    required
                    type="email"
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <ControlLabel>Username</ControlLabel>
                  <FormControl onChange={(e) => setUsername(e)} required />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <ControlLabel>First Name</ControlLabel>
                  <FormControl onChange={(e) => setFirstName(e)} required />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <ControlLabel>Last Email</ControlLabel>
                  <FormControl onChange={(e) => setLastName(e)} required />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <ControlLabel>Location</ControlLabel>
                  <SelectPicker
                    data={data.batchInfo ? data.batchInfo.locations : []}
                    block
                    onChange={(e) => setLocation(e)}
                    value={location}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" color="primary" disabled={auth.loading}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Form>
        </CardContent>
      </Card>
    </Container>
  );
}

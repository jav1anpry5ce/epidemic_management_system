import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  Checkbox,
  Message,
} from "rsuite";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { register, clearState } from "../../store/authSlice";
import { open } from "../../functions/Notifications";
import { setActiveKey } from "../../store/navbarSlice";

export default function AddStaff() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const formRef = useRef();
  const [isAdmin, setIsAdmin] = useState(false);
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [canUpdateTest, setCanUpdateTest] = useState(false);
  const [canUpdateVaccine, setCanUpdateVaccine] = useState(false);
  const [canReceiveLocationBatch, setCanReceiveLocationBatch] = useState(false);
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();

  useEffect(() => {
    dispatch(setActiveKey("4"));
    if (!auth.is_location_admin) {
      history.push("/account/login");
    }
    if (auth.success) {
      formRef.current._reactInternals.child.stateNode.reset();
      setIsAdmin(false);
      setCanCheckIn(false);
      setCanUpdateVaccine(false);
      setCanUpdateTest(false);
      setCanReceiveLocationBatch(false);
      open(
        "success",
        "Staff member was successfully created!",
        "A new staff member was successfully created! An email with the link to activate their account was sent."
      );
      setEmail(null);
      setUsername(null);
      setFirstName(null);
      setLastName(null);
      dispatch(clearState());
    }
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [auth.success, auth.is_location_admin]);
  const handelClick = (id) => {
    if (id === 1) {
      setIsAdmin(!isAdmin);
    }
    if (id === 2) {
      setCanUpdateTest(!canUpdateTest);
    }
    if (id === 3) {
      setCanUpdateVaccine(!canUpdateVaccine);
    }
    if (id === 4) {
      setCanCheckIn(!canCheckIn);
    }
    if (id === 5) {
      setCanReceiveLocationBatch(!canReceiveLocationBatch);
    }
  };

  const handelSubmit = () => {
    const data = {
      email,
      username,
      first_name: firstName,
      last_name: lastName,
      is_location_admin: isAdmin,
      can_update_test: canUpdateTest,
      can_update_vaccine: canUpdateVaccine,
      can_check_in: canCheckIn,
      can_receive_location_batch: canReceiveLocationBatch,
      location: auth.location,
    };
    dispatch(register(data));
  };
  return (
    <Container maxWidth="sm" style={{ marginBottom: "1%" }}>
      <Card>
        <CardHeader
          style={{ backgroundColor: "#383d42", color: "#fff" }}
          title={
            <Typography align="center" variant="h5">
              Add A New Staff
            </Typography>
          }
        />
        <CardContent>
          <Form fluid ref={formRef} onSubmit={handelSubmit}>
            <Grid container spacing={2}>
              {auth.message ? (
                <Grid item xs={12}>
                  <Message
                    closable
                    showIcon
                    type="error"
                    description={auth.message}
                  />
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <FormGroup>
                  <ControlLabel>Email</ControlLabel>
                  <FormControl
                    type="email"
                    onChange={(e) => setEmail(e)}
                    required
                  />
                  <HelpBlock>Required</HelpBlock>
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <ControlLabel>Username</ControlLabel>
                  <FormControl onChange={(e) => setUsername(e)} required />
                  <HelpBlock>Required</HelpBlock>
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <ControlLabel>First Name</ControlLabel>
                  <FormControl onChange={(e) => setFirstName(e)} required />
                  <HelpBlock>Required</HelpBlock>
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <ControlLabel>Last Name </ControlLabel>
                  <FormControl onChange={(e) => setLastName(e)} required />
                  <HelpBlock>Required</HelpBlock>
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <ControlLabel>Permissions</ControlLabel>
                  <Checkbox checked={isAdmin} onChange={() => handelClick(1)}>
                    Is Admin
                  </Checkbox>
                  <Checkbox
                    checked={canUpdateTest}
                    onChange={() => handelClick(2)}
                  >
                    Can Update Test
                  </Checkbox>
                  <Checkbox
                    checked={canUpdateVaccine}
                    onChange={() => handelClick(3)}
                  >
                    Can Update Vaccine
                  </Checkbox>
                  <Checkbox
                    checked={canCheckIn}
                    onChange={() => handelClick(4)}
                  >
                    Can Check In
                  </Checkbox>
                  <Checkbox
                    checked={canReceiveLocationBatch}
                    onChange={() => handelClick(5)}
                  >
                    Can Receive Location Batch
                  </Checkbox>
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                {auth.loading ? (
                  <Button disabled block color="primary">
                    Loading...
                  </Button>
                ) : (
                  <Button type="submit" block color="primary">
                    Submit
                  </Button>
                )}
              </Grid>
            </Grid>
          </Form>
        </CardContent>
      </Card>
    </Container>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { clearState } from "../../store/mohSlice";
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
  Checkbox,
} from "rsuite";
import { open } from "../../functions/Notifications";

export default function AddMOHStaff() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [isAdmin, setIsAdmin] = useState();
  const formRef = useRef();

  useEffect(() => {
    dispatch(setActiveKey("7"));
    if (!auth.is_moh_admin) {
      history.push("/moh/home");
    }
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [auth.is_moh_admin]);

  useEffect(() => {
    if (auth.success) {
      formRef.current._reactInternals.child.stateNode.reset();
      open("success", "Success", "Location Admin successfully added");
      setIsAdmin(false);
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
      is_moh_staff: true,
      is_moh_admin: isAdmin,
    };
    dispatch(register(data));
  };

  const handelClick = (id) => {
    if (id === 1) {
      setIsAdmin(!isAdmin);
    }
  };

  return (
    <Container maxWidth="sm">
      <Card style={{ borderRadius: 9 }}>
        <CardHeader
          style={{ backgroundColor: "#383d42", color: "#fff" }}
          title={
            <Typography align="center" variant="h5">
              Add MOH Staff
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
                  <ControlLabel>Permissions</ControlLabel>
                  <Checkbox checked={isAdmin} onChange={() => handelClick(1)}>
                    Is Admin
                  </Checkbox>
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

import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
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
import { resetRequest, clearState } from "../../store/authSlice";
import { open } from "../../functions/Notifications";
import { setActiveKey } from "../../store/navbarSlice";

export default function ResetPasswordRequest() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const formRef = useRef();
  const [username, setUsername] = useState();

  useEffect(() => {
    if (auth.is_moh_admin) {
      dispatch(setActiveKey("9"));
    } else {
      dispatch(setActiveKey("7"));
    }

    if (!auth.is_moh_admin && !auth.is_location_admin) {
      history.push("/");
    }
    if (auth.success) {
      open("success", "Success", "An email with a reset link has been sent!");
      formRef.current._reactInternals.child.stateNode.reset();
      dispatch(clearState());
      setUsername(null);
    }
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [auth.is_auth, auth.success, auth.is_moh_admin]);

  const handelSubmit = () => {
    const data = {
      username,
    };
    dispatch(resetRequest(data));
  };
  return (
    <Container maxWidth="sm" style={{ marginTop: "3%" }}>
      <Card>
        <CardHeader
          style={{ backgroundColor: "#383d42", color: "#fff" }}
          title={
            <Typography variant="h5" align="center">
              Reset Password Request
            </Typography>
          }
        />
        <CardContent>
          <Form fluid onSubmit={handelSubmit} ref={formRef}>
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
                  <ControlLabel>Username</ControlLabel>
                  <FormControl required onChange={(e) => setUsername(e)} />
                  <HelpBlock>Required</HelpBlock>
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                {auth.loading ? (
                  <Button disabled block color="primary">
                    Loading...
                  </Button>
                ) : (
                  <Button type="submit" color="primary" block>
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

import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  InputGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  Message,
  Icon,
} from "rsuite";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { resetPassword, clearState } from "../../store/authSlice";
import { setActiveKey } from "../../store/navbarSlice";

export default function ResetPassword({ match }) {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [newPassword, setNewPassword] = useState();
  const [conPassword, setConPassword] = useState();
  const [view, setView] = useState(false);
  const [icon, setIcon] = useState("eye");
  const [type, setType] = useState("password");

  useEffect(() => {
    dispatch(setActiveKey(""));
    if (auth.success) {
      dispatch(clearState());
      history.push("/account/login");
    }
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [auth.success]);

  const setVisibility = () => {
    if (!view) {
      setView(true);
      setIcon("eye-slash");
      setType("text");
    } else {
      setView(false);
      setIcon("eye");
      setType("password");
    }
  };

  const handelSubmit = () => {
    const data = {
      reset_token: match.params.token,
      new_password: newPassword,
      con_password: conPassword,
    };
    dispatch(resetPassword(data));
  };
  return (
    <Container maxWidth="sm" style={{ marginTop: "3%" }}>
      <Card>
        <CardHeader
          style={{ backgroundColor: "#383d42", color: "#fff" }}
          title={
            <Typography variant="h5" align="center">
              Reset Password
            </Typography>
          }
        />
        <CardContent>
          <Form fluid onSubmit={handelSubmit}>
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
                <ControlLabel>New Password</ControlLabel>
                <InputGroup>
                  <FormControl
                    type={type}
                    onChange={(e) => setNewPassword(e)}
                    required
                  />
                  <InputGroup.Button onClick={setVisibility}>
                    <Icon icon={icon} />
                  </InputGroup.Button>
                </InputGroup>
                <HelpBlock>Required</HelpBlock>
              </Grid>
              <Grid item xs={12}>
                <ControlLabel>Confirm Password</ControlLabel>
                <InputGroup>
                  <FormControl
                    type={type}
                    onChange={(e) => setConPassword(e)}
                    required
                  />
                  <InputGroup.Button onClick={setVisibility}>
                    <Icon icon={icon} />
                  </InputGroup.Button>
                </InputGroup>
                <HelpBlock>Required</HelpBlock>
              </Grid>
              <Grid item xs={12}>
                {auth.loading ? (
                  <Button block disabled color="primary">
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

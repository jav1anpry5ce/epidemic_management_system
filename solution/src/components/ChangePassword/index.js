import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  FormControl,
  ControlLabel,
  Message,
  InputGroup,
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
import { changePassword, clearState } from "../../store/authSlice";
import { setActiveKey } from "../../store/navbarSlice";

export default function ChangePassword() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [conPassword, setConPassword] = useState();
  const [error, setError] = useState();
  const [view, setView] = useState(false);
  const [icon, setIcon] = useState("eye");
  const [type, setType] = useState("password");

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
    if (newPassword === conPassword) {
      const data = {
        old_password: oldPassword,
        new_password: newPassword,
        con_password: conPassword,
      };
      dispatch(changePassword(data));
    }
  };

  useEffect(() => {
    if (auth.is_moh_admin) {
      dispatch(setActiveKey("8"));
    } else {
      dispatch(setActiveKey("6"));
    }

    if (!auth.is_auth) {
      history.push("/");
    }
    if (auth.success) {
      history.push("/");
      dispatch(clearState());
    }
    if (conPassword !== newPassword) {
      setError(true);
    } else {
      setError(false);
    }
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [auth.success, conPassword, auth.is_auth]);

  return (
    <Container maxWidth="sm" style={{ marginTop: "3%" }}>
      <Card>
        <CardHeader
          style={{ backgroundColor: "#383d42", color: "#fff" }}
          title={
            <Typography variant="h5" align="center">
              Change Password
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
                <ControlLabel>Old Password</ControlLabel>
                <InputGroup>
                  <FormControl
                    required
                    type={type}
                    onChange={(e) => setOldPassword(e)}
                  />
                  <InputGroup.Button onClick={setVisibility}>
                    <Icon icon={icon} />
                  </InputGroup.Button>
                </InputGroup>
              </Grid>
              <Grid item xs={12}>
                <ControlLabel>New Password</ControlLabel>
                <InputGroup>
                  <FormControl
                    required
                    type={type}
                    onChange={(e) => setNewPassword(e)}
                  />
                  <InputGroup.Button onClick={setVisibility}>
                    <Icon icon={icon} />
                  </InputGroup.Button>
                </InputGroup>
              </Grid>
              <Grid item xs={12}>
                <ControlLabel>Confirm Password</ControlLabel>
                <InputGroup>
                  <FormControl
                    required
                    type={type}
                    onChange={(e) => setConPassword(e)}
                    errorMessage={
                      error
                        ? "Confirm password does not match new password"
                        : null
                    }
                    errorPlacement="bottomEnd"
                  />
                  <InputGroup.Button onClick={setVisibility}>
                    <Icon icon={icon} />
                  </InputGroup.Button>
                </InputGroup>
              </Grid>
              <Grid item xs={12}>
                {auth.loading ? (
                  <Button disabled color="primary">
                    Loading...
                  </Button>
                ) : (
                  <Button type="submit" color="primary">
                    Change Password
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

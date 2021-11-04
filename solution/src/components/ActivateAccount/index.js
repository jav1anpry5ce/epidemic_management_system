import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  FormControl,
  ControlLabel,
  HelpBlock,
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
import { activate, clearState } from "../../store/authSlice";
import { setActiveKey } from "../../store/navbarSlice";

export default function ActivateAccount({ match }) {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [password, setPassword] = useState();
  const [conPassword, setConPassword] = useState();
  const [error, setError] = useState(false);
  const [view, setView] = useState(false);
  const [icon, setIcon] = useState("eye");
  const [type, setType] = useState("password");

  useEffect(() => {
    dispatch(setActiveKey(""));
    if (password !== conPassword) {
      setError(true);
    } else {
      setError(false);
    }
    // eslint-disable-next-line
  }, [conPassword, password]);
  useEffect(() => {
    if (auth.success) {
      history.push("/account/login");
      dispatch(clearState());
    }
  });
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
    if (password === conPassword) {
      const data = {
        activate: match.params.token1,
        token: match.params.token2,
        password,
        con_password: conPassword,
      };
      dispatch(activate(data));
    }
  };
  return (
    <Container maxWidth="sm" style={{ marginTop: "3%" }}>
      <Card>
        <CardHeader
          style={{ backgroundColor: "#383d42", color: "#fff" }}
          title={
            <Typography variant="h5" align="center">
              Activate Account
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
                <ControlLabel>Password</ControlLabel>
                <InputGroup>
                  <FormControl
                    type={type}
                    onChange={(e) => setPassword(e)}
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
                    errorMessage={
                      error ? "Confirm password must match password" : null
                    }
                    errorPlacement="bottomEnd"
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
                  <Button block>Loading...</Button>
                ) : (
                  <Button type="submit" block color="primary">
                    Activate
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

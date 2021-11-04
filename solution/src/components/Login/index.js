import React, { useState, useEffect } from "react";
import { login, clearState } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Input, Button, Form, Icon, InputGroup } from "rsuite";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Message } from "rsuite";
import { setActiveKey } from "../../store/navbarSlice";

export default function Login() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const history = useHistory();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
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
  const accountLogin = () => {
    const data = {
      username: username,
      password: password,
    };
    dispatch(login(data));
  };
  useEffect(() => {
    dispatch(setActiveKey(""));
    dispatch(clearState());
  }, [dispatch]);
  useEffect(() => {
    if (auth.is_auth && auth.is_moh_staff) {
      history.push("/moh/home");
    } else if (auth.is_auth) {
      history.push(`/${auth.location}/home`);
    }
    // eslint-disable-next-line
  }, [auth.is_auth]);
  return (
    <Container
      maxWidth="sm"
      style={{ marginTop: "3%" }}
      className="d-flex justify-content-center"
    >
      <Card style={{ width: "85%" }}>
        <CardHeader
          style={{ backgroundColor: "#383d42", color: "#fff" }}
          title={
            <Typography align="center" variant="h5">
              Sign In
            </Typography>
          }
        />
        <CardContent>
          <Form fluid onSubmit={accountLogin}>
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
                <Input
                  placeholder="Username"
                  onChange={(e) => setUsername(e)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <InputGroup inside>
                  <Input
                    type={type}
                    placeholder="Password"
                    onChange={(e) => setPassword(e)}
                    required
                  />
                  <InputGroup.Button onClick={setVisibility}>
                    <Icon icon={icon} />
                  </InputGroup.Button>
                </InputGroup>
              </Grid>
              <Grid item xs={12}>
                {auth.loading ? (
                  <Button disabled size="lg" block color="blue">
                    Loading...
                  </Button>
                ) : (
                  <Button size="lg" block type="submit" color="blue">
                    Sign In
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

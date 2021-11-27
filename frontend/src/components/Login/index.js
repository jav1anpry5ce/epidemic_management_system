import React, { useState, useEffect } from "react";
import { login, clearState } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Card, Input, Form, Button, Alert, Typography } from "antd";
import Container from "@mui/material/Container";
import { setActiveKey } from "../../store/navbarSlice";

const { Title } = Typography;

export default function Login() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const history = useHistory();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

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
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Title style={{ color: "white" }} align="center">
            Login
          </Title>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        {auth.message && <Alert type="error" message={auth.message} />}
        <Form layout="vertical" onFinish={accountLogin}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please enter your username!",
              },
            ]}
            style={{ marginBottom: 2 }}
          >
            <Input onChange={(e) => setUsername(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password!",
              },
            ]}
          >
            <Input.Password onChange={(e) => setPassword(e.target.value)} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 2 }}>
            <Button type="primary" htmlType="submit" loading={auth.loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Container>
  );
}

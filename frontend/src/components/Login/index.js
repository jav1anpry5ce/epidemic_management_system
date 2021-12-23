import React, { useState, useEffect } from "react";
import { login, clearState } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, Input, Form, Button, Alert, Typography } from "antd";
import Container from "@mui/material/Container";
import { setActiveKey } from "../../store/navbarSlice";

const { Title } = Typography;

export default function Login() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const accountLogin = () => {
    const data = {
      email,
      password,
    };
    dispatch(login(data));
  };
  useEffect(() => {
    dispatch(setActiveKey(""));
    dispatch(clearState());
  }, [dispatch]);
  useEffect(() => {
    if (auth.is_auth && auth.is_moh_staff) {
      navigate("/moh/home");
    } else if (auth.is_auth) {
      navigate(`/${auth.location}/home`);
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
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your email!",
              },
            ]}
            style={{ marginBottom: 2 }}
          >
            <Input onChange={(e) => setEmail(e.target.value)} type="email" />
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
            <Button
              type="primary"
              htmlType="submit"
              loading={auth.loading}
              style={{ border: "none" }}
              className="rounded-sm bg-gray-700 text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white transition duration-300"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Container>
  );
}

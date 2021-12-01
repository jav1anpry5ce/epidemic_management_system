import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import { Card, Input, Form, Button, Alert, Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { activate, clearState } from "../../store/authSlice";
import { setActiveKey } from "../../store/navbarSlice";

const { Title } = Typography;

export default function ActivateAccount({ match }) {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [password, setPassword] = useState();
  const [conPassword, setConPassword] = useState();

  useEffect(() => {
    dispatch(setActiveKey(""));
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (auth.success) {
      history.push("/account/login");
      dispatch(clearState());
    }
  });
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
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Title level={3} style={{ color: "white" }} align="center">
            Activate Account
          </Title>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        {auth.message && <Alert type="error" message={auth.message} />}
        <Form layout="vertical" onFinish={handelSubmit}>
          <Form.Item
            label="Password"
            name="password"
            style={{ marginBottom: 2 }}
            rules={[
              {
                required: true,
                message: "Please enter a password!",
              },
            ]}
          >
            <Input.Password onChange={(e) => setPassword(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="con_password"
            style={{ marginBottom: 12 }}
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
            ]}
          >
            <Input.Password onChange={(e) => setConPassword(e.target.value)} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 2 }}>
            <Button
              type="primary"
              htmlType="submit"
              appearance="primary"
              loading={auth.loading}
              style={{ border: "none" }}
              className="rounded-sm bg-gray-700 text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white transition duration-300"
            >
              Activate Account
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Container>
  );
}

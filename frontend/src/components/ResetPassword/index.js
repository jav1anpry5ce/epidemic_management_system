import React, { useState, useEffect } from "react";
import { Card, Input, Form, Button, Alert, Typography } from "antd";
import Container from "@mui/material/Container";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { resetPassword, clearState } from "../../store/authSlice";
import { setActiveKey } from "../../store/navbarSlice";

const { Title } = Typography;

export default function ResetPassword({ match }) {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [newPassword, setNewPassword] = useState();
  const [conPassword, setConPassword] = useState();

  useEffect(() => {
    dispatch(setActiveKey(""));
    if (auth.success) {
      dispatch(clearState());
      history.push("/account/login");
    }
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [auth.success]);

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
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Title level={3} style={{ color: "white" }} align="center">
            Reset Password
          </Title>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        {auth.message && <Alert type="error" message={auth.message} />}
        <Form layout="vertical" onFinish={handelSubmit}>
          <Form.Item
            label="New Password"
            name="new_password"
            rules={[
              {
                required: true,
                message: "Please enter your new password!",
              },
            ]}
            style={{ marginBottom: 2 }}
          >
            <Input onChange={(e) => setNewPassword(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirm_password"
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
            ]}
            style={{ marginBottom: 12 }}
          >
            <Input onChange={(e) => setConPassword(e.target.value)} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 2 }}>
            <Button type="primary" htmlType="submit" loading={auth.loading}>
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Container>
  );
}

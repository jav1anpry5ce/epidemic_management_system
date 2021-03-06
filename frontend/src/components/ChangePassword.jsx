import React, { useState, useEffect } from "react";
import { Card, Input, Form, Button, Alert, Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePassword, clearState, logout } from "../store/authSlice";
import { setActiveKey } from "../store/navbarSlice";

const { Title } = Typography;

export default function ChangePassword() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [conPassword, setConPassword] = useState();

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

    if (auth.success) {
      dispatch(logout());
      navigate("/accounts/login");
      dispatch(clearState());
    }
    // eslint-disable-next-line
  }, [auth.success, auth.is_moh_admin]);

  useEffect(() => {
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, []);

  return (
    <div className="content-layout max-w-xl">
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Title level={3} style={{ color: "white" }} align="center">
            Change Password
          </Title>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        {auth.message && <Alert type="error" message={auth.message} />}
        <Form layout="vertical" onFinish={handelSubmit}>
          <Form.Item
            label="Old Password"
            name="old_password"
            rules={[
              {
                required: true,
                message: "Please enter your old password!",
              },
            ]}
            style={{ marginBottom: 2 }}
          >
            <Input.Password onChange={(e) => setOldPassword(e.target.value)} />
          </Form.Item>
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
            <Input.Password onChange={(e) => setNewPassword(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="con_password"
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
              className="btn-primary"
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

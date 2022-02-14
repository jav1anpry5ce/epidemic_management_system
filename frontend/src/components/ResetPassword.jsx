import React, { useState, useEffect } from "react";
import { Card, Input, Form, Button, Alert, Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword, clearState } from "../store/authSlice";
import { setActiveKey } from "../store/navbarSlice";

const { Title } = Typography;

export default function ResetPassword() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState();
  const [conPassword, setConPassword] = useState();

  const { token } = useParams();

  useEffect(() => {
    dispatch(setActiveKey(""));
    if (auth.success) {
      dispatch(clearState());
      navigate("/accounts/login");
    }
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [auth.success]);

  const handelSubmit = () => {
    const data = {
      reset_token: token,
      new_password: newPassword,
      con_password: conPassword,
    };
    dispatch(resetPassword(data));
  };
  return (
    <div className="my-2 mx-auto flex min-h-[80vh] max-w-xl items-center justify-center justify-items-center py-2">
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
            <Input.Password onChange={(e) => setNewPassword(e.target.value)} />
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
            <Input.Password onChange={(e) => setConPassword(e.target.value)} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 2 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={auth.loading}
              style={{ border: "none" }}
              className="rounded-sm bg-gray-700 text-white transition duration-300 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white"
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

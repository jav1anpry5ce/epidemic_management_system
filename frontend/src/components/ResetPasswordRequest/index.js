import React, { useState, useEffect } from "react";
import { Card, Input, Form, Button, Alert, Typography } from "antd";
import Container from "@mui/material/Container";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { resetRequest, clearState } from "../../store/authSlice";
import { open } from "../../functions/Notifications";
import { setActiveKey } from "../../store/navbarSlice";

const { Title } = Typography;

export default function ResetPasswordRequest() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const [username, setUsername] = useState();

  useEffect(() => {
    if (auth.is_moh_admin) {
      dispatch(setActiveKey("9"));
    } else {
      dispatch(setActiveKey("7"));
    }

    if (!auth.is_moh_admin && !auth.is_location_admin) {
      history.push("/");
    }
    if (auth.success) {
      open("success", "Success", "An email with a reset link has been sent!");
      form.setFieldsValue({ username: "" });
      dispatch(clearState());
      setUsername(null);
    }
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [auth.is_auth, auth.success, auth.is_moh_admin]);

  const handelSubmit = () => {
    const data = {
      username,
    };
    dispatch(resetRequest(data));
  };
  return (
    <Container maxWidth="sm" style={{ marginTop: "3%" }}>
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Title level={3} style={{ color: "white" }} align="center">
            Reset Password Request
          </Title>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        {auth.message && <Alert type="error" message={auth.message} />}
        <Form layout="vertical" onFinish={handelSubmit} form={form}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please enter username!",
              },
            ]}
          >
            <Input onChange={(e) => setUsername(e.target.value)} />
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
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Container>
  );
}

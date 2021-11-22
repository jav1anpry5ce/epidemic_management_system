import React, { useState, useEffect } from "react";
import { clearState } from "../../store/mohSlice";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setActiveKey } from "../../store/navbarSlice";
import { register, clearState as CS } from "../../store/authSlice";
import Container from "@mui/material/Container";
import { Card, Input, Form, Button, Typography, Checkbox } from "antd";
import { open } from "../../functions/Notifications";

const { Title } = Typography;

export default function AddMOHStaff() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [isAdmin, setIsAdmin] = useState();
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(setActiveKey("7"));
    if (!auth.is_moh_admin) {
      history.push("/moh/home");
    }
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [auth.is_moh_admin]);

  useEffect(() => {
    if (auth.success) {
      form.resetFields();
      open("success", "Success", "Location Admin successfully added");
      setIsAdmin(false);
      dispatch(CS());
    }
    if (auth.message) {
      open("error", "Error", auth.message);
    }
    // eslint-disable-next-line
  }, [auth.success, auth.message]);

  const handelSubmit = () => {
    const data = {
      email,
      username,
      first_name: firstName,
      last_name: lastName,
      is_moh_staff: true,
      is_moh_admin: isAdmin,
    };
    dispatch(register(data));
  };

  const handelClick = (id) => {
    if (id === 1) {
      setIsAdmin(!isAdmin);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2%" }}>
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Title level={3} style={{ color: "white" }} align="center">
            Add MOH Staff
          </Title>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        <Form layout="vertical" onFinish={handelSubmit} form={form}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter staff email!",
              },
            ]}
            style={{ marginBottom: 2 }}
          >
            <Input onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please enter staff username!",
              },
            ]}
            style={{ marginBottom: 2 }}
          >
            <Input onChange={(e) => setUsername(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[
              {
                required: true,
                message: "Please enter staff first name!",
              },
            ]}
            style={{ marginBottom: 2 }}
          >
            <Input onChange={(e) => setFirstName(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[
              {
                required: true,
                message: "Please enter staff last name!",
              },
            ]}
            style={{ marginBottom: 2 }}
          >
            <Input onChange={(e) => setLastName(e.target.value)} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 12 }}>
            <Checkbox onChange={() => handelClick(1)}>Is Admin</Checkbox>
          </Form.Item>
          <Form.Item style={{ marginBottom: 2 }}>
            <Button
              type="primary"
              htmlType="submit"
              appearance="primary"
              loading={auth.loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Container>
  );
}

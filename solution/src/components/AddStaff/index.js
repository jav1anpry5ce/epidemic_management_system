import React, { useState, useEffect } from "react";
import { Card, Input, Form, Button, Alert, Typography, Checkbox } from "antd";
import Container from "@mui/material/Container";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { register, clearState } from "../../store/authSlice";
import { open } from "../../functions/Notifications";
import { setActiveKey } from "../../store/navbarSlice";

const { Title } = Typography;

export default function AddStaff() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const [isAdmin, setIsAdmin] = useState(false);
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [canUpdateTest, setCanUpdateTest] = useState(false);
  const [canUpdateVaccine, setCanUpdateVaccine] = useState(false);
  const [canReceiveLocationBatch, setCanReceiveLocationBatch] = useState(false);
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();

  useEffect(() => {
    dispatch(setActiveKey("4"));
    if (!auth.is_location_admin) {
      history.push("/account/login");
    }
    if (auth.success) {
      form.resetFields();
      setIsAdmin(false);
      setCanCheckIn(false);
      setCanUpdateVaccine(false);
      setCanUpdateTest(false);
      setCanReceiveLocationBatch(false);
      open(
        "success",
        "Staff member was successfully created!",
        "A new staff member was successfully created! An email with the link to activate their account was sent."
      );
      setEmail(null);
      setUsername(null);
      setFirstName(null);
      setLastName(null);
      dispatch(clearState());
    }
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [auth.success, auth.is_location_admin]);
  const handelClick = (id) => {
    if (id === 1) {
      setIsAdmin(!isAdmin);
    }
    if (id === 2) {
      setCanUpdateTest(!canUpdateTest);
    }
    if (id === 3) {
      setCanUpdateVaccine(!canUpdateVaccine);
    }
    if (id === 4) {
      setCanCheckIn(!canCheckIn);
    }
    if (id === 5) {
      setCanReceiveLocationBatch(!canReceiveLocationBatch);
    }
  };

  const handelSubmit = () => {
    const data = {
      email,
      username,
      first_name: firstName,
      last_name: lastName,
      is_location_admin: isAdmin,
      can_update_test: canUpdateTest,
      can_update_vaccine: canUpdateVaccine,
      can_check_in: canCheckIn,
      can_receive_location_batch: canReceiveLocationBatch,
      location: auth.location,
    };
    dispatch(register(data));
  };
  return (
    <Container maxWidth="sm" style={{ marginBottom: "1%", marginTop: "1%" }}>
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Title level={3} style={{ color: "white" }} align="center">
            Add A New Staff
          </Title>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        {auth.message && <Alert type="error" message={auth.message} />}
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
                message: "Please enter staff First Name!",
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
                message: "Please enter staff Last Name!",
              },
            ]}
            style={{ marginBottom: 2 }}
          >
            <Input onChange={(e) => setLastName(e.target.value)} />
          </Form.Item>
          <Form.Item name="is_admin" style={{ marginBottom: 2 }}>
            <Checkbox onChange={() => handelClick(1)}>Is Admin</Checkbox>
          </Form.Item>
          <Form.Item name="can_update_test" style={{ marginBottom: 2 }}>
            <Checkbox onChange={() => handelClick(2)}>Can Update Test</Checkbox>
          </Form.Item>
          <Form.Item name="can_update_vaccine" style={{ marginBottom: 2 }}>
            <Checkbox onChange={() => handelClick(3)}>
              Can Update Vaccine
            </Checkbox>
          </Form.Item>
          <Form.Item name="can_check_in" style={{ marginBottom: 2 }}>
            <Checkbox onChange={() => handelClick(4)}>Can Check In</Checkbox>
          </Form.Item>
          <Form.Item name="can_receive_location_batch">
            <Checkbox onChange={() => handelClick(5)}>
              Can Receive Batch
            </Checkbox>
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

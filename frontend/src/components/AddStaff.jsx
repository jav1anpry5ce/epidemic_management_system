import React, { useState, useEffect } from "react";
import { Card, Input, Form, Button, Alert, Typography, Checkbox } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { register, clearState } from "../store/authSlice";
import { open } from "../utils/Notifications";
import { setActiveKey } from "../store/navbarSlice";
import { Link } from "react-router-dom";

const { Title } = Typography;

export default function AddStaff() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isAdmin, setIsAdmin] = useState(false);
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [canUpdateTest, setCanUpdateTest] = useState(false);
  const [canUpdateVaccine, setCanUpdateVaccine] = useState(false);
  const [canReceiveLocationBatch, setCanReceiveLocationBatch] = useState(false);
  const [email, setEmail] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();

  useEffect(() => {
    dispatch(setActiveKey("4"));
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
      setFirstName(null);
      setLastName(null);
      dispatch(clearState());
    }
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [auth.success]);
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
      first_name: firstName.trim(),
      last_name: lastName.trim(),
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
    <div className="my-2 mx-auto flex min-h-[calc(100vh-104px)] max-w-lg items-center justify-center justify-items-center py-2">
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
            <Checkbox checked={isAdmin} onChange={() => handelClick(1)}>
              Is Admin
            </Checkbox>
          </Form.Item>
          <Form.Item name="can_update_test" style={{ marginBottom: 2 }}>
            <Checkbox checked={canUpdateTest} onChange={() => handelClick(2)}>
              Can Update Test
            </Checkbox>
          </Form.Item>
          <Form.Item name="can_update_vaccine" style={{ marginBottom: 2 }}>
            <Checkbox
              checked={canUpdateVaccine}
              onChange={() => handelClick(3)}
            >
              Can Update Vaccine
            </Checkbox>
          </Form.Item>
          <Form.Item name="can_check_in" style={{ marginBottom: 2 }}>
            <Checkbox checked={canCheckIn} onChange={() => handelClick(4)}>
              Can Check In
            </Checkbox>
          </Form.Item>
          <Form.Item name="can_receive_location_batch">
            <Checkbox
              checked={canReceiveLocationBatch}
              onChange={() => handelClick(5)}
            >
              Can Receive Batch
            </Checkbox>
          </Form.Item>
          <Form.Item style={{ marginBottom: 2 }}>
            <div className="flex w-full items-center justify-between">
              <Link
                className="bg-gray-200/50 px-6 py-1 outline outline-1 
                outline-gray-400 transition duration-300 hover:bg-white hover:text-sky-500 hover:no-underline hover:outline hover:outline-1 hover:outline-sky-500"
                to={`/${auth.location}/staff`}
              >
                Back
              </Link>
              <Button
                type="primary"
                htmlType="submit"
                appearance="primary"
                loading={auth.loading}
                style={{ border: "none" }}
                className="rounded-sm bg-gray-700 text-white transition duration-300 
                hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white"
              >
                Submit
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

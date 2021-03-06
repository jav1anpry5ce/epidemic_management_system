import React, { useState, useEffect } from "react";
import { clearState, getAllLocations } from "../store/mohSlice";
import { useSelector, useDispatch } from "react-redux";
import { setActiveKey } from "../store/navbarSlice";
import { register, clearState as CS } from "../store/authSlice";
import { Card, Input, Form, Button, Typography, Select, Checkbox } from "antd";
import { open } from "../utils/Notifications";
import shortid from "shortid";
import { Link } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

export default function MohAdd() {
  const data = useSelector((state) => state.moh);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [email, setEmail] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [location, setLocation] = useState();
  const [form] = Form.useForm();
  const [accountType, setAccountType] = useState();
  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    dispatch(setActiveKey("6"));
    dispatch(getAllLocations());
    return () => {
      dispatch(clearState());
      dispatch(CS());
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (auth.success) {
      form.resetFields();
      setLocation("");
      open("success", "Success", "Staff successfully added");
      dispatch(CS());
    }
    if (auth.message) {
      open("error", "Error", auth.message);
    }
    // eslint-disable-next-line
  }, [auth.success, auth.message]);

  const handelSubmit = () => {
    let data;
    if (accountType === "Site Admin") {
      data = {
        email,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        location,
        is_location_admin: true,
        can_receive_location_batch: true,
      };
    } else {
      data = {
        email,
        first_name: firstName,
        last_name: lastName,
        is_moh_staff: true,
        is_moh_admin: isAdmin,
      };
    }
    dispatch(register(data));
  };

  const handelClick = (id) => {
    if (id === 1) {
      setIsAdmin(!isAdmin);
    }
  };

  return (
    <div className="content-layout max-w-lg">
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Title level={3} style={{ color: "white" }} align="center">
            Add Staff
          </Title>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        <Form layout="vertical" onFinish={handelSubmit} form={form}>
          <Form.Item
            label="Account Type"
            name="account_type"
            rules={[
              {
                required: true,
                message: "Please select account type!",
              },
            ]}
            style={{ marginBottom: 2 }}
          >
            <Select onChange={(e) => setAccountType(e)}>
              <Option value="Site Admin">Site Admin</Option>
              <Option value="MOH Staff">MOH Staff</Option>
            </Select>
          </Form.Item>
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
            <Input onChange={(e) => setEmail(e.target.value)} type="email" />
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
          {accountType === "Site Admin" ? (
            <Form.Item
              label="Location"
              name="location"
              rules={[
                {
                  required: true,
                  message: "Please select staff location!",
                },
              ]}
              style={{ marginBottom: 12 }}
            >
              <Select onChange={(e) => setLocation(e)}>
                {data.locations &&
                  data.locations.map((item) => (
                    <Option key={shortid.generate()} value={item.slug}>
                      {item.label}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          ) : (
            <Form.Item style={{ marginBottom: 12 }}>
              <Checkbox onChange={() => handelClick(1)}>Is Admin</Checkbox>
            </Form.Item>
          )}

          <Form.Item style={{ marginBottom: 2 }}>
            <div className="flex w-full items-center justify-between">
              <Link
                className="bg-gray-200/50 px-6 py-1 outline outline-1 
                outline-gray-400 transition duration-300 hover:bg-white hover:text-sky-500 hover:no-underline hover:outline hover:outline-1 hover:outline-sky-500"
                to="/moh/staff"
              >
                Back
              </Link>
              <Button
                type="primary"
                htmlType="submit"
                appearance="primary"
                loading={auth.loading}
                style={{ border: "none" }}
                className="rounded-sm bg-gray-700 text-white transition 
                duration-300 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white"
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

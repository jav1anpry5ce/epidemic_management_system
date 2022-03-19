import React, { useState, useEffect } from "react";
import { addLocation, clearState } from "../store/mohSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setActiveKey } from "../store/navbarSlice";
import { Card, Input, Form, Button, Typography, Select, Checkbox } from "antd";
import { open } from "../utils/Notifications";
import shortid from "shortid";
import { parishData } from "../utils/micData";

const { Title } = Typography;
const { Option } = Select;

export default function AddLocation() {
  const data = useSelector((state) => state.moh);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [location, setLocation] = useState();
  const [streetAddress, setStreetAddress] = useState();
  const [city, setCity] = useState();
  const [parish, setParish] = useState();
  const [testing, setTesting] = useState(false);
  const [vaccination, setVaccination] = useState(false);
  const [antigen, setAntigen] = useState(false);
  const [pcr, setPcr] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(setActiveKey("5"));
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (data.success) {
      form.resetFields();
      open("success", "Site Added!", "A new site has been successfully added.");
      dispatch(clearState());
      setTesting(false);
      setVaccination(false);
      setAntigen(false);
      setPcr(false);
    }
    if (data.message) {
      open("error", "Error", data.message);
    }
    // eslint-disable-next-line
  }, [data.success, data.message]);

  const onSubmit = () => {
    const data = {
      location_name: location.trim(),
      street_address: streetAddress.trim(),
      city: city.trim(),
      parish,
      offer: {
        vaccination: vaccination,
        testing: {
          testing: testing,
          tests: [
            { name: "ANTIGEN", selected: antigen },
            { name: "PCR", selected: pcr },
          ],
        },
      },
    };
    if (!vaccination && !testing) {
      open("error", "Error", "Please provide what this site offers.");
    } else if (testing && !antigen && !pcr) {
      open("error", "Error", "Please select the tests offered here.");
    } else {
      dispatch(addLocation(data));
    }
  };

  const handelClick = (id) => {
    if (id === 1) {
      setTesting(!testing);
    }
    if (id === 2) {
      setVaccination(!vaccination);
    }
    if (id === 3) {
      setAntigen(!antigen);
    }
    if (id === 4) {
      setPcr(!pcr);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-104px)] max-w-lg items-center justify-center justify-items-center py-2">
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Title level={3} style={{ color: "white" }} align="center">
            Add Site
          </Title>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        <Form layout="vertical" form={form} onFinish={onSubmit}>
          <Form.Item
            label="Site Name"
            name="loaction_name"
            style={{ marginBottom: 2 }}
            rules={[
              {
                required: true,
                message: "Please enter site name!",
              },
            ]}
          >
            <Input onChange={(e) => setLocation(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Street Address"
            name="street_address"
            style={{ marginBottom: 2 }}
            rules={[
              {
                required: true,
                message: "Please enter site street address!",
              },
            ]}
          >
            <Input onChange={(e) => setStreetAddress(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="City"
            name="city"
            style={{ marginBottom: 2 }}
            rules={[
              {
                required: true,
                message: "Please enter site city!",
              },
            ]}
          >
            <Input onChange={(e) => setCity(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Parish"
            name="parish"
            style={{ marginBottom: 2 }}
            rules={[
              {
                required: true,
                message: "Please enter site parish!",
              },
            ]}
          >
            <Select onChange={(e) => setParish(e)}>
              {parishData.map((item) => (
                <Option key={shortid.generate()} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="testing" style={{ marginBottom: 2 }}>
            <Checkbox onChange={() => handelClick(1)}>Testing</Checkbox>
          </Form.Item>
          <Form.Item name="vaccination" style={{ marginBottom: 2 }}>
            <Checkbox onChange={() => handelClick(2)}>Vaccination</Checkbox>
          </Form.Item>
          {testing && (
            <div>
              <Form.Item name="antigen" style={{ marginBottom: 2 }}>
                <Checkbox onChange={() => handelClick(3)}>ANTIGEN</Checkbox>
              </Form.Item>
              <Form.Item style={{ marginBottom: 2 }}>
                <Checkbox name="pcr" onChange={() => handelClick(4)}>
                  PCR
                </Checkbox>
              </Form.Item>
            </div>
          )}
          <Form.Item style={{ marginBottom: 2, marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                onClick={() => navigate("/moh/locations")}
                disabled={data.loading}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                appearance="primary"
                loading={data.loading}
                style={{ border: "none" }}
                className="rounded-sm bg-gray-700 text-white transition duration-300 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white"
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

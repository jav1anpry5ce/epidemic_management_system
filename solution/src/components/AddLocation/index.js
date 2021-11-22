import React, { useState, useEffect } from "react";
import { addLocation, clearState } from "../../store/mohSlice";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setActiveKey } from "../../store/navbarSlice";
import Container from "@mui/material/Container";
import { Card, Input, Form, Button, Typography, Select, Checkbox } from "antd";
import { open } from "../../functions/Notifications";

const { Title } = Typography;
const { Option } = Select;

const parishData = [
  { label: "Kingston", value: "Kingston" },
  { label: "St. Andrew", value: "St. Andrew" },
  { label: "Portland ", value: "Portland " },
  { label: "St. Thomas", value: "St. Thomas" },
  { label: "St. Catherine", value: "St. Catherine" },
  { label: "St. Mary", value: "St. Mary" },
  { label: "St. Ann", value: "St. Ann" },
  { label: "Manchester", value: "Manchester" },
  { label: "Clarendon", value: "Clarendon" },
  { label: "Hanover", value: "Hanover" },
  { label: "Westmoreland", value: "Westmoreland" },
  { label: "St. James", value: "St. James" },
  { label: "Trelawny", value: "Trelawny" },
  { label: "St. Elizabeth", value: "St. Elizabeth" },
];

export default function AddLocation() {
  const data = useSelector((state) => state.moh);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
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
    if (!auth.is_moh_admin) {
      history.push("/moh/home");
    }
    dispatch(setActiveKey("5"));
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [auth.is_moh_admin]);

  useEffect(() => {
    if (data.success) {
      form.resetFields();
      open(
        "success",
        "Location Added!",
        "A new location has been successfully added."
      );
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
      location_name: location,
      street_address: streetAddress,
      city,
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
      open("error", "Error", "Please provide an offer for this location");
    } else if (testing && !antigen && !pcr) {
      open("error", "Error", "Please selecte the tests offered here.");
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
    <Container maxWidth="sm" style={{ marginTop: "2%" }}>
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Title style={{ color: "white" }} align="center">
            Add Location
          </Title>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        <Form layout="vertical" form={form} onFinish={onSubmit}>
          <Form.Item
            label="Location Name"
            name="loaction_name"
            style={{ marginBottom: 2 }}
            rules={[
              {
                required: true,
                message: "Please enter location name!",
              },
            ]}
          >
            <Input onChange={(e) => setLocation(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Streer Address"
            name="street_address"
            style={{ marginBottom: 2 }}
            rules={[
              {
                required: true,
                message: "Please enter location street address!",
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
                message: "Please enter location city!",
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
                message: "Please enter location parish!",
              },
            ]}
          >
            <Select onChange={(e) => setParish(e)}>
              {parishData.map((item, index) => (
                <Option key={index} value={item.value}>
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
                type="primary"
                htmlType="submit"
                appearance="primary"
                loading={data.loading}
              >
                Submit
              </Button>
              <Button
                onClick={() => history.push("/moh/locations")}
                disabled={data.loading}
              >
                Back
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Container>
  );
}

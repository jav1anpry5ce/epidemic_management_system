import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import formatDate from "../../functions/formatDate";
import { useDispatch, useSelector } from "react-redux";
import TRNMask from "../../functions/TRNMask";
import PhoneMask from "../../functions/PhoneMask";
import { Uploader, Icon } from "rsuite";
import {
  Card,
  Input,
  Form,
  Button,
  Alert,
  Typography,
  DatePicker,
  Select,
} from "antd";
import {
  updateInfoVerify,
  codeVerify,
  UpdatePatientInfo,
  clearState,
  updateSuccess,
} from "../../store/patientSlice";
import { setActiveKey } from "../../store/navbarSlice";

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

export default function UpdateInfo() {
  const dispatch = useDispatch();
  const patient = useSelector((state) => state.patient);
  const [page, setPage] = useState(1);
  const [taxNumber, setTaxNumber] = useState();
  const [DOB, setDOB] = useState();
  const [lastName, setLastName] = useState();
  const [code, setCode] = useState();
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [parish, setParish] = useState("");
  const [country, setCountry] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    dispatch(setActiveKey("5"));
    if (patient.success) {
      dispatch(clearState());
      dispatch(updateSuccess());
      setPage(page + 1);
      setTaxNumber("");
      setPhone("");
      setStreetAddress("");
      setCity("");
      setParish("");
      setCountry("");
      setImage("");
      setDOB("");
      setLastName("");
      setCode("");
    }
    if (page >= 4) {
      setPage(1);
    }
    return () => {
      dispatch(clearState());
      dispatch(updateSuccess());
    };
    // eslint-disable-next-line
  }, [patient.success, page]);

  const handelSubmit = (type) => {
    if (type === "verify-info") {
      const data = {
        tax_number: taxNumber,
        date_of_birth: DOB,
        last_name: lastName,
      };
      dispatch(updateInfoVerify(data));
    }
    if (type === "code-verify") {
      const data = {
        code,
      };
      dispatch(codeVerify(data));
    }
    if (type === "update-patient") {
      const data = {
        code: sessionStorage.getItem("code"),
        phone,
        street_address: streetAddress,
        city,
        parish,
        country,
        image,
      };
      dispatch(UpdatePatientInfo(data));
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "4%", marginBottom: "3%" }}>
      {page === 1 && (
        <Card
          headStyle={{ backgroundColor: "#1F2937", border: "none" }}
          title={
            <Title level={3} style={{ color: "white" }} align="center">
              Verify Identity
            </Title>
          }
          bordered={false}
          style={{ width: "100%" }}
        >
          <Form layout="vertical" onFinish={() => handelSubmit("verify-info")}>
            <Form.Item
              label="Tax Number"
              name="tax_number"
              style={{ marginBottom: 2 }}
              rules={[
                {
                  required: true,
                  message: "Please enter your tax number!",
                },
              ]}
            >
              <TRNMask
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="Date of Birth"
              name="dob"
              style={{ marginBottom: 2 }}
              rules={[
                {
                  required: true,
                  message: "Please enter your date of birth!",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                onChange={(e) => setDOB(formatDate(e))}
                format="DD/MM/YYYY"
              />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="last_name"
              style={{ marginBottom: 12 }}
              rules={[
                {
                  required: true,
                  message: "Please enter your last name!",
                },
              ]}
            >
              <Input onChange={(e) => setLastName(e.target.value)} />
            </Form.Item>
            <Form.Item style={{ marginBottom: 2 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  appearance="primary"
                  loading={patient.loading}
                >
                  Submit
                </Button>
                <Button
                  appearance="primary"
                  disabled={patient.loading}
                  onClick={() => setPage(2)}
                >
                  Already have a code?
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      )}
      {page === 2 ? (
        <Card
          headStyle={{ backgroundColor: "#1F2937", border: "none" }}
          title={
            <Title level={3} style={{ color: "white" }} align="center">
              Code
            </Title>
          }
          bordered={false}
          style={{ width: "100%" }}
        >
          {patient.message && <Alert type="error" message={patient.message} />}
          <Form layout="vertical" onFinish={() => handelSubmit("code-verify")}>
            <Form.Item
              label="Enter your code"
              name="code"
              rules={[
                {
                  required: true,
                  message: "Please enter the code you received in your email!",
                },
              ]}
            >
              <Input onChange={(e) => setCode(e.target.value)} />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  appearance="primary"
                  loading={patient.loading}
                >
                  Submit
                </Button>
                <Button
                  appearance="primary"
                  disabled={patient.loading}
                  onClick={() => setPage(1)}
                >
                  Back
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      ) : null}
      {page === 3 && (
        <Card
          headStyle={{ backgroundColor: "#1F2937", border: "none" }}
          title={
            <Title level={3} style={{ color: "white" }} align="center">
              Update Information
            </Title>
          }
          bordered={false}
          style={{ width: "100%" }}
        >
          {patient.message && <Alert type="error" message={patient.message} />}
          <Form
            layout="vertical"
            onFinish={() => handelSubmit("update-patient")}
          >
            <Form.Item
              label="Mobile Number"
              name="mobile_number"
              style={{ marginBottom: 2 }}
            >
              <PhoneMask onChange={(e) => setPhone(e.target.value)} />
            </Form.Item>
            <Form.Item
              label="Street Address"
              name="street_address"
              style={{ marginBottom: 2 }}
            >
              <Input onChange={(e) => setStreetAddress(e.target.value)} />
            </Form.Item>
            <Form.Item label="City" name="city" style={{ marginBottom: 2 }}>
              <Input onChange={(e) => setCity(e.target.value)} />
            </Form.Item>
            <Form.Item label="Parish" name="parish" style={{ marginBottom: 2 }}>
              <Select onChange={(e) => setParish(e)}>
                {parishData.map((item, index) => (
                  <Option key={index} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Picture" name="picture">
              <Uploader
                autoUpload={false}
                listType="picture"
                onChange={(e) =>
                  setImage(e.length !== 0 ? e[0].blobFile : null)
                }
              >
                <Button style={{ marginTop: -6 }}>
                  <Icon icon="camera-retro" size="lg" />
                </Button>
              </Uploader>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                appearance="primary"
                loading={patient.loading}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </Container>
  );
}

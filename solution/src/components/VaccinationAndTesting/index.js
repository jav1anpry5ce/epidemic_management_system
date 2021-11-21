import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setActiveKey } from "../../store/navbarSlice";
import {
  Card,
  Input,
  Form,
  Button,
  Typography,
  DatePicker,
  Select,
} from "antd";
import {
  getTest,
  getVac,
  clearState,
  updateVac,
  updateTest,
} from "../../store/TestVacSlice";
import formatDate from "../../functions/formatDate";
import { open } from "../../functions/Notifications";
import Loading from "../Loading";
import moment from "moment";

const { Title } = Typography;
const { Option } = Select;

export default function VaccinationAndTesting() {
  const dispatch = useDispatch();
  const history = useHistory();
  const testVac = useSelector((state) => state.testVac);
  const auth = useSelector((state) => state.auth);
  const [uuid, setUUID] = useState();
  const [date, setDate] = useState(formatDate(new Date()));
  const [manufacture, setManufacture] = useState("");
  const [vile_number, setVileNumber] = useState();
  const [admister_person, setAdministerPerson] = useState();
  const [arm, setArm] = useState("");
  const [dose_number, setDoseNumber] = useState("");
  const [result, setResult] = useState("");
  const [testForm] = Form.useForm();
  const [vacForm] = Form.useForm();

  const armData = [
    { label: "Left", value: "Left" },
    { label: "Right", value: "Right" },
  ];

  const resultData = [
    { label: "Positive", value: "Positive" },
    { label: "Negative", value: "Negative" },
  ];

  useEffect(() => {
    dispatch(setActiveKey("2"));
    dispatch(clearState());
    if (!auth.is_auth) {
      history.push("/account/login");
    }
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [auth.is_auth, dispatch]);

  const fetchTestVac = () => {
    dispatch(clearState());
    dispatch(getTest(uuid));
    dispatch(getVac(uuid));
  };

  const handelSubmit = (type) => {
    if (type === "Vaccination") {
      const data = {
        id: uuid,
        date_given: date,
        manufacture,
        vile_number,
        admister_person,
        arm,
        dose_number,
      };
      dispatch(updateVac(data));
    } else {
      const data = {
        id: uuid,
        result,
        date,
        type: testVac.Testing.type,
      };
      dispatch(updateTest(data));
    }
  };

  useEffect(() => {
    if (testVac.success) {
      dispatch(clearState());
      open("success", "Success", "Record successfully Updated!");
    }
    if (testVac.message) {
      open("error", "Error", testVac.message);
    }
    if (testVac.Vaccination) {
      setManufacture(testVac.Vaccination.manufacture);
    }
    if (testVac.dose) {
      setDoseNumber(testVac.dose);
    }
    // eslint-disable-next-line
  }, [testVac.success, testVac.message, testVac.Vaccination, testVac.dose]);

  useEffect(() => {
    testForm.setFieldsValue({ date: moment(new Date()) });
    vacForm.setFieldsValue({ date: moment(new Date()) });
    if (testVac.returnType === "Testing") {
      testForm.setFieldsValue({ test_type: testVac.Testing.type });
    }
    if (testVac.returnType === "Vaccination") {
      vacForm.setFieldsValue({
        manufacturer: testVac.Vaccination.manufacture,
        dose: testVac.dose,
      });
    }
    // eslint-disable-next-line
  }, [testVac.returnType]);

  return (
    <Container maxWidth="md" style={{ marginTop: "2%" }}>
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Title level={3} style={{ color: "white" }} align="center">
            Update Vaccination/Testing Record
          </Title>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        <Typography.Text>
          Scan or enter testing / vaccination ID provided by the patient
        </Typography.Text>
        <Form layout="vertical">
          <Form.Item>
            <Input.Search
              onChange={(e) => setUUID(e.target.value)}
              onSearch={fetchTestVac}
              size="large"
            />
          </Form.Item>
        </Form>
        {testVac.Loading && testVac.returnType === null && <Loading />}
        {testVac.returnType === "Testing" && (
          <Form layout="vertical" onFinish={handelSubmit} form={testForm}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Form.Item label="Date" name="date" style={{ marginBottom: 2 }}>
                  <DatePicker
                    format="DD/MM/yyyy"
                    onChange={(e) => setDate(formatDate(e))}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Test Type"
                  name="test_type"
                  style={{ marginBottom: 2 }}
                >
                  <Input />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Result"
                  name="result"
                  style={{ marginBottom: 14 }}
                  rules={[
                    {
                      required: true,
                      message: "Please select test result!",
                    },
                  ]}
                >
                  <Select onChange={(e) => setResult(e)}>
                    {resultData.map((item) => (
                      <Option value={item.value}>{item.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Grid>
              <Grid item xs={12}>
                <Form.Item style={{ marginBottom: 2 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    appearance="primary"
                    loading={testVac.loading}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Grid>
            </Grid>
          </Form>
        )}
        {testVac.returnType === "Vaccination" && (
          <Form
            layout="vertical"
            onFinish={() => handelSubmit("Vaccination")}
            form={vacForm}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Form.Item label="Date" name="date" style={{ marginBottom: 2 }}>
                  <DatePicker
                    format="DD/MM/YYYY"
                    onChange={(e) => setDate(formatDate(e))}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Manufacturer"
                  name="manufacturer"
                  style={{ marginBottom: 2 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Vial Number"
                  name="vial_number"
                  style={{ marginBottom: 2 }}
                  rules={[
                    {
                      required: true,
                      message: "Please enter vial number!",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    onChange={(e) => setVileNumber(e.target.value)}
                  />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Administering Person"
                  name="administering_person"
                  style={{ marginBottom: 2 }}
                  rules={[
                    {
                      required: true,
                      message: "Please enter your name!",
                    },
                  ]}
                >
                  <Input
                    onChange={(e) => setAdministerPerson(e.target.value)}
                  />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Arm"
                  name="arm"
                  style={{ marginBottom: 2 }}
                  rules={[
                    {
                      required: true,
                      message: "Please select an arm!",
                    },
                  ]}
                >
                  <Select onChange={(e) => setArm(e)}>
                    {armData.map((item, index) => (
                      <Option key={index} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item label="Dose" name="dose" style={{ marginBottom: 2 }}>
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item style={{ marginBottom: 2 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    appearance="primary"
                    loading={testVac.loading}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Grid>
            </Grid>
          </Form>
        )}
        {testVac.unauthorized && testVac.returnType === null && (
          <Title level={4} align="center">
            Record does not exist or you are not unauthorized to make changes to
            this record.
          </Title>
        )}
      </Card>
    </Container>
  );
}

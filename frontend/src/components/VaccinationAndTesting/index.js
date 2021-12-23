import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setActiveKey } from "../../store/navbarSlice";
import {
  Card,
  Input,
  Form,
  Button,
  Typography,
  DatePicker,
  Select,
  Table,
  Tooltip,
  Modal,
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
import { EyeOutlined } from "@ant-design/icons";
import Loading from "../Loading";
import moment from "moment";
import axios from "axios";
import shortid from "shortid";

const { Title } = Typography;
const { Option } = Select;

export default function VaccinationAndTesting() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const testVac = useSelector((state) => state.testVac);
  const auth = useSelector((state) => state.auth);
  const [date, setDate] = useState(formatDate(new Date()));
  const [manufacture, setManufacture] = useState("");
  const [vile_number, setVileNumber] = useState();
  const [admister_person, setAdministerPerson] = useState();
  const [arm, setArm] = useState("");
  const [dose_number, setDoseNumber] = useState("");
  const [result, setResult] = useState("");
  const [testForm] = Form.useForm();
  const [vacForm] = Form.useForm();
  const [show, setShow] = useState(false);
  const [type, setType] = useState("Testing");
  const [loading, setLoading] = useState();
  const [data, setdata] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [q, setQ] = useState("");
  const scroll = { y: 470 };

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
      navigate("/accounts/login");
    }
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [auth.is_auth, dispatch]);

  const fetch = () => {
    setLoading(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    axios
      .get(
        `/api/get-checked-in/${type}?page=${page}&pageSize=${pageSize}${
          q && `&search=${q}`
        }`,
        config
      )
      .then((data) => {
        setLoading(false);
        setdata(data.data.results);
        setPagination({
          current: page,
          pageSize: pageSize,
          total: data.data.count,
        });
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // fetch new data whenever the table is changed
  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // fetch data when component mounts first time or whenver there is any change
  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, [page, pageSize, type]);

  const handelSubmit = (id, type) => {
    if (type === "Vaccination") {
      const data = {
        id,
        date_given: date,
        manufacture,
        vile_number,
        admister_person: admister_person.trim(),
        arm,
        dose_number,
      };
      dispatch(updateVac(data));
    } else {
      const data = {
        id,
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
      setShow(false);
      fetch();
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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => (
        <Tooltip placement="topLeft" title={id}>
          {id}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "TRN",
      dataIndex: "patient",
      render: (patient) => (
        <Tooltip placement="topLeft" title={patient.tax_number}>
          {patient.tax_number}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Name",
      dataIndex: "patient",
      render: (patient) => (
        <Tooltip
          placement="topLeft"
          title={`${patient.first_name} ${patient.last_name}`}
        >
          {`${patient.first_name} ${patient.last_name}`}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (dataIndex) => (
        <EyeOutlined
          className="hover:text-blue-400 cursor-pointer"
          onClick={() => {
            setShow(true);
            type === "Testing"
              ? dispatch(getTest(dataIndex))
              : dispatch(getVac(dataIndex));
          }}
        />
      ),
    },
  ];

  return (
    <Container maxWidth="lg" style={{ marginTop: "2%" }}>
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
        <div className="flex justify-between">
          <Select
            onChange={(e) => setType(e)}
            value={type}
            className="w-56 mb-6"
          >
            <Option value="Testing">Testing</Option>
            <Option value="Vaccination">Vaccination</Option>
          </Select>
          <Input.Search
            className="w-2/5"
            placeholder="Search by last name or TRN"
            onChange={(e) => setQ(e.target.value)}
            onSearch={fetch}
          />
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(data) => data.id}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={scroll}
        />
        <Modal
          size="large"
          width={720}
          visible={show}
          onCancel={() => setShow(false)}
          title={
            type === "Testing" ? (
              <Title level={4}>Update Testing Record</Title>
            ) : (
              <Title level={4}>Update Vaccination Record</Title>
            )
          }
          footer={null}
        >
          {testVac.Loading && testVac.returnType === null && <Loading />}
          {testVac.returnType === "Testing" && (
            <Form
              layout="vertical"
              onFinish={() => handelSubmit(testVac.Testing.id)}
              form={testForm}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Form.Item
                    label="Date"
                    name="date"
                    style={{ marginBottom: 0, marginTop: -13 }}
                  >
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
                    style={{ marginBottom: 0, marginTop: -13 }}
                  >
                    <Input />
                  </Form.Item>
                </Grid>
                <Grid item xs={6}>
                  <Form.Item
                    label="Result"
                    name="result"
                    style={{ marginBottom: 0 }}
                    rules={[
                      {
                        required: true,
                        message: "Please select test result!",
                      },
                    ]}
                  >
                    <Select onChange={(e) => setResult(e)}>
                      {resultData.map((item) => (
                        <Option value={item.value} key={shortid.generate()}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Grid>
                <Grid item xs={12} align="right">
                  <Form.Item style={{ marginBottom: 2 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      appearance="primary"
                      loading={testVac.loading}
                      style={{ border: "none" }}
                      className="rounded-sm bg-gray-700 text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white transition duration-300"
                    >
                      Submit
                    </Button>
                    <Button
                      dispatch={testVac.loading}
                      onClick={() => setShow(false)}
                      className="ml-3"
                    >
                      Cancel
                    </Button>
                  </Form.Item>
                </Grid>
              </Grid>
            </Form>
          )}
          {testVac.returnType === "Vaccination" && (
            <Form
              layout="vertical"
              onFinish={() =>
                handelSubmit(testVac.Vaccination.id, "Vaccination")
              }
              form={vacForm}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Form.Item
                    label="Date"
                    name="date"
                    style={{ marginBottom: 0, marginTop: -13 }}
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      onChange={(e) => setDate(formatDate(e))}
                      style={{ width: "100%" }}
                      disabled
                    />
                  </Form.Item>
                </Grid>
                <Grid item xs={6}>
                  <Form.Item
                    label="Manufacturer"
                    name="manufacturer"
                    style={{ marginBottom: 0, marginTop: -13 }}
                  >
                    <Input readOnly />
                  </Form.Item>
                </Grid>
                <Grid item xs={6}>
                  <Form.Item
                    label="Vial Number"
                    name="vial_number"
                    style={{ marginBottom: 0 }}
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
                    style={{ marginBottom: 0 }}
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
                    style={{ marginBottom: 0 }}
                    rules={[
                      {
                        required: true,
                        message: "Please select an arm!",
                      },
                    ]}
                  >
                    <Select onChange={(e) => setArm(e)}>
                      {armData.map((item) => (
                        <Option key={shortid.generate()} value={item.value}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Grid>
                <Grid item xs={6}>
                  <Form.Item
                    label="Dose"
                    name="dose"
                    style={{ marginBottom: 0 }}
                  >
                    <Input readOnly />
                  </Form.Item>
                </Grid>
                <Grid item xs={12} align="right">
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      appearance="primary"
                      loading={testVac.loading}
                      style={{ border: "none" }}
                      className="rounded-sm bg-gray-700 text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white transition duration-300"
                    >
                      Submit
                    </Button>
                    <Button
                      dispatch={testVac.loading}
                      onClick={() => setShow(false)}
                      className="ml-3"
                    >
                      Cancel
                    </Button>
                  </Form.Item>
                </Grid>
              </Grid>
            </Form>
          )}
        </Modal>
      </Card>
    </Container>
  );
}

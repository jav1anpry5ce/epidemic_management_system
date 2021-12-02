import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import {
  clearState,
  getPositiveCases,
  getCase,
  updateCase,
  updateSuccess,
} from "../../store/mohSlice";
import { useHistory } from "react-router-dom";
import { setActiveKey } from "../../store/navbarSlice";
import { EyeOutlined } from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";
import {
  Table,
  Tooltip,
  Typography,
  Card,
  Modal,
  Form,
  Input,
  Spin,
  Select,
  Button,
} from "antd";
import toLocaldate from "../../functions/toLocalDate";
import { open } from "../../functions/Notifications";
import axios from "axios";
const { Title } = Typography;
const { Option } = Select;

const recoveringLocationData = [
  { label: "Home", value: "Home" },
  { label: "Hospitalized", value: "Hospitalized" },
];

const recoveringData = [
  { label: "Recovering", value: "Recovering" },
  { label: "Hospitalized", value: "Hospitalized" },
  { label: "Recovered", value: "Recovered" },
  { label: "Dead", value: "Dead" },
];

function calculate_age(dob) {
  var diff_ms = Date.now() - dob.getTime();
  var age_dt = new Date(diff_ms);

  return Math.abs(age_dt.getUTCFullYear() - 1970);
}

export default function PositiveCases() {
  const moh = useSelector((state) => state.moh);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [caseId, setCaseId] = useState("");
  const [data, setData] = useState();
  const [order, setOrder] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [pageSize, setPageSize] = useState(20);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [form] = Form.useForm();
  const scroll = { y: 470 };

  useEffect(() => {
    if (!auth.is_auth && !auth.is_moh_staff) {
      history.push("/account/login");
    }
  }, [auth.is_moh_staff, auth.is_auth, history]);

  useEffect(() => {
    dispatch(setActiveKey("3"));
    dispatch(getPositiveCases());
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, []);

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
        `/api/get-positive-cases/?page=${page}&pageSize=${pageSize}&ordering=${order}status${
          q && `&search=${q}`
        }`,
        config
      )
      .then((data) => {
        setLoading(false);
        setData(data.data.results);
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

  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, [page, order, pageSize]);

  useEffect(() => {
    if (moh.success) {
      dispatch(updateSuccess());
      onHide();
    }
    if (moh.message) {
      open("error", "Error", moh.message);
    }
    if (moh.caseData) {
      form.setFieldsValue({
        first_name: moh.caseData.case.patient.first_name,
        last_name: moh.caseData.case.patient.last_name,
        gender: moh.caseData.case.patient.gender,
        dob: moh.caseData.case.patient.date_of_birth,
        email: moh.caseData.case.patient.email,
        phone: moh.caseData.case.patient.phone,
        street_address: moh.caseData.case.patient.street_address,
        city: moh.caseData.case.patient.city,
        parish: moh.caseData.case.patient.parish,
        kin_first_name: moh.caseData.next_of_kin.kin_first_name,
        kin_last_name: moh.caseData.next_of_kin.kin_last_name,
        kin_email: moh.caseData.next_of_kin.kin_email,
        kin_phone: moh.caseData.next_of_kin.kin_phone,
        rep_first_name: moh.caseData.rep && moh.caseData.rep.rep_first_name,
        rep_last_name: moh.caseData.rep && moh.caseData.rep.rep_last_name,
        rep_email: moh.caseData.rep && moh.caseData.rep.rep_email,
        rep_phone: moh.caseData.rep && moh.caseData.rep.rep_phone,
        tested: toLocaldate(moh.caseData.case.date_tested),
        location: moh.caseData.case.recovering_location,
        status: moh.caseData.case.status,
      });
      setStatus(moh.caseData.case.status);
      setLocation(moh.caseData.case.recovering_location);
    }
    // eslint-disable-next-line
  }, [moh.success, moh.message, moh.caseData]);

  const onHide = () => {
    setShow(false);
    dispatch(clearState());
    fetch();
    // dispatch(getPositiveCases());
  };

  const onSubmit = () => {
    const data = {
      case_id: caseId,
      recovering_location: location,
      status,
    };
    if (location && status) {
      dispatch(updateCase(data));
    }
  };

  const handleTableChange = (pagination, a, sorter) => {
    if (sorter.order === "ascend") setOrder("");
    else if (sorter.order === "descend") setOrder("-");
    else setOrder("");
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "patient",
      render: (patient) => (
        <Tooltip
          placement="topLeft"
          title={`${patient.first_name} ${patient.last_name}`}
        >
          {patient.first_name} {patient.last_name}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Gender",
      dataIndex: "patient",
      sorter: (a, b) => a.patient.gender.length - b.patient.gender.length,
      render: (patient) => (
        <Tooltip placement="topLeft" title={patient.gender}>
          {patient.gender}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Age",
      dataIndex: "patient",
      // sorter: (a, b) => a.date_of_birth.length - b.date_of_birth.length,
      render: (patient) => (
        <Tooltip
          placement="topLeft"
          title={calculate_age(new Date(patient.date_of_birth))}
        >
          {calculate_age(new Date(patient.date_of_birth))}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },

    {
      title: "Recovering Location",
      dataIndex: "recovering_location",
      render: (recovering_location) => (
        <Tooltip placement="topLeft" title={recovering_location}>
          {recovering_location}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
      render: (status) => (
        <Tooltip placement="topLeft" title={status}>
          {status}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Action",
      dataIndex: "case_id",
      render: (dataIndex) => (
        <EyeOutlined
          className="hover:text-blue-400 cursor-pointer"
          onClick={() => {
            setShow(true);
            setCaseId(dataIndex);
            dispatch(getCase(dataIndex));
          }}
        />
      ),
    },
  ];

  return (
    <Container maxWidth="lg" style={{ marginTop: "2%" }}>
      <Modal
        style={{ top: 0 }}
        width={720}
        visible={show}
        onCancel={() => setShow(false)}
        onOk={() => setShow(false)}
        footer={[
          <Button
            type="primary"
            onClick={onSubmit}
            loading={moh.updating}
            style={{ border: "none" }}
            className="rounded-sm bg-gray-700 text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white transition duration-300"
          >
            Submit
          </Button>,
          <Button onClick={onHide} disabled={moh.updating}>
            Cancel
          </Button>,
        ]}
      >
        {moh.caseData && (
          <Form layout="vertical" form={form}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Title level={4}>Personal Information</Title>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="First Name"
                  name="first_name"
                  style={{ marginBottom: 0 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Last Name"
                  name="last_name"
                  style={{ marginBottom: 0 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Gender"
                  name="gender"
                  style={{ marginBottom: 0 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Date of Birth"
                  name="dob"
                  style={{ marginBottom: 0 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Email"
                  name="email"
                  style={{ marginBottom: 0 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Mobile Number"
                  name="phone"
                  style={{ marginBottom: 0 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Street Address"
                  name="street_address"
                  style={{ marginBottom: 0 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item label="City" name="city" style={{ marginBottom: 0 }}>
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Parish"
                  name="parish"
                  style={{ marginBottom: 0 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={12}>
                <Title level={4}>Next of Kin Information</Title>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="First Name"
                  name="kin_first_name"
                  style={{ marginBottom: 0 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Last Name"
                  name="kin_last_name"
                  style={{ marginBottom: 0 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Email"
                  name="kin_email"
                  style={{ marginBottom: 0 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Mobile Number"
                  name="kin_phone"
                  style={{ marginBottom: 0 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              {moh.caseData.rep && (
                <Grid container spacing={2} className="pl-4">
                  <Grid item xs={12}>
                    <Title level={4} className="mt-4">
                      Representative Information
                    </Title>
                  </Grid>
                  <Grid item xs={6}>
                    <Form.Item
                      label="First Name"
                      name="rep_first_name"
                      style={{ marginBottom: 0 }}
                    >
                      <Input readOnly />
                    </Form.Item>
                  </Grid>
                  <Grid item xs={6}>
                    <Form.Item
                      label="Last Name"
                      name="rep_last_name"
                      style={{ marginBottom: 0 }}
                    >
                      <Input readOnly />
                    </Form.Item>
                  </Grid>
                  <Grid item xs={6}>
                    <Form.Item
                      label="Email"
                      name="rep_email"
                      style={{ marginBottom: 0 }}
                    >
                      <Input readOnly />
                    </Form.Item>
                  </Grid>
                  <Grid item xs={6}>
                    <Form.Item
                      label="Mobile Number"
                      name="rep_phone"
                      style={{ marginBottom: 0 }}
                    >
                      <Input readOnly />
                    </Form.Item>
                  </Grid>
                </Grid>
              )}
              <Grid item xs={12}>
                <Title level={4}>Case Information</Title>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Date Tested"
                  name="tested"
                  style={{ marginBottom: 0 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Recovering Location"
                  name="location"
                  style={{ marginBottom: 0 }}
                >
                  <Select onChange={(e) => setLocation(e)}>
                    {recoveringLocationData.map((item, index) => (
                      <Option key={index} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Status"
                  name="status"
                  style={{ marginBottom: 0 }}
                >
                  <Select onChange={(e) => setStatus(e)}>
                    {recoveringData.map((item, index) => (
                      <Option key={index} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Grid>
            </Grid>
          </Form>
        )}
        {!moh.caseData && (
          <Spin
            className="flex justify-center align-center"
            indicator={<LoadingOutlined style={{ fontSize: 62 }} />}
          />
        )}
      </Modal>
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Title level={3} style={{ color: "white" }} align="center">
            Positive Cases
          </Title>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        <Input.Search
          className="w-2/5 mb-4"
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search using last name or TRN"
          onSearch={() => fetch()}
        />
        <Table
          columns={columns}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={scroll}
        />
      </Card>
    </Container>
  );
}

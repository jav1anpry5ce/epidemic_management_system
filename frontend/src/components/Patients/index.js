import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { getPatient, clearState } from "../../store/mohSlice";
import { useHistory } from "react-router-dom";
import CollapseCard from "../CollapseCard";
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
  Button,
} from "antd";
import axios from "axios";
const { Title } = Typography;

export default function Patients() {
  const moh = useSelector((state) => state.moh);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [data, setData] = useState();
  const [order, setOrder] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState();
  const [show, setShow] = useState(false);
  const [vaccinedExpaned, setVaccinedExpanded] = useState(false);
  const [testingExpaned, setTestingExpanded] = useState(false);
  const [form] = Form.useForm();
  const scroll = { y: 470 };

  useEffect(() => {
    if (!auth.is_auth && !auth.is_moh_staff) {
      history.push("/account/login");
    }
  }, [auth.is_moh_staff, auth.is_auth, history]);

  useEffect(() => {
    dispatch(setActiveKey("2"));
  }, [dispatch]);

  useEffect(() => {
    setLoading(moh.loading);
  }, [moh.loading]);

  const fetch = (q) => {
    setLoading(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    axios
      .get(
        `/api/all-patients/?page=${page}&pageSize=${pageSize}&ordering=${order}tax_number${
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

  const handleTableChange = (pagination, a, sorter) => {
    if (sorter.order === "ascend") setOrder("");
    else if (sorter.order === "descend") setOrder("-");
    else setOrder("");
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, [page, order, pageSize]);

  useEffect(() => {
    if (moh.patient) {
      form.setFieldsValue({
        first_name: moh.patient.first_name,
        last_name: moh.patient.last_name,
        gender: moh.patient.gender,
        dob: moh.patient.date_of_birth,
        email: moh.patient.email,
        mobile_number: moh.patient.phone,
        street_address: moh.patient.street_address,
        city: moh.patient.city,
        parish: moh.patient.parish,
      });
    }
  });

  const expandVaccine = () => {
    if (vaccinedExpaned) {
      setVaccinedExpanded(false);
    } else {
      setVaccinedExpanded(true);
    }
  };

  const expandTesting = () => {
    if (testingExpaned) {
      setTestingExpanded(false);
    } else {
      setTestingExpanded(true);
    }
  };

  const columns = [
    {
      title: "TRN",
      dataIndex: "tax_number",
      sorter: true,
      render: (tax_number) => (
        <Tooltip placement="topLeft" title={tax_number}>
          {tax_number}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Name",
      dataIndex: ["first_name", "last_name"],
      render: (text, row) => (
        <Tooltip
          placement="topLeft"
          title={`${row["first_name"]} ${row["last_name"]}`}
        >
          {row["first_name"]} {row["last_name"]}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "D.O.B",
      dataIndex: "date_of_birth",
      render: (date_of_birth) => (
        <Tooltip placement="topLeft" title={date_of_birth}>
          {date_of_birth}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Gender",
      dataIndex: "gender",
      sorter: (a, b) => a.patient.gender.length - b.patient.gender.length,
      render: (gender) => (
        <Tooltip placement="topLeft" title={gender}>
          {gender}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email) => (
        <Tooltip placement="topLeft" title={email}>
          {email}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (phone) => (
        <Tooltip placement="topLeft" title={phone}>
          {phone}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Action",
      dataIndex: "tax_number",
      render: (dataIndex) => (
        <EyeOutlined
          className="hover:text-blue-400 cursor-pointer"
          onClick={() => {
            setShow(true);
            dispatch(getPatient(dataIndex));
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
        onCancel={() => {
          setShow(false);
          dispatch(clearState());
        }}
        title={<Title level={4}>Patient Information</Title>}
        footer={[
          <Button
            type="primary"
            onClick={() => {
              setShow(false);
              dispatch(clearState());
            }}
          >
            OK
          </Button>,
        ]}
      >
        {moh.patient && (
          <Form layout="vertical" form={form}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid item xs={12} align="center">
                  <Avatar
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                    alt={moh.patient.first_name + " " + moh.patient.last_name}
                    src={moh.patient.image_url}
                    sx={{ width: 165, height: 165 }}
                    loading="lazy"
                  />
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="First Name"
                  name="first_name"
                  style={{ marginBottom: 2 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Last Name"
                  name="last_name"
                  style={{ marginBottom: 2 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Gender"
                  name="gender"
                  style={{ marginBottom: 2 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Date of Birth"
                  name="dob"
                  style={{ marginBottom: 2 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Email"
                  name="email"
                  style={{ marginBottom: 2 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Mobile Number"
                  name="mobile_number"
                  style={{ marginBottom: 2 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Street Address"
                  name="street_address"
                  style={{ marginBottom: 2 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item label="City" name="city" style={{ marginBottom: 2 }}>
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Parish"
                  name="parish"
                  style={{ marginBottom: 2 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={12}>
                <CollapseCard
                  Title="Testing Record"
                  expand={testingExpaned}
                  setExpand={expandTesting}
                  Data={moh.test}
                />
              </Grid>
              <Grid item xs={12}>
                <CollapseCard
                  Title="Vaccination Record"
                  expand={vaccinedExpaned}
                  setExpand={expandVaccine}
                  Data={moh.vaccine}
                />
              </Grid>
            </Grid>
          </Form>
        )}
        {!moh.patient && (
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
            Patients
          </Title>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Input.Search
            style={{ width: "40%", marginBottom: 15 }}
            placeholder="Search using TRN or last name"
            onChange={(e) => setQ(e.target.value)}
            onSearch={() => fetch(q)}
          />
        </div>

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

import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { open } from "../utils/Notifications";
import toLocaldate from "../utils/toLocalDate";
import { setActiveKey } from "../store/navbarSlice";
import {
  getAppointment,
  checkIn,
  clearState,
  updateSuccess,
} from "../store/locationSlice";
import { EyeOutlined } from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  Table,
  Select,
  Tooltip,
  Typography,
  Card,
  Modal,
  Button,
  Form,
  Input,
  Spin,
} from "antd";
import shortid from "shortid";
const { Title } = Typography;
const { Option } = Select;

export default function LocationAppointments() {
  const appointments = useSelector((state) => state.location);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [order, setOrder] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setdata] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [status, setStatus] = useState("Pending");
  const [form] = Form.useForm();
  const scroll = { y: 470 };

  const fdata = [
    { label: "All", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Checked In", value: "Checked In" },
    { label: "Completed", value: "Completed" },
  ];

  useEffect(() => {
    dispatch(setActiveKey("3"));
    dispatch(clearState());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setLoading(appointments.loading);
  }, [appointments.loading]);

  useEffect(() => {
    if (appointments.aSuccess) {
      dispatch(updateSuccess());
      form.setFieldsValue({
        id: appointments.appointment.id,
        first_name: appointments.appointment.patient.first_name,
        last_name: appointments.appointment.patient.last_name,
        date_of_birth: appointments.appointment.patient.date_of_birth,
        date: toLocaldate(appointments.appointment.date),
        time: new Date("1990-01-01 " + appointments.appointment.time)
          .toLocaleTimeString()
          .replace(/:\d+ /, " "),
        type: appointments.appointment.type,
      });
    }
    // eslint-disable-next-line
  }, [appointments.aSuccess]);

  // Fetch data from backend
  const fetch = () => {
    setLoading(true);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    axios
      .get(
        `/api/location/appointments/?page=${page}&pageSize=${pageSize}${
          status === "All" ? "" : `&status=${status}`
        }&ordering=${order}id${q && `&search=${q}`}`,
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
  const handleTableChange = (pagination, a, sorter) => {
    if (sorter.order === "ascend") setOrder("");
    else if (sorter.order === "descend") setOrder("-");
    else setOrder("");
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // fetch data when component mounts first time or whenver there is any change
  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, [page, pageSize, status, appointments.success, order]);

  // handel check in
  const handleCheckIn = () => {
    dispatch(checkIn(appointments.appointment.id));
  };

  useEffect(() => {
    if (appointments.success) {
      setShow(false);
      open("success", "Success", "Patienet was successful Checked In");
    }
    if (appointments.error) {
      open("error", "Someting went wrong", appointments.message);
    }
  }, [appointments.success, appointments.error, appointments.message]);

  // table colmuns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: true,
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
      title: "Date",
      dataIndex: "date",
      render: (date) => (
        <Tooltip placement="topLeft" title={date}>
          {toLocaldate(date)}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Time",
      dataIndex: "time",
      render: (time) => (
        <Tooltip placement="topLeft" title={time}>
          {new Date("1990-01-01 " + time)
            .toLocaleTimeString()
            .replace(/:\d+ /, " ")}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Appointment Type",
      dataIndex: "type",
      render: (type) => (
        <Tooltip placement="topLeft" title={type}>
          {type}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Status",
      dataIndex: "status",
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
      dataIndex: "id",
      render: (dataIndex) => (
        <EyeOutlined
          className="cursor-pointer hover:text-blue-400"
          onClick={() => {
            setShow(true);
            dispatch(getAppointment(dataIndex));
          }}
        />
      ),
    },
  ];

  return (
    <Container maxWidth="lg" style={{ marginTop: "2%", marginBottom: "1%" }}>
      <Modal
        size="lg"
        width={720}
        visible={show}
        onCancel={() => setShow(false)}
        title={<Title level={4}>Appointment Information</Title>}
        footer={[
          !appointments.aLoading && (
            <Button
              key={shortid.generate()}
              loading={appointments.aLoading}
              onClick={handleCheckIn}
              type="primary"
              appearance="primary"
              style={{ border: "none" }}
              className="rounded-sm bg-gray-700 text-white transition duration-300 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white"
            >
              Check Patient In
            </Button>
          ),
          !appointments.aLoading && (
            <Button
              onClick={() => setShow(false)}
              appearance="subtle"
              key={shortid.generate()}
            >
              Cancel
            </Button>
          ),
        ]}
      >
        {appointments.appointment ? (
          <Form layout="vertical" form={form}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Form.Item
                  label="Appointment ID"
                  name="id"
                  style={{ marginBottom: 2 }}
                >
                  <Input readOnly />
                </Form.Item>
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
                  label="Date of Birth"
                  name="date_of_birth"
                  style={{ marginBottom: 2 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Appointment Date"
                  name="date"
                  style={{ marginBottom: 2 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Appointment Time"
                  name="time"
                  style={{ marginBottom: 2 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
              <Grid item xs={6}>
                <Form.Item
                  label="Appointment Type"
                  name="type"
                  style={{ marginBottom: 2 }}
                >
                  <Input readOnly />
                </Form.Item>
              </Grid>
            </Grid>
          </Form>
        ) : (
          <div style={{ textAlign: "center" }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 42 }} />} />
          </div>
        )}
      </Modal>
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Title level={3} style={{ color: "white" }} align="center">
            Appointments
          </Title>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        <div className="flex justify-between">
          <Select
            defaultValue={status}
            onChange={(e) => setStatus(e)}
            className="mb-6 w-56"
          >
            {fdata.map((item) => (
              <Option value={item.value} key={shortid.generate()}>
                {item.label}
              </Option>
            ))}
          </Select>
          <Input.Search
            placeholder="Search by last name or TRN"
            onChange={(e) => setQ(e.target.value)}
            onSearch={fetch}
            className="w-2/5"
          />
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(appointment) => appointment.id}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={scroll}
        />
      </Card>
    </Container>
  );
}

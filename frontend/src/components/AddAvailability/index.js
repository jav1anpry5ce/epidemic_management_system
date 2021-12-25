import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  Typography,
  DatePicker,
  TimePicker,
  Table,
  Tooltip,
} from "antd";
import {
  addAvailability,
  deleteAvailability,
  clearState,
} from "../../store/locationSlice";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import formatDate from "../../functions/formatDate";
import { open } from "../../functions/Notifications";
import toLocaldate from "../../functions/toLocalDate";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
import { setActiveKey } from "../../store/navbarSlice";

const { Title } = Typography;

export default function AddAvailability() {
  const location = useSelector((state) => state.location);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const dateFns = require("date-fns");
  const navigate = useNavigate();
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setdata] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const scroll = { y: 270 };

  useEffect(() => {
    if (!auth.is_auth || auth.is_moh_staff) {
      navigate("/account/login");
    }
    dispatch(setActiveKey("5"));
    // eslint-disable-next-line
  }, [auth.is_auth, auth.is_moh_staff]);

  useEffect(() => {
    if (location.success) {
      open("success", "Success", location.message);
      dispatch(clearState());
      form.setFieldsValue({ date: "", time: "" });
    }
    // eslint-disable-next-line
  }, [location.success]);

  useEffect(() => {
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, []);

  const onSubmit = () => {
    const data = {
      date,
      time,
    };
    dispatch(addAvailability(data));
  };

  const fetch = () => {
    setLoading(true);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    axios
      .get(`/api/get-availability/?page=${page}&pageSize=${pageSize}`, config)
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

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, [page, pageSize, location.success]);

  const columns = [
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
          {new Date("1990-01-01 " + time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
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
        <MdDeleteForever
          className="hover:text-red-600 cursor-pointer text-2xl"
          onClick={() => dispatch(deleteAvailability(dataIndex))}
        />
      ),
      width: 120,
    },
  ];

  return (
    <div
      style={{ minHeight: "80vh" }}
      className="flex justify-items-center justify-center items-center my-2 py-2 max-w-4xl mx-auto"
    >
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Title level={3} style={{ color: "white" }} align="center">
            Availability
          </Title>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        <Table
          columns={columns}
          dataSource={data}
          pagination={pagination}
          scroll={scroll}
          loading={loading}
          onChange={handleTableChange}
        />
        <Form layout="vertical" onFinish={onSubmit} form={form}>
          <Form.Item
            label="Date"
            name="date"
            rules={[
              {
                required: true,
                message: "Please select a date!",
              },
            ]}
            style={{ marginBottom: 2 }}
          >
            <DatePicker
              format="DD/MM/yyyy"
              onChange={(e) => setDate(formatDate(e))}
              className="w-72"
              disabledDate={(date) => dateFns.isBefore(date, new Date())}
            />
          </Form.Item>
          <Form.Item
            label="Time"
            name="time"
            rules={[
              {
                required: true,
                message: "Please select a time!",
              },
            ]}
          >
            <TimePicker
              disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 20, 21, 22, 23, 24]}
              minuteStep={15}
              format="HH:mm"
              hideDisabledOptions
              showNow={false}
              className="w-72"
              onSelect={(e) => setTime(e._d.toLocaleTimeString("it-IT"))}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 2 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ border: "none" }}
              className="rounded-sm bg-gray-700 text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white transition duration-300"
            >
              Add
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearState } from "../store/mohSlice";
import { setActiveKey } from "../store/navbarSlice";
import { Table, Tooltip, Typography, Card, Button } from "antd";
import axios from "axios";
import shortid from "shortid";

const { Title } = Typography;

export default function Locations() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [pageSize, setPageSize] = useState(60);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const scroll = { y: 400 };

  useEffect(() => {
    dispatch(setActiveKey("5"));
    return () => clearState();
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
      .get(`/api/location-details/?page=${page}&pageSize=${pageSize}`, config)
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
  }, [page, pageSize]);

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const columns = [
    {
      title: "Location",
      dataIndex: "name",
      render: (name) => (
        <Tooltip placement="topLeft" title={name}>
          {name}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Pending Appointments",
      dataIndex: "pending_appointments",
      render: (pending_appointments) => (
        <Tooltip placement="topLeft" title={pending_appointments}>
          {pending_appointments}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Vaccines In Stock",
      dataIndex: "number_of_vaccine",
      render: (number_of_vaccine) => (
        <Tooltip placement="topLeft" title={number_of_vaccine}>
          {number_of_vaccine}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },

    {
      title: "Test Administer",
      dataIndex: "tests_administer",
      render: (tests_administer) => (
        <Tooltip placement="topLeft" title={tests_administer}>
          {tests_administer}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "City",
      dataIndex: "city",
      render: (city) => (
        <Tooltip placement="topLeft" title={city}>
          {city}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Parish",
      dataIndex: "parish",
      render: (parish) => (
        <Tooltip placement="topLeft" title={parish}>
          {parish}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
  ];

  return (
    <div
      style={{ minHeight: "80vh" }}
      className="my-2 mx-auto flex max-w-6xl items-center justify-center justify-items-center py-2"
    >
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Title level={3} style={{ color: "white" }} align="center">
            Sites
          </Title>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        <Button
          type="primary"
          onClick={() => navigate("/moh/sites/create")}
          style={{ marginBottom: 2, marginTop: -8, border: "none" }}
          className="btn-primary"
        >
          Add Site
        </Button>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={() => shortid.generate()}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={scroll}
        />
      </Card>
    </div>
  );
}

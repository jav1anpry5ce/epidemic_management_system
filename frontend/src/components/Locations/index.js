import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { locationDetails, clearState } from "../../store/mohSlice";
import { setActiveKey } from "../../store/navbarSlice";
import Container from "@mui/material/Container";
import { Table, Tooltip, Typography, Card, Button } from "antd";
import axios from "axios";

const { Title } = Typography;

export default function Locations() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [data, setData] = useState();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const scroll = { y: 560 };

  useEffect(() => {
    if (!auth.is_moh_staff) {
      history.push("/moh/home");
    }
    dispatch(setActiveKey("5"));
    dispatch(locationDetails());
    return () => clearState();
    // eslint-disable-next-line
  }, [auth.is_moh_staff]);

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
    <Container maxWidth="lg" style={{ marginTop: "2%" }}>
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Title level={3} style={{ color: "white" }} align="center">
            Locations
          </Title>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        <Button
          type="primary"
          onClick={() => history.push("/moh/add-location")}
          style={{ marginBottom: 2, marginTop: -8 }}
        >
          Add Location Batch
        </Button>
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

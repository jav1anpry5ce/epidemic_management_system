import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { clearState } from "../../store/mohSlice";
import { setActiveKey } from "../../store/navbarSlice";
import Container from "@mui/material/Container";
import { Table, Tooltip, Typography, Card, Button, Input } from "antd";
import axios from "axios";
// import { Input } from "@mui/material";
const { Title } = Typography;

export default function BatchManagement() {
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
  const scroll = { y: 470 };

  useEffect(() => {
    dispatch(setActiveKey("4"));
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!auth.is_moh_staff && !auth.is_auth) {
      history.push("/account/login");
    }
    // eslint-disable-next-line
  }, [auth.is_auth, auth.is_moh_staff]);

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
        `/api/get-location-batchs/?page=${page}&pageSize=${pageSize}&ordering=${order}status${
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

  const handleTableChange = (pagination, a, sorter) => {
    if (sorter.order === "ascend") setOrder("");
    else if (sorter.order === "descend") setOrder("-");
    else setOrder("");
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "batch_id",
      render: (batch_id) => (
        <Tooltip placement="topLeft" title={batch_id}>
          {batch_id}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Location",
      dataIndex: "location",
      sorter: (a, b) => a.location.value.length - b.location.value.length,
      render: (location) => (
        <Tooltip placement="topLeft" title={location.value}>
          {location.value}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Vaccine",
      dataIndex: "vaccine",
      sorter: (a, b) => a.vaccine.value.length - b.vaccine.value.length,
      render: (vaccine) => (
        <Tooltip placement="topLeft" title={vaccine.value}>
          {vaccine.value}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },

    {
      title: "Number of Dose",
      dataIndex: "number_of_dose",
      render: (number_of_dose) => (
        <Tooltip placement="topLeft" title={number_of_dose}>
          {number_of_dose}
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
  ];

  return (
    <Container maxWidth="lg" style={{ marginTop: "2%" }}>
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Title level={3} style={{ color: "white" }} align="center">
            Batches
          </Title>
        }
        bordered={false}
        style={{ width: "100%", marginBottom: "3%" }}
      >
        <div className="flex justify-between items-center justify-items-center mb-4">
          <Input.Search
            className="w-2/5"
            onChange={(e) => setQ(e.target.value)}
            onSearch={fetch}
            placeholder="Search using location name or batch id"
          />
          <Button
            type="primary"
            onClick={() => history.push("/moh/batch-creation")}
          >
            Add Location Batch
          </Button>
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

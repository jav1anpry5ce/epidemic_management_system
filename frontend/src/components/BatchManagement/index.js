import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearState, getBatch } from "../../store/mohSlice";
import { setActiveKey } from "../../store/navbarSlice";
import Container from "@mui/material/Container";
import { Table, Tooltip, Typography, Card, Button, Input, Modal } from "antd";
import axios from "axios";
import { EyeOutlined } from "@ant-design/icons";
import PrintView from "./PrintView";
import { useReactToPrint } from "react-to-print";
import shortid from "shortid";
const { Title } = Typography;

export default function BatchManagement() {
  const auth = useSelector((state) => state.auth);
  const moh = useSelector((state) => state.moh);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [order, setOrder] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [show, setShow] = useState(false);
  const scroll = { y: 470 };
  const componenetRef = useRef();

  useEffect(() => {
    dispatch(setActiveKey("4"));
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!auth.is_moh_staff && !auth.is_auth) {
      navigate("/accounts/login");
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
        `/api/get-location-batchs/?page=${page}&pageSize=${pageSize}${
          order !== null ? `&ordering=${order}vaccine` : ""
        }${q && `&search=${q}`}`,
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
    else setOrder(null);
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
      title: "Site",
      dataIndex: "location",
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
      sorter: true,
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
      dataIndex: "batch_id",
      render: (dataIndex) => (
        <EyeOutlined
          className="hover:text-blue-400 cursor-pointer"
          onClick={() => {
            setShow(true);
            dispatch(getBatch(dataIndex));
          }}
        />
      ),
      width: 100,
    },
  ];

  const pageStyle = `
  @page {
    size: 164mm 103mm;
  }
  @media all {
    .pagebreak {
      display: none;
    }
  }
  `;
  const handlePrint = useReactToPrint({
    content: () => componenetRef.current,
    pageStyle: () => pageStyle,
  });

  return (
    <Container maxWidth="lg" style={{ marginTop: "2%" }}>
      <Modal
        visible={show}
        onCancel={() => setShow(false)}
        footer={[
          <Button onClick={() => setShow(false)} key={shortid.generate()}>
            Cancel
          </Button>,
          <Button
            style={{ border: "none" }}
            className="rounded-sm bg-gray-700 text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white transition duration-300"
            onClick={handlePrint}
            key={shortid.generate()}
          >
            Print
          </Button>,
        ]}
      >
        <PrintView
          componenetRef={componenetRef}
          data={moh.batch && moh.batch}
        />
      </Modal>
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
            onSearch={() => {
              setPage(1);
              fetch();
            }}
            placeholder="Search using location name or batch id"
          />
          <Button
            type="primary"
            onClick={() => navigate("/moh/batches/create")}
            style={{ border: "none" }}
            className="rounded-sm bg-gray-700 text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white transition duration-300"
          >
            Add Location Batch
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(data) => data.batch_id}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={scroll}
        />
      </Card>
    </Container>
  );
}

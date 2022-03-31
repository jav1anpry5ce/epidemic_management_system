import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setActiveKey } from "../store/navbarSlice";
import { Table, Tooltip, Typography, Card } from "antd";
import axios from "axios";
import shortid from "shortid";
import { Link } from "react-router-dom";

const { Title } = Typography;

export default function Inventory() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const scroll = { y: 450 };
  useEffect(() => {
    dispatch(setActiveKey("7"));
    fetch();
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
      .get("/api/get-inventory", config)
      .then((data) => {
        setLoading(false);
        setData(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const columns = [
    {
      title: "Vaccine",
      dataIndex: "vaccine",
      render: (vaccine) => (
        <Tooltip placement="topLeft" title={vaccine}>
          {vaccine}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "In Stock",
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
  ];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-104px)] max-w-3xl items-center justify-center justify-items-center">
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Title level={3} style={{ color: "white" }} align="center">
            Inventory
          </Title>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        <div className="flex w-full items-center justify-end text-white">
          <Link
            className="rounded bg-slate-800 px-4 py-1.5 
              hover:bg-slate-700/95 hover:text-white hover:no-underline hover:shadow-md"
            to="/moh/inventory/update"
          >
            Update Inventory
          </Link>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={() => shortid.generate()}
          loading={loading}
          scroll={scroll}
          pagination={false}
        />
      </Card>
    </div>
  );
}

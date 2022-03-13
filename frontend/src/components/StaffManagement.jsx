import { EyeOutlined } from "@ant-design/icons";
import { Card, Input, Table, Tooltip, Typography } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import format from "date-fns/format";
import { Link } from "react-router-dom";
import { setActiveKey } from "../store/navbarSlice";

import UpdateStaff from "./UpdateStaff";

const { Title } = Typography;

export default function StaffManagement() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [q, setQ] = useState("");
  const [show, setShow] = useState(false);
  const [staff, setStaff] = useState();
  const scroll = { y: 470 };

  useEffect(() => {
    if (auth.is_location_admin) dispatch(setActiveKey("4"));
    else dispatch(setActiveKey("6"));
    // eslint-disable-next-line
  }, []);

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
        `/auth/staff/details/${
          auth.is_location_admin ? "SITEADMIN" : "MOHADMIN"
        }?page=${page}&pageSize=${pageSize}${q && `&search=${q}`}`,
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

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const findStaff = (email) => {
    const staff = data.filter((s) => s.email === email);
    setStaff(staff[0]);
    setShow(true);
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, [page, pageSize, show]);

  const columns = [
    {
      title: "First Name",
      dataIndex: "first_name",
      render: (first_name) => (
        <Tooltip placement="topLeft" title={`${first_name}`}>
          {first_name}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      render: (last_name) => (
        <Tooltip placement="topLeft" title={`${last_name}`}>
          {last_name}
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
        <Tooltip placement="topLeft" title={`${email}`}>
          {email}
        </Tooltip>
      ),
    },
    {
      title: "Account Activate",
      dataIndex: "is_active",
      render: (is_active) => (
        <Tooltip placement="topLeft" title={`${is_active}`}>
          {is_active ? (
            <AiFillCheckCircle className="h-6 w-6 text-center text-emerald-400" />
          ) : (
            <AiFillCloseCircle className="h-6 w-6 text-center text-red-500" />
          )}
        </Tooltip>
      ),
    },
    {
      title: "Last Login",
      dataIndex: "last_login",
      render: (last_login) => (
        <Tooltip
          placement="topLeft"
          title={`${format(new Date(last_login), "DD MMM YYYY hh:mm A")}`}
        >
          {format(new Date(last_login), "DD MMM YYYY hh:mm A")}
        </Tooltip>
      ),
    },
    {
      title: "Action",
      dataIndex: "email",
      render: (email) => (
        <Tooltip placement="top" title="View">
          <EyeOutlined
            className="cursor-pointer hover:text-blue-400"
            onClick={() => findStaff(email)}
          />
        </Tooltip>
      ),
      width: 120,
    },
  ];

  return (
    <div
      style={{ minHeight: "80vh" }}
      className="my-2 mx-auto flex max-w-5xl items-center justify-center justify-items-center py-2"
    >
      <UpdateStaff staff={staff} show={show} setShow={setShow} />
      <Card
        headStyle={{ backgroundColor: "#1F2937", border: "none" }}
        title={
          <Title level={3} style={{ color: "white" }} align="center">
            Staff Management
          </Title>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        <div className="-mt-4 flex items-center justify-between">
          <Input.Search
            placeholder="Search by email or last name"
            onChange={(e) => setQ(e.target.value)}
            onSearch={fetch}
            className=" w-2/5"
          />
          <Link
            className="bg-slate-700 px-6 py-1 text-white hover:scale-105 hover:text-white hover:no-underline"
            to="add"
          >
            Add Staff
          </Link>
        </div>
        <Table
          rowKey={(data) => data.email}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          scroll={scroll}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
}

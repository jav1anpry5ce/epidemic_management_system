import React, { useState, useEffect } from "react";
import { Card, Input, Form, Button, Alert } from "antd";
import { setActiveKey } from "../store/navbarSlice";
import { useDispatch } from "react-redux";
import TRNMask from "../utils/TRNMask";
import axios from "axios";
import { Link } from "react-router-dom";

export default function GetRecords() {
  const dispatch = useDispatch();
  const [trn, setTrn] = useState();
  const [code, setCode] = useState();
  const [page, setPage] = useState(1);
  const [link, setLink] = useState();
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(setActiveKey("5"));
    // eslint-disable-next-line
  }, []);

  async function handelSubmit(type) {
    if (type === "TRN") {
      setLoading(true);
      await axios
        .post("/api/patients/records/", { trn })
        .then(() => {
          setMessage("");
          setPage(2);
        })
        .catch((err) => {
          setMessage(err.response.data.Message);
        });
      setLoading(false);
    } else {
      setLoading(true);
      await axios
        .post("/api/patients/records/link", { code })
        .then((res) => {
          setMessage("");
          setLink(res.data.Link);
          setPage(3);
        })
        .catch((err) => {
          setMessage(err.response.data.Message);
        });
      setLoading(false);
    }
  }

  return (
    <div
      className="mx-auto flex h-full max-w-2xl items-center px-2"
      style={{ height: "80vh" }}
    >
      {page === 1 && (
        <Card
          headStyle={{ backgroundColor: "#1F2937", border: "none" }}
          title={
            <p className="text-center text-2xl font-semibold text-white">
              Get My Records
            </p>
          }
          bordered={false}
          className="w-full"
        >
          {message && <Alert type="error" message={message} />}
          <Form layout="vertical" onFinish={() => handelSubmit("TRN")}>
            <Form.Item
              label="TRN"
              name="trn"
              rules={[
                {
                  required: true,
                  message: "Please enter your TRN!",
                },
              ]}
            >
              <TRNMask onChange={(e) => setTrn(e.target.value)} />
            </Form.Item>
            <Form.Item style={{ marginBottom: 2 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ border: "none" }}
                className="rounded-sm bg-gray-700 text-white transition duration-300 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
      {page === 2 && (
        <Card
          headStyle={{ backgroundColor: "#1F2937", border: "none" }}
          title={
            <p className="text-center text-2xl font-semibold text-white">
              Verify Identity
            </p>
          }
          bordered={false}
          className="w-full"
        >
          {message && <Alert type="error" message={message} />}
          <Form layout="vertical" onFinish={handelSubmit}>
            <Form.Item
              label="Code"
              name="code"
              rules={[
                {
                  required: true,
                  message: "Please enter the code you received!",
                },
              ]}
            >
              <Input
                onChange={(e) => setCode(e.target.value)}
                placeholder="Please enter the code you received"
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 2 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ border: "none" }}
                className="rounded-sm bg-gray-700 text-white transition duration-300 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
      {page === 3 && (
        <div className="w-full rounded bg-white p-3 shadow">
          <p className="text-center text-2xl">
            A link to view your record has been sent to you!
          </p>
          <p className="text-center text-2xl">
            You can access your record now by clicking{" "}
            <Link to={`/${link}`}>here</Link>
          </p>
        </div>
      )}
    </div>
  );
}

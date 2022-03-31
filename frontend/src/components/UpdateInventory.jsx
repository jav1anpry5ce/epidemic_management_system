import React, { useEffect, useState } from "react";
import { Card, Input, Form, Button, Typography, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setActiveKey } from "../store/navbarSlice";
import Loading from "./Loading";
import axios from "axios";
import { open } from "../utils/Notifications";

const { Title } = Typography;
const { Option } = Select;

export default function UpdateInventory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [vaccine, setVaccine] = useState();
  const [dose, setDose] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

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
      .get("/api/get-vaccine", config)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handelSubmit = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    setLoading(true);
    const data = {
      vaccine,
      number_of_dose: dose,
    };
    axios
      .post("api/update-inventory/", data, config)
      .then(() => {
        setLoading(false);
        form.resetFields();
        setVaccine("");
        setDose("");
        open("success", "Success", "Inventory updated!");
      })
      .catch(() => {
        setLoading(false);
      });
  };
  if (data)
    return (
      <div className="mx-auto flex min-h-[calc(100vh-104px)] w-full max-w-lg items-center justify-center justify-items-center py-2">
        <div className="flex w-full items-center justify-center">
          <Card
            headStyle={{ backgroundColor: "#1F2937", border: "none" }}
            title={
              <Title level={4} style={{ color: "white" }} align="center">
                Update Inventory
              </Title>
            }
            bordered={false}
            style={{ width: "100%" }}
          >
            <Form layout="vertical" onFinish={handelSubmit} form={form}>
              <Form.Item
                label="Vaccine"
                name="vaccine"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please select vaccine!",
                  },
                ]}
              >
                <Select onChange={(e) => setVaccine(e)}>
                  {data.map((item, index) => (
                    <Option key={index} value={item.value}>
                      {item.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Number of Dose"
                name="number_of_dose"
                style={{ marginBottom: 12 }}
                rules={[
                  {
                    required: true,
                    message: "Please enter number of dose!",
                  },
                ]}
              >
                <Input
                  type="number"
                  onChange={(e) => setDose(e.target.value)}
                  min={10}
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 2 }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    appearance="primary"
                    onClick={() => navigate("/moh/inventory")}
                  >
                    Finish
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    appearance="primary"
                    loading={loading}
                    style={{ border: "none" }}
                    className="btn-primary"
                  >
                    Submit
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    );
  else return <Loading />;
}

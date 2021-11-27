import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  getBatchInfo,
  addBatch,
  clearState,
  updateSuccess,
} from "../../store/mohSlice";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useReactToPrint } from "react-to-print";
import { setActiveKey } from "../../store/navbarSlice";
import { Card, Input, Form, Button, Typography, Select } from "antd";
import Loading from "../Loading";
import PrintView from "./PrintView";
import { open } from "../../functions/Notifications";

const { Title } = Typography;
const { Option } = Select;

export default function CreateBatch() {
  const data = useSelector((state) => state.moh);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [location, setLocation] = useState("");
  const [vaccine, setVaccine] = useState("");
  const [dose, setDose] = useState("");
  const componenetRef = useRef();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!auth.is_moh_staff && !auth.is_auth) {
      history.push("/account/login");
    }
    // eslint-disable-next-line
  }, [auth.is_auth, auth.is_moh_staff]);

  useEffect(() => {
    dispatch(setActiveKey("4"));
    dispatch(getBatchInfo());
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (data.message) {
      open("error", "Error", data.message);
    }
    if (data.success) {
      form.resetFields();
      setLocation("");
      setVaccine("");
      setDose("");
    }
    // eslint-disable-next-line
  }, [data.message, data.success]);

  const handelSubmit = () => {
    const data = {
      location,
      vaccine,
      number_of_dose: dose,
    };
    dispatch(addBatch(data));
  };

  const pageStyle = `
  @page {
    size: 280mm 160mm;
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

  if (data.batchInfo) {
    return (
      <Container maxWidth="sm" style={{ marginTop: "2%" }}>
        {data.success ? (
          <Paper elevation={1} style={{ width: 585 }}>
            <Container>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <PrintView
                    componenetRef={componenetRef}
                    data={data.batchData}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className="flex justify-between mb-3 w-full">
                    <Button type="primary" onClick={handlePrint}>
                      Print
                    </Button>
                    <Button onClick={() => dispatch(updateSuccess())}>
                      Create new batch
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Container>
          </Paper>
        ) : (
          <Card
            headStyle={{ backgroundColor: "#1F2937", border: "none" }}
            title={
              <Title level={4} style={{ color: "white" }} align="center">
                Create a new location Batch
              </Title>
            }
            bordered={false}
            style={{ width: "100%" }}
          >
            <Form layout="vertical" onFinish={handelSubmit} form={form}>
              <Form.Item
                label="Location"
                name="location"
                style={{ marginBottom: 2 }}
                rules={[
                  {
                    required: true,
                    message: "Please select location!",
                  },
                ]}
              >
                <Select onChange={(e) => setLocation(e)}>
                  {data.batchInfo.locations.map((item, index) => (
                    <Option key={index} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
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
                  {data.batchInfo.vaccines.map((item, index) => (
                    <Option key={index} value={item.value}>
                      {item.label}
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
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 2 }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    appearance="primary"
                    loading={data.loading}
                  >
                    Submit
                  </Button>
                  <Button
                    appearance="primary"
                    loading={data.loading}
                    onClick={() => history.push("/moh/batch-management")}
                  >
                    Back
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        )}
      </Container>
    );
  } else {
    return <Loading />;
  }
}

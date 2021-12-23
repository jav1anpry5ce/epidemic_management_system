import React, { useState, useEffect } from "react";
import { receiveBatch, clearState } from "../../store/locationSlice";
import { useSelector, useDispatch } from "react-redux";
import Container from "@mui/material/Container";
import { Card, Input, Form, Button, Alert, Typography } from "antd";
import { open } from "../../functions/Notifications";
import { useParams } from "react-router-dom";

const { Title } = Typography;

export default function ReceiveBatch({ match }) {
  const data = useSelector((state) => state.location);
  const dispatch = useDispatch();
  const [authorizationCode, setAuthorizationCode] = useState();
  const [form] = Form.useForm();

  const { uuid } = useParams();

  useEffect(() => {
    if (data.success) {
      form.resetFields();
      open("success", "Success", "Batch received!");
      dispatch(clearState());
      setAuthorizationCode("");
      setTimeout(() => {
        window.close();
      }, 3500);
    }
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [data.success]);

  const handelSubmit = () => {
    const data = {
      batch_id: uuid,
      authorization_code: authorizationCode.toUpperCase().trim(),
    };
    dispatch(receiveBatch(data));
  };

  return (
    <Container maxWidth="sm">
      <div
        className="flex justify-center items-center"
        style={{ minHeight: "80vh" }}
      >
        <Card
          headStyle={{ backgroundColor: "#1F2937", border: "none" }}
          title={
            <Title level={3} style={{ color: "white" }} align="center">
              Receive Batch
            </Title>
          }
          bordered={false}
          style={{ width: "100%" }}
        >
          {data.message && <Alert type="error" message={data.message} />}
          <Form layout="vertical" onFinish={handelSubmit} form={form}>
            <Form.Item
              label="Authorization Code"
              name="authorization_code"
              rules={[
                {
                  required: true,
                  message: "Please enter authorization code!",
                },
              ]}
              style={{ marginBottom: 12 }}
            >
              <Input onChange={(e) => setAuthorizationCode(e.target.value)} />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                appearance="primary"
                loading={data.loading}
                style={{ border: "none" }}
                className="rounded-sm bg-gray-700 text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white transition duration-300"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Container>
  );
}

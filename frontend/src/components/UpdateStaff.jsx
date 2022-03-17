import { Button, Form, Modal, Checkbox, Input } from "antd";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import shortid from "shortid";
import axios from "axios";

export default function UpdateStaff({ staff, show, setShow }) {
  const auth = useSelector((state) => state.auth);
  const [isActive, setIsActive] = useState(staff && staff.is_active);
  const [isAdmin, setIsAdmin] = useState(staff && staff.is_location_admin);
  const [mohAdmin, setMohAdmin] = useState(staff && staff.is_moh_admin);
  const [canCheckIn, setCanCheckIn] = useState(staff && staff.can_check_in);
  const [canUpdateTest, setCanUpdateTest] = useState(
    staff && staff.can_update_test
  );
  const [canUpdateVaccine, setCanUpdateVaccine] = useState(
    staff && staff.can_update_vaccine
  );
  const [canReceiveBatch, setCanReceiveBatch] = useState(
    staff && staff.can_receive_location_batch
  );
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (staff) {
      form.setFieldsValue({
        first_name: staff.first_name,
        last_name: staff.last_name,
      });
      setIsActive(staff.is_active);
      setIsAdmin(staff.is_location_admin);
      setMohAdmin(staff.is_moh_admin);
      setCanCheckIn(staff.can_check_in);
      setCanUpdateTest(staff.can_update_test);
      setCanUpdateVaccine(staff.can_update_vaccine);
      setCanReceiveBatch(staff.can_receive_location_batch);
    }
    // eslint-disable-next-line
  }, [staff]);

  const update = () => {
    setLoading(true);
    const data = {
      email: staff.email,
      is_active: isActive || false,
      is_location_admin: isAdmin || false,
      is_moh_admin: mohAdmin || false,
      can_check_in: canCheckIn || false,
      can_update_test: canUpdateTest || false,
      can_update_vaccine: canUpdateVaccine || false,
      can_receive_location_batch: canReceiveBatch || false,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    axios
      .post("/auth/staff/update/", data, config)
      .then(() => {
        setLoading(false);
        setShow(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      size="lg"
      width={720}
      visible={show}
      onCancel={() => setShow(false)}
      title="Update Staff"
      footer={[
        <Button
          onClick={() => setShow(false)}
          appearance="subtle"
          key={shortid.generate()}
        >
          Cancel
        </Button>,
        <Button
          key={shortid.generate()}
          loading={loading}
          onClick={update}
          type="primary"
          appearance="primary"
          style={{ border: "none" }}
          className="rounded-sm bg-gray-700 text-white transition duration-300 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white"
        >
          Update
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <div className="mb-2 flex items-center justify-between space-x-4">
          <Form.Item label="First Name" name="first_name" className="w-full">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Last Name" name="last_name" className="w-full">
            <Input readOnly />
          </Form.Item>
        </div>
        <div
          className={`mb-0 grid ${
            auth.is_location_admin ? "grid-cols-3" : "grid-cols-2"
          }`}
        >
          <Form.Item label="Is Admin" id="isAdmin" className="w-full">
            <Checkbox checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)} />
          </Form.Item>
          {staff?.is_moh_staff && (
            <Form.Item label="Can Check In" id="canCheckIn" className="w-full">
              <Checkbox
                checked={mohAdmin}
                onChange={() => setMohAdmin(!mohAdmin)}
              />
            </Form.Item>
          )}
          {auth.is_location_admin && (
            <>
              <Form.Item
                label="Can Check In"
                id="canCheckIn"
                className="w-full"
              >
                <Checkbox
                  checked={canCheckIn}
                  onChange={() => setCanCheckIn(!canCheckIn)}
                />
              </Form.Item>
              <Form.Item
                label="Can Update Test"
                id="canUpdateTest"
                className="w-full"
              >
                <Checkbox
                  checked={canUpdateTest}
                  onChange={() => setCanUpdateTest(!canUpdateTest)}
                />
              </Form.Item>
              <Form.Item
                label="Can Update Vaccine"
                id="canUpdateVaccine"
                className="w-full"
              >
                <Checkbox
                  checked={canUpdateVaccine}
                  onChange={() => setCanUpdateVaccine(!canUpdateVaccine)}
                />
              </Form.Item>
              <Form.Item
                label="Can Receive Batch"
                id="canReceiveBatch"
                className="w-full"
              >
                <Checkbox
                  checked={canReceiveBatch}
                  onChange={() => setCanReceiveBatch(!canReceiveBatch)}
                />
              </Form.Item>
            </>
          )}
        </div>
      </Form>
    </Modal>
  );
}

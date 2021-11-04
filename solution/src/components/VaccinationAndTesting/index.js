import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setActiveKey } from "../../store/navbarSlice";
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  DatePicker,
  SelectPicker,
  Input,
  Button,
  InputGroup,
  Icon,
} from "rsuite";
import {
  getTest,
  getVac,
  clearState,
  updateVac,
  updateTest,
} from "../../store/TestVacSlice";
import formatDate from "../../functions/formatDate";
import Typography from "@mui/material/Typography";
import { open } from "../../functions/Notifications";
import Loading from "../Loading";

export default function VaccinationAndTesting() {
  const dispatch = useDispatch();
  const history = useHistory();
  const testVac = useSelector((state) => state.testVac);
  const auth = useSelector((state) => state.auth);
  const [uuid, setUUID] = useState();
  const [date, setDate] = useState(formatDate(new Date()));
  const [manufacture, setManufacture] = useState("");
  const [vile_number, setVileNumber] = useState();
  const [admister_person, setAdministerPerson] = useState();
  const [arm, setArm] = useState("");
  const [dose_number, setDoseNumber] = useState("");
  const [result, setResult] = useState("");
  const dateFns = require("date-fns");

  const armData = [
    { label: "Left", value: "Left", role: "Master" },
    { label: "Right", value: "Right", role: "Master" },
  ];

  const resultData = [
    { label: "Positive", value: "Positive", role: "Master" },
    { label: "Negative", value: "Negative", role: "Master" },
  ];

  useEffect(() => {
    dispatch(setActiveKey("2"));
    dispatch(clearState());
    if (!auth.is_auth) {
      history.push("/account/login");
    }
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [auth.is_auth, dispatch]);

  const fetchTestVac = () => {
    dispatch(clearState());
    dispatch(getTest(uuid));
    dispatch(getVac(uuid));
  };

  const handelClick = (type) => {
    if (type === "Vaccination") {
      const data = {
        id: uuid,
        date_given: date,
        manufacture,
        vile_number,
        admister_person,
        arm,
        dose_number,
      };
      dispatch(updateVac(data));
    } else {
      const data = {
        id: uuid,
        result,
        date,
        type: testVac.Testing.type,
      };
      dispatch(updateTest(data));
    }
  };

  useEffect(() => {
    if (testVac.success) {
      dispatch(clearState());
      open("success", "Success", "Record successfully Updated!");
    }
    if (testVac.message) {
      open("error", "Error", testVac.message);
    }
    if (testVac.Vaccination) {
      setManufacture(testVac.Vaccination.manufacture);
    }
    if (testVac.dose) {
      setDoseNumber(testVac.dose);
    }
    // eslint-disable-next-line
  }, [testVac.success, testVac.message, testVac.Vaccination, testVac.dose]);

  return (
    <Container maxWidth="md" className="d-flex justify-content-center">
      <Card
        style={{
          marginBottom: "1%",
          marginTop: "5%",
          width: "85%",
        }}
      >
        <CardHeader
          style={{ backgroundColor: "#383d42", color: "#fff" }}
          title={
            <Typography variant="h5" align="center">
              Update Vaccination and Testing Record
            </Typography>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle">
                Scan or enter testing / vaccination ID provided by the patient
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <InputGroup size="lg">
                <Input onChange={(e) => setUUID(e)} />
                <InputGroup.Button onClick={fetchTestVac}>
                  <Icon icon="search" />
                </InputGroup.Button>
              </InputGroup>
            </Grid>
            {testVac.loading && testVac.returnType === null ? (
              <Loading />
            ) : null}
            {testVac.returnType !== null ? (
              <Grid item xs={12}>
                {testVac.returnType === "Testing" ? (
                  testVac.Testing ? (
                    <Form fluid onSubmit={handelClick}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <FormGroup>
                            <ControlLabel>ID</ControlLabel>
                            <FormControl value={testVac.Testing.testing_id} />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={6}>
                          <FormGroup>
                            <ControlLabel>Date</ControlLabel>
                            <DatePicker
                              defaultValue={new Date()}
                              block
                              onChange={(e) => setDate(formatDate(e))}
                              disabledDate={(date) =>
                                dateFns.isBefore(date, new Date())
                              }
                            />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={6}>
                          <FormGroup>
                            <ControlLabel>Test Type</ControlLabel>
                            <FormControl value={testVac.Testing.type} />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={6}>
                          <FormGroup>
                            <ControlLabel>Result</ControlLabel>
                            <SelectPicker
                              data={resultData}
                              block
                              onChange={(e) => setResult(e)}
                              searchable={false}
                            />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={12}>
                          {testVac.loading ? (
                            <Button block disabled>
                              Updating...
                            </Button>
                          ) : (
                            <Button
                              block
                              size="lg"
                              appearance="primary"
                              type="submit"
                            >
                              Update
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    </Form>
                  ) : null
                ) : testVac.Vaccination ? (
                  <Form fluid onSubmit={() => handelClick("Vaccination")}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <FormGroup>
                          <ControlLabel>ID</ControlLabel>
                          <FormControl
                            value={testVac.Vaccination.vaccination_id}
                          />
                        </FormGroup>
                      </Grid>
                      <Grid item xs={6}>
                        <FormGroup>
                          <ControlLabel>Date</ControlLabel>
                          <DatePicker
                            block
                            defaultValue={new Date()}
                            onChange={(e) => setDate(formatDate(e))}
                            required
                            disabledDate={(date) =>
                              dateFns.isBefore(date, new Date())
                            }
                          />
                        </FormGroup>
                      </Grid>
                      <Grid item xs={6}>
                        <FormGroup>
                          <ControlLabel>Manufacturer</ControlLabel>
                          <FormControl
                            value={testVac.Vaccination.manufacture}
                          />
                          {/* <SelectPicker
                            searchable={false}
                            defaultValue={testVac.Vaccination.manufacture}
                            data={manufactureData}
                            block
                            onChange={(e) => setManufacture(e)}
                          /> */}
                        </FormGroup>
                      </Grid>
                      <Grid item xs={6}>
                        <FormGroup>
                          <ControlLabel>Vial Number</ControlLabel>
                          <FormControl
                            onChange={(e) => setVileNumber(e)}
                            required
                          />
                        </FormGroup>
                      </Grid>
                      <Grid item xs={6}>
                        <FormGroup>
                          <ControlLabel>Administering Person</ControlLabel>
                          <FormControl
                            onChange={(e) => setAdministerPerson(e)}
                            required
                          />
                        </FormGroup>
                      </Grid>
                      <Grid item xs={6}>
                        <FormGroup>
                          <ControlLabel>Arm</ControlLabel>
                          <SelectPicker
                            searchable={false}
                            data={armData}
                            block
                            onChange={(e) => setArm(e)}
                            required
                          />
                        </FormGroup>
                      </Grid>
                      <Grid item xs={6}>
                        <FormGroup>
                          <ControlLabel>Dose</ControlLabel>
                          <FormControl value={testVac.dose} />
                          {/* <SelectPicker
                            searchable={false}
                            data={doseData}
                            block
                            onChange={(e) => setDoseNumber(e)}
                          /> */}
                        </FormGroup>
                      </Grid>
                      <Grid item xs={12}>
                        {testVac.loading ? (
                          <Button block size="lg" appearance="primary" disabled>
                            Updating...
                          </Button>
                        ) : (
                          <Button
                            block
                            size="lg"
                            appearance="primary"
                            type="submit"
                          >
                            Update
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Form>
                ) : null}
              </Grid>
            ) : testVac.unauthorized ? (
              <Grid item xs={12}>
                <Typography variant="h6" align="center">
                  Record does not exist or you are not unauthorized to make
                  changes to this record.
                </Typography>
              </Grid>
            ) : null}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

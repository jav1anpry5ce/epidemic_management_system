import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
import {
  clearState,
  getPositiveCases,
  getCase,
  updateCase,
  updateSuccess,
} from "../../store/mohSlice";
import { useHistory } from "react-router-dom";
import { setActiveKey } from "../../store/navbarSlice";
import {
  FormGroup,
  ControlLabel,
  Loader,
  Icon,
  IconButton,
  Table,
  Input,
  Modal,
  SelectPicker,
  Button,
} from "rsuite";
import toLocaldate from "../../functions/toLocalDate";
import { open } from "../../functions/Notifications";
const { Column, HeaderCell, Cell, Pagination } = Table;

const recoveringLocationData = [
  { label: "Home", value: "Home" },
  { label: "Hospitalized", value: "Hospitalized" },
];

const recoveringData = [
  { label: "Recovering", value: "Recovering" },
  { label: "Hospitalized", value: "Hospitalized" },
  { label: "Recovered", value: "Recovered" },
  { label: "Dead", value: "Dead" },
];

function calculate_age(dob) {
  var diff_ms = Date.now() - dob.getTime();
  var age_dt = new Date(diff_ms);

  return Math.abs(age_dt.getUTCFullYear() - 1970);
}

export default function PositiveCases() {
  const data = useSelector((state) => state.moh);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [caseId, setCaseId] = useState("");

  useEffect(() => {
    if (!auth.is_auth && !auth.is_moh_staff) {
      history.push("/account/login");
    }
  }, [auth.is_moh_staff, auth.is_auth, history]);

  useEffect(() => {
    dispatch(setActiveKey("3"));
    dispatch(getPositiveCases());
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (data.success) {
      dispatch(updateSuccess());
      onHide();
    }
    if (data.message) {
      open("error", "Error", data.message);
    }
    if (data.caseData) {
      setStatus(data.caseData.case.status);
      setLocation(data.caseData.case.recovering_location);
    }
    // eslint-disable-next-line
  }, [data.success, data.message, data.caseData]);

  const ActionCell = ({ rowData, dataKey, ...props }) => {
    function handleAction() {
      const case_id = rowData[dataKey];
      setCaseId(case_id);
      dispatch(getCase(case_id));
      setShow(true);
      //   dispatch(getAppointment(data));
    }
    return (
      <Cell {...props}>
        <IconButton
          appearance="subtle"
          onClick={handleAction}
          icon={<Icon icon="eye" />}
        />
      </Cell>
    );
  };

  const onHide = () => {
    setShow(false);
    dispatch(clearState());
    dispatch(getPositiveCases());
  };

  const onSubmit = () => {
    const data = {
      case_id: caseId,
      recovering_location: location,
      status,
    };
    if (location && status) {
      dispatch(updateCase(data));
    }
  };

  return (
    <Container maxWidth="lg">
      <Modal
        show={show}
        onHide={onHide}
        overflow={true}
        style={{ height: "150vh" }}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title align="center">Case Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {data.caseData ? (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h6">Personal Information</Typography>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>First Name</ControlLabel>
                  <Input value={data.caseData.case.patient.first_name} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Last Name</ControlLabel>
                  <Input value={data.caseData.case.patient.last_name} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Gender</ControlLabel>
                  <Input value={data.caseData.case.patient.gender} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Date of Birth</ControlLabel>
                  <Input value={data.caseData.case.patient.date_of_birth} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Email</ControlLabel>
                  <Input value={data.caseData.case.patient.email} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Phone Number</ControlLabel>
                  <Input value={data.caseData.case.patient.phone} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Street Address</ControlLabel>
                  <Input value={data.caseData.case.patient.street_address} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>City</ControlLabel>
                  <Input value={data.caseData.case.patient.city} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Parish</ControlLabel>
                  <Input value={data.caseData.case.patient.parish} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Country</ControlLabel>
                  <Input value={data.caseData.case.patient.country} />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Next of Kin Information</Typography>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>First Name</ControlLabel>
                  <Input value={data.caseData.next_of_kin.kin_first_name} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Last Name</ControlLabel>
                  <Input value={data.caseData.next_of_kin.kin_last_name} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Email</ControlLabel>
                  <Input value={data.caseData.next_of_kin.kin_email} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Phone</ControlLabel>
                  <Input value={data.caseData.next_of_kin.kin_phone} />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Case Information</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <ControlLabel>Date Tested</ControlLabel>
                  <Input value={toLocaldate(data.caseData.case.date_tested)} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Recovering Location</ControlLabel>
                  <SelectPicker
                    block
                    searchable={false}
                    data={recoveringLocationData}
                    defaultValue={data.caseData.case.recovering_location}
                    onChange={(e) => setLocation(e)}
                  />
                  {/* <Input value={data.caseData.case.recovering_location} /> */}
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Status</ControlLabel>
                  <SelectPicker
                    block
                    searchable={false}
                    data={recoveringData}
                    defaultValue={data.caseData.case.status}
                    onChange={(e) => setStatus(e)}
                  />
                  {/* <Input value={data.caseData.case.status} /> */}
                </FormGroup>
              </Grid>
            </Grid>
          ) : data.caseLoading ? (
            <div style={{ textAlign: "center" }}>
              <Loader size="md" />
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={onSubmit} disabled={data.updating}>
            Submit
          </Button>
          <Button onClick={onHide} disabled={data.updating}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Card>
        <CardHeader
          style={{ backgroundColor: "#383d42" }}
          title={
            <Typography variant="h5" align="center" style={{ color: "#ffff" }}>
              Positive Cases
            </Typography>
          }
        />
        <CardContent>
          <Table
            height={570}
            data={data.positiveCases ? data.positiveCases : []}
            loading={data.loading}
          >
            <Column flexGrow>
              <HeaderCell>First Name</HeaderCell>
              <Cell>{(rowData) => rowData.patient.first_name}</Cell>
            </Column>
            <Column flexGrow>
              <HeaderCell>Last Name</HeaderCell>
              <Cell>{(rowData) => rowData.patient.last_name}</Cell>
            </Column>
            <Column flexGrow>
              <HeaderCell>Gender</HeaderCell>
              <Cell>{(rowData) => rowData.patient.gender}</Cell>
            </Column>
            <Column flexGrow>
              <HeaderCell>Age</HeaderCell>
              <Cell>
                {(rowData) =>
                  calculate_age(new Date(rowData.patient.date_of_birth))
                }
              </Cell>
            </Column>
            <Column flexGrow>
              <HeaderCell>Recovering Location</HeaderCell>
              <Cell dataKey={"recovering_location"} />
            </Column>
            <Column flexGrow>
              <HeaderCell>Status</HeaderCell>
              <Cell dataKey={"status"} />
            </Column>
            <Column flexGrow>
              <HeaderCell>Action</HeaderCell>
              <ActionCell dataKey={"case_id"} />
            </Column>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
}

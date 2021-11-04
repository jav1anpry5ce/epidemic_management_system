import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
// eslint-disable-next-line
import { useHistory } from "react-router-dom";
import { open } from "../../functions/Notifications";
import toLocaldate from "../../functions/toLocalDate";
import { setActiveKey } from "../../store/navbarSlice";
import {
  getAppointments,
  getAppointment,
  checkIn,
  clearState,
} from "../../store/locationSlice";
import {
  Button,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Loader,
  Icon,
  IconButton,
  Table,
  Modal,
  Input,
  InputPicker,
} from "rsuite";
// eslint-disable-next-line
const { Column, HeaderCell, Cell, Pagination } = Table;

export default function LocationAppointments() {
  const appointments = useSelector((state) => state.location);
  const auth = useSelector((state) => state.auth);
  const history = useHistory();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [displayLength, setDisplayLength] = useState(10);
  const [loading, setLoading] = useState();
  const [filterData, setFilterData] = useState("Pending");
  const fdata = [
    { label: "All", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Checked In", value: "Checked In" },
    { label: "Completed", value: "Completed" },
  ];
  useEffect(() => {
    dispatch(setActiveKey("3"));
    dispatch(clearState());
    if (!auth.is_auth) {
      history.push("/account/login");
    }
  }, [auth.is_auth, dispatch, history]);
  useEffect(() => {
    setLoading(appointments.loading);
  }, [appointments.loading]);
  const handleClose = () => {
    const data = {
      q: filterData,
    };
    dispatch(clearState());
    dispatch(getAppointments(data));
  };
  useEffect(() => {
    const data = {
      q: filterData,
    };
    dispatch(getAppointments(data));
    // eslint-disable-next-line
  }, []);
  const handelSelect = (e) => {
    const data = {
      q: e,
    };
    dispatch(getAppointments(data));
  };
  const ActionCell = ({ rowData, dataKey, ...props }) => {
    function handleAction() {
      const data = {
        id: rowData[dataKey],
      };
      setShow(true);
      dispatch(getAppointment(data));
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
  const getData = () => {
    var data = appointments.appointments;
    if (sortColumn && sortType) {
      data = appointments.appointments.slice().sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (typeof x === "string") {
          x = x.charCodeAt();
        }
        if (typeof y === "string") {
          y = y.charCodeAt();
        }
        if (sortType === "asc") {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
    return data.filter((v, i) => {
      const start = displayLength * (page - 1);
      const end = start + displayLength;
      return i >= start && i < end;
    });
  };
  const filteredData = () => {
    var data = appointments.appointments;
    data = data.filter((appointment) => {
      return (
        appointment.patient.last_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        appointment.patient.first_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        appointment.id.includes(search) ||
        appointment.type.toLowerCase().includes(search.toLowerCase())
      );
    });
    return data;
  };
  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true);
    setTimeout(() => {
      setSortColumn(sortColumn);
      setSortType(sortType);
      setLoading(false);
    }, 500);
  };
  const handlePagechange = (dataKey) => {
    setPage(dataKey);
  };
  const handleLengthChange = (dataKey) => {
    setPage(1);
    setDisplayLength(dataKey);
  };
  const handleCheckIn = () => {
    const data = {
      id: appointments.appointment.id,
    };
    dispatch(checkIn(data));
  };
  useEffect(() => {
    if (appointments.success) {
      setShow(false);
      open("success", "Success", "Patienet was successful Checked In");
    }
    if (appointments.error) {
      open("error", "Someting went wrong", appointments.message);
    }
  }, [appointments.success, appointments.error, appointments.message]);
  return (
    <Container maxWidth="lg">
      <Modal
        backdrop
        overflow={false}
        size="md"
        show={show}
        onExiting={handleClose}
        onHide={() => setShow(false)}
      >
        <Modal.Header>
          <Modal.Title>Appointment Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {appointments.appointment ? (
            <Form fluid>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <FormGroup>
                    <ControlLabel>Appointment ID</ControlLabel>
                    <FormControl value={appointments.appointment.id} />
                  </FormGroup>
                </Grid>
                <Grid item xs={6}>
                  <FormGroup>
                    <ControlLabel>First Name</ControlLabel>
                    <FormControl
                      value={appointments.appointment.patient.first_name}
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={6}>
                  <FormGroup>
                    <ControlLabel>Last Name</ControlLabel>
                    <FormControl
                      value={appointments.appointment.patient.last_name}
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={6}>
                  <FormGroup>
                    <ControlLabel>Date of Birth</ControlLabel>
                    <FormControl
                      value={appointments.appointment.patient.date_of_birth}
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={6}>
                  <FormGroup>
                    <ControlLabel>Date</ControlLabel>
                    <FormControl
                      value={toLocaldate(appointments.appointment.date)}
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={6}>
                  <FormGroup>
                    <ControlLabel>Time</ControlLabel>
                    <FormControl
                      value={new Date(
                        "1990-01-01 " + appointments.appointment.time
                      )
                        .toLocaleTimeString()
                        .replace(/:\d+ /, " ")}
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={6}>
                  <FormGroup>
                    <ControlLabel>Appointment Type</ControlLabel>
                    <FormControl value={appointments.appointment.type} />
                  </FormGroup>
                </Grid>
              </Grid>
            </Form>
          ) : (
            <div style={{ textAlign: "center" }}>
              <Loader size="md" />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={appointments.aLoading}
            onClick={handleCheckIn}
            appearance="primary"
          >
            Check Patient In
          </Button>
          <Button onClick={() => setShow(false)} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Card style={{ marginBottom: "2%", marginTop: "2%" }}>
        <CardHeader
          style={{ backgroundColor: "#383d42" }}
          title={
            <Typography variant="h5" align="center" style={{ color: "#ffff" }}>
              Appointments
            </Typography>
          }
        />
        <CardContent>
          <Grid container justifyContent="space-between" spacing={2}>
            <Grid item xs={2}>
              <InputPicker
                block
                size="sm"
                data={fdata}
                defaultValue={filterData}
                onChange={(e) => setFilterData(e)}
                onSelect={(e) => handelSelect(e)}
              />
            </Grid>
            <Grid item xs={4}>
              <Input
                size="sm"
                virtualized
                placeholder="Search appointments"
                onChange={(e) => setSearch(e)}
              />
            </Grid>
          </Grid>
          <Table
            virtualized
            hover
            loading={loading}
            height={500}
            data={
              appointments.appointments
                ? search
                  ? filteredData()
                  : getData()
                : []
            }
            sortColumn={sortColumn}
            sortType={sortType}
            onSortColumn={handleSortColumn}
          >
            <Column align="center" width={300} sortable>
              <HeaderCell>ID</HeaderCell>
              <Cell dataKey={"id"} />
            </Column>
            <Column align="center">
              <HeaderCell>First Name</HeaderCell>
              <Cell>{(rowData) => rowData.patient.first_name}</Cell>
            </Column>
            <Column align="center" sortable>
              <HeaderCell>Last Name</HeaderCell>
              <Cell>{(rowData) => rowData.patient.last_name}</Cell>
            </Column>
            <Column align="center" width={150}>
              <HeaderCell>Date</HeaderCell>
              <Cell>{(rowData) => toLocaldate(rowData.date)}</Cell>
            </Column>
            <Column align="center">
              <HeaderCell>Time</HeaderCell>
              <Cell>
                {(rowData) =>
                  new Date("1990-01-01 " + rowData.time)
                    .toLocaleTimeString()
                    .replace(/:\d+ /, " ")
                }
              </Cell>
            </Column>
            <Column align="center" width={150} sortable>
              <HeaderCell>Type of Appointment</HeaderCell>
              <Cell dataKey="type" />
            </Column>
            <Column align="center">
              <HeaderCell>Status</HeaderCell>
              <Cell dataKey="status" />
            </Column>
            <Column align="center">
              <HeaderCell>Action</HeaderCell>
              <ActionCell dataKey={"id"} />
            </Column>
          </Table>
          <Pagination
            lengthMenu={[
              {
                value: 10,
                label: 10,
              },
              {
                value: 20,
                label: 20,
              },
            ]}
            activePage={page}
            displayLength={displayLength}
            total={
              appointments.appointments
                ? search
                  ? filteredData().length
                  : appointments.appointments.length
                : null
            }
            onChangePage={handlePagechange}
            onChangeLength={handleLengthChange}
          />
        </CardContent>
      </Card>
    </Container>
  );
}

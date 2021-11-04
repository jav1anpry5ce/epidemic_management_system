import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
import { getAllPatients, getPatient, clearPatient } from "../../store/mohSlice";
import { useHistory } from "react-router-dom";
import CollapseCard from "../CollapseCard";
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
} from "rsuite";
const { Column, HeaderCell, Cell, Pagination } = Table;

export default function Patients() {
  const data = useSelector((state) => state.moh);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState("asc");
  const [page, setPage] = useState(1);
  const [displayLength, setDisplayLength] = useState(10);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState();
  const [show, setShow] = useState(false);
  const [vaccinedExpaned, setVaccinedExpanded] = useState(false);
  const [testingExpaned, setTestingExpanded] = useState(false);

  useEffect(() => {
    if (!auth.is_auth && !auth.is_moh_staff) {
      history.push("/account/login");
    }
  }, [auth.is_moh_staff, auth.is_auth, history]);

  useEffect(() => {
    dispatch(setActiveKey("2"));
    dispatch(getAllPatients());
  }, [dispatch]);

  useEffect(() => {
    setLoading(data.loading);
  }, [data.loading]);

  const ActionCell = ({ rowData, dataKey, ...props }) => {
    function handleAction() {
      const data = {
        tax_number: rowData[dataKey],
      };
      dispatch(getPatient(data));
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

  const getData = () => {
    var patients = data.patients;
    if (sortColumn && sortType) {
      patients = data.patients.slice().sort((a, b) => {
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
    return patients.filter((v, i) => {
      const start = displayLength * (page - 1);
      const end = start + displayLength;
      return i >= start && i < end;
    });
  };

  const filteredData = () => {
    var patients = data.patients;
    patients = patients.filter((patient) => {
      return (
        patient.last_name.toLowerCase().includes(search.toLowerCase()) ||
        patient.tax_number.includes(search)
      );
    });
    return patients;
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

  const handelHide = () => {
    dispatch(clearPatient());
    setShow(false);
  };

  const expandVaccine = () => {
    if (vaccinedExpaned) {
      setVaccinedExpanded(false);
    } else {
      setVaccinedExpanded(true);
    }
  };

  const expandTesting = () => {
    if (testingExpaned) {
      setTestingExpanded(false);
    } else {
      setTestingExpanded(true);
    }
  };

  return (
    <Container maxWidth="lg">
      <Modal
        size="md"
        overflow={false}
        show={show}
        onHide={handelHide}
        backdrop
      >
        <Modal.Header>
          <Modal.Title>
            Information for
            {data.patient
              ? " " + data.patient.first_name + " " + data.patient.last_name
              : null}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {data.patient ? (
            <Grid container spacing={1}>
              <Grid container item justifyContent="center">
                <Avatar
                  alt={data.patient.first_name + " " + data.patient.last_name}
                  src={data.patient.image_url}
                  sx={{ width: 165, height: 165 }}
                  loading="lazy"
                />
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>First Name</ControlLabel>
                  <Input value={data.patient.first_name} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Last Name</ControlLabel>
                  <Input value={data.patient.last_name} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Gender</ControlLabel>
                  <Input value={data.patient.gender} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Date of Birth</ControlLabel>
                  <Input value={data.patient.date_of_birth} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Email</ControlLabel>
                  <Input value={data.patient.email} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Phone</ControlLabel>
                  <Input value={data.patient.phone} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Street Address</ControlLabel>
                  <Input value={data.patient.street_address} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>City</ControlLabel>
                  <Input value={data.patient.city} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Parish</ControlLabel>
                  <Input value={data.patient.parish} />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <ControlLabel>Country</ControlLabel>
                  <Input value={data.patient.country} />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <CollapseCard
                  Title="Testing Record"
                  expand={testingExpaned}
                  setExpand={expandTesting}
                  Data={data.test}
                />
              </Grid>
              <Grid item xs={12}>
                <CollapseCard
                  Title="Vaccination Record"
                  expand={vaccinedExpaned}
                  setExpand={expandVaccine}
                  Data={data.vaccine}
                />
              </Grid>
            </Grid>
          ) : (
            <div style={{ textAlign: "center" }}>
              <Loader size="md" />
            </div>
          )}
        </Modal.Body>
      </Modal>
      <Card style={{ marginBottom: "1%" }}>
        <CardHeader
          style={{ backgroundColor: "#383d42" }}
          title={
            <Typography variant="h5" align="center" style={{ color: "#ffff" }}>
              Patients
            </Typography>
          }
        />
        <CardContent>
          <Grid container justifyContent="flex-end" spacing={2}>
            <Grid item xs={4}>
              <Input
                size="sm"
                placeholder="Search patient by TRN or last name"
                onChange={(e) => setSearch(e)}
              />
            </Grid>
          </Grid>
          <Table
            height={570}
            loading={loading}
            data={data.patients ? (search ? filteredData() : getData()) : []}
            sortColumn={sortColumn}
            sortType={sortType}
            onSortColumn={handleSortColumn}
          >
            <Column flexGrow sortable>
              <HeaderCell>TRN</HeaderCell>
              <Cell dataKey={"tax_number"} />
            </Column>
            <Column flexGrow>
              <HeaderCell>First Name</HeaderCell>
              <Cell dataKey={"first_name"} />
            </Column>
            <Column flexGrow sortable>
              <HeaderCell>Last Name</HeaderCell>
              <Cell dataKey={"last_name"} />
            </Column>
            <Column flexGrow>
              <HeaderCell>DOB</HeaderCell>
              <Cell dataKey={"date_of_birth"} />
            </Column>
            <Column flexGrow sortable>
              <HeaderCell>Gender</HeaderCell>
              <Cell dataKey={"gender"} />
            </Column>
            <Column flexGrow>
              <HeaderCell>Email</HeaderCell>
              <Cell dataKey={"email"} />
            </Column>
            <Column flexGrow>
              <HeaderCell>Phone</HeaderCell>
              <Cell dataKey={"phone"} />
            </Column>
            <Column flexGrow>
              <HeaderCell>Action</HeaderCell>
              <ActionCell dataKey={"tax_number"} />
            </Column>
          </Table>
          <Pagination
            style={{ height: 10 }}
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
              data.patients
                ? search
                  ? filteredData().length
                  : data.patients.length
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

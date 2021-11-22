import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  info,
  vaccineInfo,
  testingInfo,
  clearState,
} from "../../store/patientSlice";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { setActiveKey } from "../../store/navbarSlice";
import PatientCard from "../PatientCard";
import Loading from "../Loading";
import CollapseCard from "../CollapseCard";

function PatientInfo({ match }) {
  const dispatch = useDispatch();
  const patient = useSelector((state) => state.patient);
  const [vaccinedExpaned, setVaccinedExpanded] = useState(false);
  const [testingExpaned, setTestingExpanded] = useState(false);
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
  useEffect(() => {
    dispatch(setActiveKey(""));
    dispatch(clearState());
    const id = match.params.uuid;
    dispatch(info(id));
    dispatch(vaccineInfo(id));
    dispatch(testingInfo(id));
  }, [dispatch, match]);
  if (patient.loading) {
    return <Loading />;
  } else if (!patient.info && !patient.loading) {
    return (
      <Typography
        variant="h5"
        align="center"
        component="h5"
        style={{ marginTop: "15%" }}
      >
        Patient Dose not exist in our records!
      </Typography>
    );
  } else {
    return (
      <Container style={{ marginTop: "2%" }}>
        {patient.info && patient.vaccineRecord && patient.testingRecord ? (
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <PatientCard
                raised
                image={patient.info.image_url}
                first_name={patient.info.first_name}
                last_name={patient.info.last_name}
                date_of_birth={patient.info.date_of_birth}
                gender={patient.info.gender}
                city={patient.info.city}
                country={patient.info.country}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CollapseCard
                Title="Testing Record"
                expand={testingExpaned}
                setExpand={expandTesting}
                Data={patient.testingRecord}
              />
              <CollapseCard
                Title="Vaccination Record"
                expand={vaccinedExpaned}
                setExpand={expandVaccine}
                Data={patient.vaccineRecord}
              />
            </Grid>
          </Grid>
        ) : null}
      </Container>
    );
  }
}

export default PatientInfo;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  info,
  vaccineInfo,
  testingInfo,
  clearState,
} from "../store/patientSlice";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { setActiveKey } from "../store/navbarSlice";
import PatientCard from "./PatientCard";
import Loading from "./Loading";
import CollapseCard from "./CollapseCard";
import { Typography } from "antd";
import { useParams } from "react-router-dom";

const { Title } = Typography;

function PatientInfo() {
  const dispatch = useDispatch();
  const patient = useSelector((state) => state.patient);
  const [vaccinedExpaned, setVaccinedExpanded] = useState(false);
  const [testingExpaned, setTestingExpanded] = useState(false);

  const { uuid } = useParams();

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
    const id = uuid;
    dispatch(info(id));
    dispatch(vaccineInfo(id));
    dispatch(testingInfo(id));
  }, [dispatch, uuid]);
  if (
    patient.loading ||
    !patient.info ||
    !patient.vaccineRecord ||
    !patient.testingRecord
  ) {
    return <Loading />;
  } else if (!patient.info && !patient.loading) {
    return (
      <Title
        level={2}
        className="flex justify-center justify-items-center self-center text-white"
        style={{ marginTop: "17%", color: "white" }}
      >
        Patient dose not exist in our records!
      </Title>
    );
  } else {
    return (
      <Container style={{ marginTop: "2%", marginBottom: "4%" }}>
        {patient.info && patient.vaccineRecord && patient.testingRecord && (
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
        )}
      </Container>
    );
  }
}

export default PatientInfo;

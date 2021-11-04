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
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import { useReactToPrint } from "react-to-print";
import { setActiveKey } from "../../store/navbarSlice";
import {
  Button,
  Form,
  FormGroup,
  ControlLabel,
  InputPicker,
  InputNumber,
} from "rsuite";
import Loading from "../Loading";
import PrintView from "./PrintView";
import { open } from "../../functions/Notifications";

export default function CreateBatch() {
  const data = useSelector((state) => state.moh);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [location, setLocation] = useState("");
  const [vaccine, setVaccine] = useState("");
  const [dose, setDose] = useState("");
  const componenetRef = useRef();

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
      setLocation("");
      setVaccine("");
      setDose("");
    }
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
    size: 80mm 50mm;
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
      <Container maxWidth="sm">
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
                <Grid
                  item
                  xs={12}
                  className="d-flex justify-content-between mb-3"
                >
                  <Button onClick={handlePrint}>Print</Button>
                  <Button onClick={() => dispatch(updateSuccess())}>
                    Create new batch
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </Paper>
        ) : (
          <Card>
            <CardHeader
              style={{ backgroundColor: "#383d42" }}
              title={
                <Typography
                  variant="h5"
                  align="center"
                  style={{ color: "#ffff" }}
                >
                  Create a new location Batch
                </Typography>
              }
            />
            <CardContent>
              <Form onSubmit={handelSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormGroup>
                      <ControlLabel>Location</ControlLabel>
                      <InputPicker
                        block
                        data={data.batchInfo.locations}
                        onChange={(e) => setLocation(e)}
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12}>
                    <FormGroup>
                      <ControlLabel>Vaccine</ControlLabel>
                      <InputPicker
                        block
                        data={data.batchInfo.vaccines}
                        onChange={(e) => setVaccine(e)}
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12}>
                    <FormGroup>
                      <ControlLabel>Number of Dose</ControlLabel>
                      <InputNumber
                        min={10}
                        step={10}
                        style={{ width: "100%" }}
                        onChange={(e) => setDose(e)}
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2} justifyContent="space-between">
                      <Grid item>
                        {data.loading ? (
                          <Button disabled color="primary">
                            Submiting
                          </Button>
                        ) : (
                          <Button type="submit" color="primary">
                            Submit
                          </Button>
                        )}
                      </Grid>
                      <Grid item>
                        <Button
                          onClick={() => history.push("/moh/batch-management")}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Form>
            </CardContent>
          </Card>
        )}
      </Container>
    );
  } else {
    return <Loading />;
  }
}

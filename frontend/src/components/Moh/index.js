import React, { useEffect } from "react";
import { getBreakdown, clearState } from "../../store/mohSlice";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Container, CardContent, Grid, Typography } from "@mui/material";
import { setActiveKey } from "../../store/navbarSlice";
import { Card } from "./MohElements";
import Loading from "../Loading";

export default function MOHHOME() {
  const data = useSelector((state) => state.moh);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(getBreakdown());
    dispatch(setActiveKey("1"));
    if (!auth.is_moh_staff) {
      history.push("/account/login");
    }
    return () => dispatch(clearState());
  }, [auth.is_moh_staff, dispatch, history]);

  if (data.breakdownData) {
    const cardData = [
      {
        name: "Pfizer To Distribute",
        data: data.breakdownData.pfizer_to_disb,
        backgroundcolour: "#4f8598",
      },
      {
        name: "Moderna To Distribute",
        data: data.breakdownData.moderna_to_disb,
        backgroundcolour: "#10496d",
      },
      {
        name: "Johnson&Johnson To Distribute",
        data: data.breakdownData.JJ_to_disb,
        backgroundcolour: "#437ab2",
      },
      {
        name: "Pfizer In Stock",
        data: data.breakdownData.pfizer_in_stock,
        backgroundcolour: "#225955",
      },
      {
        name: "Moderna In Stock",
        data: data.breakdownData.moderna_in_stock,
        backgroundcolour: "#437ab2",
      },
      {
        name: "Johnson&Johnson In Stock",
        data: data.breakdownData.JJ_in_stock,
        backgroundcolour: "#4f8598",
      },
      {
        name: "Positive Cases",
        data: data.breakdownData.positive_cases,
        backgroundcolour: "#10496d",
      },
      {
        name: "Hospitalized",
        data: data.breakdownData.hospitalized,
        backgroundcolour: "#437ab2",
      },
      {
        name: "Recovered",
        data: data.breakdownData.recovered,
        backgroundcolour: "#4f8598",
      },
      {
        name: "Tests Administer",
        data: data.breakdownData.test_count,
        backgroundcolour: "#437ab2",
      },
      {
        name: "Vaccines Administer",
        data: data.breakdownData.vaccines_administer,
        backgroundcolour: "#225955",
      },
    ];
    return (
      <Container maxWidth="xl" align="center">
        <Grid
          container
          spacing={3}
          style={{ marginTop: "6%", justifyContent: "center" }}
        >
          {cardData.map((data, index) => (
            <Grid item sm={6} md={4} lg={3} key={index}>
              <Card backgroundcolour={data.backgroundcolour} color="white">
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography
                        variant="h5"
                        align="center"
                        style={{ color: "white" }}
                      >
                        {data.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="h5"
                        align="center"
                        style={{ color: "white" }}
                      >
                        {data.data}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  } else {
    return <Loading />;
  }
}

import React, { useEffect } from "react";
import { locationBreakdown, clearState } from "../../store/locationSlice";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Container, CardContent, Grid } from "@mui/material";
import { setActiveKey } from "../../store/navbarSlice";
import { Card } from "../Moh/MohElements";
import Loading from "../Loading";
import { Typography } from "antd";

const { Title } = Typography;

export default function LocationHome() {
  const data = useSelector((state) => state.location);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (!auth.is_auth) {
      history.push("/account/login");
    }
    dispatch(locationBreakdown());
    dispatch(setActiveKey("1"));
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [auth.is_auth]);

  if (data.locationData) {
    const cardData = [
      data.locationData.pfizer_in_stock !== null && {
        name: "Pfizer In Stock",
        data: data.locationData.pfizer_in_stock,
        backgroundcolour: "#225955",
        visible: data.locationData.pfizer_in_stock !== null ? true : false,
      },
      data.locationData.moderna_in_stock !== null && {
        name: "Moderna In Stock",
        data: data.locationData.moderna_in_stock,
        backgroundcolour: "#437ab2",
        visible: data.locationData.moderna_in_stock !== null ? true : false,
      },
      data.locationData.jj_in_stock !== null && {
        name: "Johnson&Johnson In Stock",
        data: data.locationData.jj_in_stock,
        backgroundcolour: "#4f8598",
        visible: data.locationData.jj_in_stock !== null ? true : false,
      },
      {
        name: "Pending Appointments",
        data: data.locationData.pending_appointments,
        backgroundcolour: "#4f8598",
        visible: true,
      },
      {
        name: "Testing Administer",
        data: data.locationData.number_of_tests,
        backgroundcolour: "#437ab2",
        visible: true,
      },
      data.locationData.vaccines_administer !== null && {
        name: "Vaccines Administer",
        data: data.locationData.vaccines_administer,
        backgroundcolour: "#225955",
        visible: data.locationData.vaccines_administer !== null ? true : false,
      },
    ];
    return (
      <Container maxWidth="xl" align="center">
        <Grid
          container
          spacing={6}
          style={{
            marginTop: "6%",
            marginBottom: "3%",
            justifyContent: "center",
          }}
        >
          {cardData.map(
            (data, index) =>
              data.visible && (
                <Grid item sm={6} md={6} lg={4} key={index}>
                  <Card backgroundcolour={data.backgroundcolour} color="white">
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Title
                            level={3}
                            align="center"
                            style={{ color: "#fff" }}
                          >
                            {data.name}
                          </Title>
                        </Grid>
                        <Grid item xs={12}>
                          <Title level={4} style={{ color: "#fff" }}>
                            {data.data}
                          </Title>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )
          )}
        </Grid>
      </Container>
    );
  }
  if (data.loading) return <Loading />;
  if (!data.loading && !data.locationData)
    return (
      <div
        style={{ minHeight: "83.5vh" }}
        className="flex justify-center items-center"
      >
        <h1 className="text-3xl font-semibold text-white">
          Something went wrong!
        </h1>
      </div>
    );
}

import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import logo from "../../images/logo.png";

export default function PrintView({ componenetRef, data }) {
  return (
    <Container
      maxWidth="sm"
      style={{
        display: "flex",
        alignItems: "center",
      }}
      ref={componenetRef}
    >
      {data && (
        <Grid
          container
          style={{
            marginBottom: 13,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
          className="my-4"
        >
          <Grid item xs={12} align="center">
            <img src={logo} alt="logo" width={125} className="rounded-full" />
          </Grid>
          <Grid item xs={8}>
            <div className="space-y-3">
              <h3 className="text-sm">Location Name: {data.location_name}</h3>
              <h3 className="text-sm">Street Address: {data.street_address}</h3>
              <h3 className="text-sm">City: {data.city}</h3>
              <h3 className="text-sm">Parish: {data.parish}</h3>
              <h3 className="text-sm">
                Date Created:{" "}
                {new Date(data.date_created).toLocaleString("en-us")}
              </h3>
            </div>
          </Grid>
          <Grid item xs={4} align="right">
            <img width="145" src={data.qr_image} alt="qr" />
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

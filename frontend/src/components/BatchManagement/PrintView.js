import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

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
      {data ? (
        <Grid
          container
          spacing={4}
          style={{
            marginBottom: "2%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid item xs={6}>
            <Stack spacing={1} style={{ marginTop: "2%" }}>
              <Typography variant="inhert">
                Location Name: {data.location_name}
              </Typography>
              <Typography variant="inhert">
                Street Address: {data.street_address}
              </Typography>
              <Typography variant="inhert">City: {data.city}</Typography>
              <Typography variant="inhert">Parish: {data.parish}</Typography>
              <Typography variant="inhert">
                Date Created:{" "}
                {new Date(data.date_created).toLocaleString("en-us")}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6} align="right">
            <img width="145" src={data.qr_image} alt="qr" />
          </Grid>
        </Grid>
      ) : null}
    </Container>
  );
}

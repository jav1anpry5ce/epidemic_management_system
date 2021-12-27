import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

export default function PatientCard({
  image,
  first_name,
  last_name,
  date_of_birth,
  gender,
  city,
  country,
  raised,
}) {
  return (
    <Card raised={raised}>
      <CardHeader
        className="bg-gray-700"
        title={
          <Typography className="text-white" align="center" variant="h6">
            Patient Information
          </Typography>
        }
      />
      <div className="flex items-center justify-items-center justify-center">
        <img
          src={image}
          alt="patient"
          width={180}
          className="xs:hidden sm:block aspect-auto rounded-r"
        />

        <CardContent>
          <Grid container spacing={2}>
            <Grid item sm={6} xs={12}>
              <Typography variant="body2">First Name: {first_name}</Typography>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Typography variant="body2">Last Name: {last_name}</Typography>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Typography variant="body2">
                Date of Birth: {date_of_birth}
              </Typography>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Typography variant="body2">Gender: {gender}</Typography>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Typography variant="body2">City: {city}</Typography>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Typography variant="body2">Country: {country}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </div>
    </Card>
  );
}

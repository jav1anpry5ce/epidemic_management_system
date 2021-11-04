import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { makeStyles } from "@mui/styles";

const useStyle = makeStyles(() => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  profile: {
    width: 285,
    height: 155,
  },
  text: {
    color: "white",
  },
  background: {
    backgroundColor: "#383d42",
  },
}));

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
  const classes = useStyle();
  const [height, setHeight] = useState(150);
  useEffect(() => {
    window.addEventListener("resize", resize);
    resize();
    // eslint-disable-next-line
  }, [window]);

  const resize = () => {
    if (window.innerHeight > 960) {
      setHeight(150);
    }
    if (window.innerWidth <= 760) {
      setHeight(200);
    }
    if (window.innerWidth <= 560) {
      setHeight(250);
    } else {
      setHeight(150);
    }
  };

  return (
    <Card raised={raised}>
      <CardHeader
        className={classes.background}
        title={
          <Typography className={classes.text} align="center" variant="h6">
            Patient Information
          </Typography>
        }
      />
      <div className={classes.root}>
        <Avatar
          variant="square"
          src={image}
          sx={{ width: 135, height: height }}
          loading="lazy"
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="body2">First Name: {first_name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Last Name: {last_name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                Date of Birth: {date_of_birth}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Gender: {gender}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">City: {city}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Country: {country}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </div>
    </Card>
  );
}

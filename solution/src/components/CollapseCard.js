import React from "react";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import clsx from "clsx";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import toLocalDate from "../functions/toLocalDate";

const useStyle = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  text: {
    color: "white",
  },
  background: {
    backgroundColor: "#383d42",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    // transition: theme.transitions.create("transform", {
    //   duration: theme.transitions.duration.shortest,
    // }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

export default function CollapseCard({ Title, Data, expand, setExpand }) {
  const classes = useStyle();
  return (
    <Card style={{ marginBottom: "1%" }}>
      <CardHeader
        className={classes.background}
        title={
          <div className="d-flex justify-content-between">
            <Typography className={classes.text} align="center" variant="h6">
              {Title}
            </Typography>
            <IconButton
              onClick={setExpand}
              aria-label="show more"
              className={clsx(classes.expand, {
                [classes.expandOpen]: expand,
              })}
            >
              <ExpandMoreIcon className={classes.text} />
            </IconButton>
          </div>
        }
      />
      <Collapse in={expand}>
        <CardContent>
          {Data.map((record) => {
            return (
              <Grid
                container
                spacing={3}
                key={
                  record.testing_id ? record.testing_id : record.vaccination_id
                }
              >
                <Grid item xs={12}>
                  <Card style={{ marginBottom: "1%" }}>
                    <CardContent>
                      {record.testing_id ? (
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="body2">
                              Testing ID: {record.testing_id}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2">
                              Date: {toLocalDate(record.date)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2">
                              Type: {record.type}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2">
                              Result: {record.result}
                            </Typography>
                          </Grid>
                        </Grid>
                      ) : (
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              Manufacturer: {record.manufacture}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              Vile Number: {record.vile_number}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              Date Given: {toLocalDate(record.date_given)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              Administer Person: {record.admister_person}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              Arm: {record.arm}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              Dose: {record.dose_number}
                            </Typography>
                          </Grid>
                        </Grid>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            );
          })}
        </CardContent>
      </Collapse>
    </Card>
  );
}

import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import toLocalDate from "../utils/toLocalDate";
import shortid from "shortid";

export default function CollapseCard({ Title, Data, expand, setExpand }) {
  return (
    <Card style={{ marginBottom: "1%" }}>
      <CardHeader
        className="bg-gray-700"
        title={
          <div className="flex justify-between">
            <Typography className="text-white" align="center" variant="h6">
              {Title}
            </Typography>
            <IconButton
              onClick={setExpand}
              aria-label="show more"
              className={`transition  duration-700 ease-in-out transform ml-auto   ${
                expand ? "rotate-180" : "rotate-0"
              }`}
            >
              <ExpandMoreIcon className="text-white" />
            </IconButton>
          </div>
        }
      />
      <Collapse in={expand}>
        <CardContent>
          <Grid container spacing={1}>
            {Data.map((record) => {
              return (
                <Grid item xs={12} key={shortid.generate()}>
                  <Card>
                    <CardContent>
                      {record.type ? (
                        <Grid container spacing={2}>
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
                          <Grid item sm={6} xs={12}>
                            <Typography variant="body2">
                              Manufacturer: {record.manufacture}
                            </Typography>
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <Typography variant="body2">
                              Vile Number: {record.vile_number}
                            </Typography>
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <Typography variant="body2">
                              Vaccination Date: {toLocalDate(record.date_given)}
                            </Typography>
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <Typography variant="body2">
                              Administering Site: {record.location.label}
                            </Typography>
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <Typography variant="body2">
                              Administering Person: {record.admister_person}
                            </Typography>
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <Typography variant="body2">
                              Arm: {record.arm}
                            </Typography>
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <Typography variant="body2">
                              Dosage: {record.dose_number}
                            </Typography>
                          </Grid>
                        </Grid>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
}

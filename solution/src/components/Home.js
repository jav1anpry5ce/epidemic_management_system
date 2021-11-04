import React from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
  Tooltip,
  SplineSeries,
} from "@devexpress/dx-react-chart-material-ui";
import {
  EventTracker,
  Animation,
  HoverState,
} from "@devexpress/dx-react-chart";

export default function Home() {
  const data = [
    { argument: 1, value: 563 },
    { argument: 2, value: 432 },
    { argument: 3, value: 455 },
    { argument: 4, value: 253 },
    { argument: 5, value: 1006 },
    { argument: 6, value: 932 },
    { argument: 7, value: 871 },
    { Vargument: 1, Vvalue: 10 },
    { Vargument: 2, Vvalue: 15 },
    { Vargument: 3, Vvalue: 35 },
  ];
  return (
    <Container maxWidth="lg">
      <Paper>
        <Chart data={data}>
          <ArgumentAxis />
          <ValueAxis />

          <SplineSeries valueField="value" argumentField="argument" />
          <LineSeries valueField="Vvalue" argumentField="Vargument" />
          <EventTracker />
          <HoverState />
          <Tooltip />
          <Animation />
        </Chart>
      </Paper>
      {/* <Grid container spacing={3}>
        <Grid item sm={6} xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h4">
                lorem ipsum dolor sit amet, consectetur adip
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h4">
                lorem ipsum dolor sit amet, consectetur adip
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid> */}
    </Container>
  );
}

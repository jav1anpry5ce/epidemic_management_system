import React, { useState, useEffect, useRef } from "react";
import { receiveBatch, clearState } from "../../store/locationSlice";
import { useSelector, useDispatch } from "react-redux";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Button, Form, FormControl, ControlLabel, Message } from "rsuite";
import { open } from "../../functions/Notifications";

export default function ReceiveBatch({ match }) {
  const data = useSelector((state) => state.location);
  const dispatch = useDispatch();
  const [authorizationCode, setAuthorizationCode] = useState();
  const formRef = useRef();

  useEffect(() => {
    if (data.success) {
      formRef.current._reactInternals.child.stateNode.reset();
      open("success", "Success", "Batch received!");
      dispatch(clearState());
      setAuthorizationCode("");
      setTimeout(() => {
        window.close();
      }, 3500);
    }
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, [data.success]);

  const handelSubmit = () => {
    const data = {
      batch_id: match.params.uuid,
      authorization_code: authorizationCode,
    };
    dispatch(receiveBatch(data));
  };

  return (
    <Container maxWidth="sm">
      <Card style={{ marginTop: "30%" }}>
        <CardHeader
          style={{ backgroundColor: "#383d42", color: "#fff" }}
          title={
            <Typography variant="h5" align="center">
              Receive Batch
            </Typography>
          }
        />
        <CardContent>
          <Form fluid onSubmit={handelSubmit} ref={formRef}>
            <Grid container spacing={1}>
              {data.message ? (
                <Grid item xs={12}>
                  <Message
                    closable
                    showIcon
                    type="error"
                    description={data.message}
                  />
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <ControlLabel>Authorization Code</ControlLabel>
                <FormControl onChange={(e) => setAuthorizationCode(e)} />
              </Grid>
              <Grid item xs={12}>
                {data.loading ? (
                  <Button disabled color="blue">
                    Loading...
                  </Button>
                ) : (
                  <Button color="blue" type="submit">
                    Submit
                  </Button>
                )}
              </Grid>
            </Grid>
          </Form>
        </CardContent>
      </Card>
    </Container>
  );
}

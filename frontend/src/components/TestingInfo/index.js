import React, { useEffect } from "react";
import Container from "@mui/material/Container";
import { List, ListItem, Title, Text, Paragraph } from "./TestingInfoElements";
import { setActiveKey } from "../../store/navbarSlice";
import { useDispatch } from "react-redux";
import { Card, CardContent } from "@mui/material";

export default function TestingInfo() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setActiveKey("2"));
  }, [dispatch]);
  return (
    <Container maxWidth="lg">
      <Card
        style={{
          backgroundColor: "rgba(255,255,255, 0.85)",
          overflowY: "scroll",
          maxHeight: "655px",
        }}
      >
        <CardContent>
          <Paragraph>
            <Title>Viral tests are used to look for current infection</Title>
            <Text>
              A viral test checks specimens from your nose or your mouth to find
              out if you are currently infected with the virus that causes
              COVID-19. Viral tests can be performed in a laboratory, at a
              testing site, or at home or anywhere else. Two types of viral
              tests are used: nucleic acid amplification tests (NAATs) and
              antigen tests.
            </Text>
          </Paragraph>
          <Paragraph>
            <Title>Who should get tested</Title>
            <Text>The following people should get tested for COVID-19:</Text>
            <List>
              <ListItem>People who have symptoms of COVID-19.</ListItem>
              <ListItem>
                People who have had a known exposure to someone with suspected
                or confirmed COVID-19.
              </ListItem>
              <ListItem>
                People not fully vaccinated with COVID-19 vaccine who are
                prioritized for expanded community screening for COVID-19.
              </ListItem>
              <ListItem>
                People not fully vaccinated with COVID-19 vaccine who have been
                asked or referred to get testing by their school, workplace,
                healthcare provider, state, tribal, localexternal icon or
                territorial health department.
              </ListItem>
            </List>
          </Paragraph>
          <Paragraph>
            <Title>Positive viral test</Title>
            <Text>
              If you test positive for the virus that causes COVID-19, take the
              following steps to protect others regardless of your COVID-19
              vaccination status: Isolate at home and isolate away from others
              for at least 10 days.
            </Text>
            <List>
              <ListItem>
                If you do not have any symptoms, you should still isolate at
                home for at least 10 days.
              </ListItem>
              <ListItem>
                If you develop symptoms, continue to isolate for at least 10
                days after symptoms began as long as symptoms have improved, and
                no fever is present for at least 24 hours without use of
                fever-reducing medications.
              </ListItem>
              <ListItem>
                Most people have mild COVID-19 illness and can recover at home
                without medical care.
              </ListItem>
              <ListItem>
                Contact your healthcare provider as soon as possible if you are
                more likely to get very sick because of being an older adult or
                having underlying medical conditions or if your symptoms get
                worse.
              </ListItem>
            </List>
            <Text>
              Talk to your healthcare provider or local health department to
              find out how long to isolate if you:
            </Text>
            <List>
              <ListItem>
                Are severely ill with COVID-19 or have a weakened immune system;
              </ListItem>
              <ListItem>
                Had a positive test result followed by a negative result; or
              </ListItem>
              <ListItem>
                Test positive for many weeks after the initial result.
              </ListItem>
            </List>
          </Paragraph>
          <Paragraph>
            <Title>Negative viral test</Title>
            <Text>
              If you test negative for the virus that causes COVID-19, the virus
              was not detected.
            </Text>
            <Text>If you have symptoms of COVID-19:</Text>
            <List>
              <ListItem>
                You may have received a false negative test result and still
                might have COVID-19. You should isolate away from others.
              </ListItem>
              <ListItem>
                Contact your healthcare provider about your symptoms, especially
                if they worsen, about follow-up testing, and how long to
                isolate.
              </ListItem>
            </List>
            <Text>
              If you do not have symptoms of COVID-19, and you were exposed to a
              person with COVID-19:
            </Text>
            <List>
              <ListItem>
                You are likely not infected, but you still may get sick.
              </ListItem>
              <ListItem>
                Self-quarantine at home for 14 days after your exposure.
                <Text>
                  Persons who are fully vaccinated with COVID-19 vaccine do not
                  need to self-quarantine at home
                </Text>
                <List>
                  <ListItem>
                    For residents of non-healthcare congregate settings (e.g.
                    correctional and detention facilities, group homes) and
                    employees of residential congregate settings and
                    high-density workplaces (e.g. meat and poultry processing
                    and manufacturing plants), refer to CDC’s recommendations
                    for fully vaccinated people.
                  </ListItem>
                </List>
              </ListItem>
              <ListItem>
                Contact your local health department regarding options to reduce
                the length of quarantine. If symptoms develop during home
                quarantine:
                <List>
                  <ListItem>
                    Contact your healthcare provider about follow-up testing;
                    and
                  </ListItem>
                  <ListItem>
                    Isolate at home separated away from others.
                  </ListItem>
                </List>
              </ListItem>
              <Text>
                If you do not have symptoms of COVID-19 and do not have a known
                exposure to a person with COVID-19:
              </Text>
              <List>
                <ListItem>You do not need to self-quarantine.</ListItem>
              </List>
            </List>
          </Paragraph>
          <Paragraph>
            <Title>Take steps to protect yourself</Title>
            <Text style={{ marginBottom: "3%" }}>
              Whether you test positive or negative for COVID-19, you should
              take preventive measures to protect yourself and others.
            </Text>
          </Paragraph>
        </CardContent>
      </Card>
    </Container>
  );
}

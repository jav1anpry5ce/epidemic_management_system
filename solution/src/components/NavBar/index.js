import React, { useState, useEffect } from "react";
import { Icon, Navbar, Nav, Dropdown } from "rsuite";
import Grid from "@mui/material/Grid";
import { FaBars } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { setActiveKey } from "../../store/navbarSlice";
import Container from "@mui/material/Container";
import { BiTestTube, BiCurrentLocation } from "react-icons/bi";
import { GiHypodermicTest, GiCardboardBox } from "react-icons/gi";
import { BsPersonFill, BsPersonPlusFill } from "react-icons/bs";
import { RiVirusLine } from "react-icons/ri";

export default function NavBar() {
  const auth = useSelector((state) => state.auth);
  const nav = useSelector((state) => state.navbar);
  const dispatch = useDispatch();
  const history = useHistory();
  const [show, setShow] = useState(true);
  const [hide, setHide] = useState(false);
  const [expand, setExpand] = useState(false);
  const [height, setHeight] = useState(39);

  function nagivate(link) {
    history.push(link);
  }
  const handelSelect = (eventKey) => {
    dispatch(setActiveKey(eventKey));
  };

  useEffect(() => {
    window.addEventListener("resize", resize);
    window.addEventListener("hashchange", showNav);
    if (window.innerWidth <= 760) {
      setShow(false);
    } else {
      setShow(true);
    }
    if (expand) {
      setHeight(165);
    } else {
      setHeight(39);
    }
    if (
      window.location.hash.includes("#/patient-info/") ||
      window.location.hash.includes("#/got-the-stach/")
    ) {
      setHide(true);
    } else {
      setHide(false);
    }
    // eslint-disable-next-line
  }, [window, expand]);

  useEffect(() => {
    if (!auth.is_auth) {
      if (window.location.hash.includes("%20")) {
        history.push("/account/login");
      }
    }
    // eslint-disable-next-line
  }, [auth.is_auth]);

  const resize = () => {
    if (window.innerWidth <= 760) {
      setShow(false);
    } else {
      setShow(true);
    }
  };

  const showNav = () => {
    if (
      window.location.hash.includes("#/patient-info/") ||
      window.location.hash.includes("#/got-the-stach/")
    ) {
      setHide(true);
    } else {
      setHide(false);
    }
  };

  if (auth.is_auth) {
    return (
      <Navbar
        appearance="inverse"
        style={{
          backgroundColor: "#12142b",
          color: "#fffff",
        }}
      >
        <Navbar.Body>
          {auth.is_moh_staff ? (
            <Container maxWidth="xsl">
              <Nav onSelect={handelSelect} activeKey={nav.activeKey}>
                <Nav.Item
                  eventKey="1"
                  icon={<Icon icon="home" />}
                  onClick={() => nagivate("/moh/home")}
                >
                  Home
                </Nav.Item>
                <Nav.Item
                  eventKey="2"
                  icon={
                    <BsPersonFill
                      style={{ fontSize: 18, marginRight: 3, marginBottom: 3 }}
                    />
                  }
                  onClick={() => nagivate("/moh/patients")}
                >
                  Patients
                </Nav.Item>
                <Nav.Item
                  eventKey="3"
                  icon={
                    <RiVirusLine
                      style={{ fontSize: 18, marginRight: 3, marginBottom: 3 }}
                    />
                  }
                  onClick={() => nagivate("/moh/positive-cases")}
                >
                  Positive Cases
                </Nav.Item>
                <Nav.Item
                  eventKey="4"
                  icon={
                    <GiCardboardBox
                      style={{ fontSize: 18, marginRight: 3, marginBottom: 3 }}
                    />
                  }
                  onClick={() => nagivate("/moh/batch-management")}
                >
                  Batch
                </Nav.Item>
                <Nav.Item
                  eventKey="5"
                  icon={
                    <BiCurrentLocation
                      style={{ fontSize: 18, marginRight: 3, marginBottom: 3 }}
                    />
                  }
                  onClick={() => nagivate("/moh/locations")}
                >
                  Locations
                </Nav.Item>
                {auth.is_moh_admin ? (
                  <Nav.Item
                    eventKey="6"
                    icon={
                      <BsPersonPlusFill
                        style={{
                          fontSize: 18,
                          marginRight: 3,
                          marginBottom: 3,
                        }}
                      />
                    }
                    onClick={() => nagivate("/moh/add-location-admin")}
                  >
                    Add Location Admin
                  </Nav.Item>
                ) : null}
                {auth.is_moh_admin ? (
                  <Nav.Item
                    eventKey="7"
                    icon={
                      <BsPersonPlusFill
                        style={{
                          fontSize: 18,
                          marginRight: 3,
                          marginBottom: 3,
                        }}
                      />
                    }
                    onClick={() => nagivate("/moh/add-moh-staff")}
                  >
                    Add MOH Staff
                  </Nav.Item>
                ) : null}
              </Nav>
              <Nav pullRight>
                <Nav.Item
                  icon={<Icon icon="sign-out" />}
                  onClick={() => dispatch(logout())}
                >
                  Sign Out
                </Nav.Item>
              </Nav>
              <Nav
                pullRight
                onSelect={handelSelect}
                activeKey={nav.activeKey}
                style={{ marginRight: 5 }}
              >
                <Nav.Item disabled>Hello, {auth.username}</Nav.Item>
                <Dropdown title="Settings" icon={<Icon icon="cog" />}>
                  <Dropdown.Item
                    eventKey="8"
                    onClick={() => nagivate("/account/change-password")}
                  >
                    Change Password
                  </Dropdown.Item>
                  {auth.is_moh_admin ? (
                    <Dropdown.Item
                      eventKey="9"
                      onClick={() => nagivate("/reset/password/request")}
                    >
                      Reset employee password
                    </Dropdown.Item>
                  ) : null}
                </Dropdown>
              </Nav>
            </Container>
          ) : (
            <Container maxWidth="xsl">
              {" "}
              <Nav onSelect={handelSelect} activeKey={nav.activeKey}>
                <Nav.Item
                  eventKey="1"
                  icon={<Icon icon="home" />}
                  onClick={() => nagivate(`/${auth.location}/home`)}
                >
                  Home
                </Nav.Item>
                <Nav.Item
                  eventKey="2"
                  icon={<Icon icon="flask" />}
                  onClick={() => nagivate("/test-vac/management")}
                >
                  Vaccination and Testing
                </Nav.Item>
                <Nav.Item
                  eventKey="3"
                  icon={<Icon icon="calendar" />}
                  onClick={() => nagivate(`/${auth.location}/appointments`)}
                >
                  Appointments{" "}
                </Nav.Item>
                {auth.is_location_admin ? (
                  <Nav.Item
                    eventKey="4"
                    icon={<Icon icon="plus" />}
                    onClick={() => nagivate("/admin/add-staff")}
                  >
                    Add Staff
                  </Nav.Item>
                ) : null}
              </Nav>
              <Nav pullRight>
                <Nav.Item
                  icon={<Icon icon="sign-out" />}
                  onClick={() => dispatch(logout())}
                >
                  Sign Out
                </Nav.Item>
              </Nav>
              <Nav pullRight onSelect={handelSelect} activeKey={nav.activeKey}>
                <Nav.Item disabled>Hello, {auth.username}</Nav.Item>
                <Dropdown title="Settings" icon={<Icon icon="cog" />}>
                  <Dropdown.Item
                    eventKey="6"
                    onClick={() => nagivate("/account/change-password")}
                  >
                    Change Password
                  </Dropdown.Item>
                  {auth.is_location_admin ? (
                    <Dropdown.Item
                      eventKey="7"
                      onClick={() => nagivate("/reset/password/request")}
                    >
                      Reset employee password
                    </Dropdown.Item>
                  ) : null}
                </Dropdown>
              </Nav>
            </Container>
          )}

          {/* <Nav pullRight>
          <Nav.Item icon={<Icon icon="cog" />}>Settings</Nav.Item>
        </Nav> */}
        </Navbar.Body>
      </Navbar>
    );
  } else if (hide) {
    return <Container></Container>;
  } else {
    return (
      <Navbar
        appearance="inverse"
        style={{
          backgroundColor: "#000829",
          color: "#fffff",
        }}
      >
        <Navbar.Body>
          {show ? (
            <Container maxWidth="xsl">
              <Nav onSelect={handelSelect} activeKey={nav.activeKey}>
                <Nav.Item
                  icon={<Icon icon="home" />}
                  onClick={() => nagivate("/")}
                  eventKey="1"
                >
                  Home
                </Nav.Item>
                <Nav.Item
                  eventKey="2"
                  onClick={() =>
                    window.open(
                      "https://www.cdc.gov/coronavirus/2019-ncov/symptoms-testing/testing.html",
                      "_self"
                    )
                  }
                  icon={<BiTestTube style={{ fontSize: 18, marginRight: 3 }} />}
                >
                  Testing Information
                </Nav.Item>
                <Nav.Item
                  eventKey="3"
                  onClick={() =>
                    window.open(
                      "https://www.cdc.gov/coronavirus/2019-ncov/vaccines/facts.html",
                      "_self"
                    )
                  }
                  icon={
                    <GiHypodermicTest
                      style={{ fontSize: 18, marginRight: 5 }}
                    />
                  }
                >
                  Vaccine Information
                </Nav.Item>
                <Nav.Item
                  onClick={() => {
                    nagivate("/appointments");
                  }}
                  eventKey="4"
                  icon={<Icon icon="calendar" />}
                >
                  Appoinments
                </Nav.Item>
              </Nav>
              {/* <Nav pullRight>
              <Nav.Item></Nav.Item>
            </Nav> */}
              <Nav
                pullRight
                onSelect={handelSelect}
                activeKey={nav.activeKey}
                style={{ marginRight: 5 }}
              >
                <Dropdown title="Settings" icon={<Icon icon="cog" />}>
                  <Dropdown.Item
                    eventKey="5"
                    onClick={() => nagivate("/update/patient/info")}
                  >
                    Update Information
                  </Dropdown.Item>
                </Dropdown>
              </Nav>
            </Container>
          ) : (
            // eslint-disable-next-line
            <Container
              maxWidth="xsl"
              style={{
                height: height,
                transition: expand ? ".3s ease-in-out" : ".3s ease-out",
              }}
            >
              <FaBars
                style={{
                  fontSize: 37,
                  marginTop: 3,
                  marginBottom: 2,
                }}
                onClick={() => setExpand(!expand)}
              />
              {expand ? (
                <Grid
                  align="center"
                  container
                  spacing={2}
                  style={{
                    animation: expand ? "fadeIn ease 2s" : "fadeOut ease 2s",
                  }}
                >
                  <Nav onSelect={handelSelect} activeKey={nav.activeKey}>
                    <Grid item xs={12} style={{ marginTop: "7%" }}>
                      <Nav.Item
                        icon={<Icon icon="home" />}
                        onClick={() => {
                          nagivate("/");
                          setExpand(!expand);
                        }}
                        eventKey="1"
                      >
                        Home
                      </Nav.Item>
                      <Nav.Item
                        eventKey="2"
                        onClick={() =>
                          window.open(
                            "https://www.cdc.gov/coronavirus/2019-ncov/symptoms-testing/testing.html",
                            "_self"
                          )
                        }
                        icon={
                          <BiTestTube
                            style={{ fontSize: 18, marginRight: 3 }}
                          />
                        }
                      >
                        Testing Information
                      </Nav.Item>
                      <Dropdown title="Settings" icon={<Icon icon="cog" />}>
                        <Dropdown.Item
                          eventKey="5"
                          onClick={() => {
                            nagivate("/update/patient/info");
                            setExpand(!expand);
                          }}
                        >
                          Update Information
                        </Dropdown.Item>
                      </Dropdown>
                    </Grid>
                    <Grid item xs={12}>
                      <Nav.Item
                        eventKey="3"
                        onClick={() =>
                          window.open(
                            "https://www.cdc.gov/coronavirus/2019-ncov/vaccines/facts.html",
                            "_self"
                          )
                        }
                        icon={
                          <GiHypodermicTest
                            style={{ fontSize: 18, marginRight: 5 }}
                          />
                        }
                      >
                        Vaccine Information
                      </Nav.Item>

                      <Nav.Item
                        onClick={() => {
                          nagivate("/appointments");
                          setExpand(!expand);
                        }}
                        eventKey="4"
                        icon={<Icon icon="calendar" />}
                      >
                        Appoinments
                      </Nav.Item>
                    </Grid>
                    <Grid item xs={12}></Grid>
                  </Nav>
                </Grid>
              ) : null}
            </Container>
          )}
        </Navbar.Body>
      </Navbar>
    );
  }
}

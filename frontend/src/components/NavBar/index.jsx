import React, { useState, useEffect } from "react";
import { Icon, Navbar, Nav, Dropdown } from "rsuite";
import { FaBars } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { setActiveKey } from "../../store/navbarSlice";
import Container from "@mui/material/Container";
import { BiTestTube, BiCurrentLocation } from "react-icons/bi";
import { GiHypodermicTest, GiCardboardBox } from "react-icons/gi";
import { BsPersonFill, BsPersonPlusFill } from "react-icons/bs";
import { RiVirusLine } from "react-icons/ri";
import { AiFillHome, AiOutlineFileText } from "react-icons/ai";
import { MdEventAvailable } from "react-icons/md";

export default function NavBar({ hide, setHide }) {
  const auth = useSelector((state) => state.auth);
  const nav = useSelector((state) => state.navbar);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState(true);

  const [expand, setExpand] = useState(false);
  const [height, setHeight] = useState(39);

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
    if (window.location.pathname.includes("got-the-stach/")) {
      setHide(true);
    } else {
      setHide(false);
    }
    // eslint-disable-next-line
  }, [window, expand]);

  useEffect(() => {
    if (!auth.is_auth) {
      if (window.location.hash.includes("%20")) {
        navigate("/accounts/login");
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

  if (auth.is_auth && !hide) {
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
                <Link to="/moh">
                  <Nav.Item eventKey="1">
                    <div className="flex">
                      {<AiFillHome className="flex text-lg mr-1" />}
                      Home
                    </div>
                  </Nav.Item>
                </Link>
                <Link to="/moh/patients">
                  <Nav.Item eventKey="2">
                    <div className="flex">
                      {<BsPersonFill className="flex text-lg mr-1" />}
                      Patients
                    </div>
                  </Nav.Item>
                </Link>
                <Link to="/moh/positive-cases">
                  <Nav.Item eventKey="3">
                    <div className="flex">
                      {<RiVirusLine className="flex text-lg mr-1" />}
                      Positive Cases
                    </div>
                  </Nav.Item>
                </Link>
                <Link to="/moh/batches">
                  <Nav.Item eventKey="4">
                    <div className="flex">
                      {<GiCardboardBox className="flex text-lg mr-1" />}
                      Batch
                    </div>
                  </Nav.Item>
                </Link>
                <Link to="/moh/locations">
                  <Nav.Item eventKey="5">
                    <div className="flex">
                      {<BiCurrentLocation className="flex text-lg mr-1" />}
                      Sites
                    </div>
                  </Nav.Item>
                </Link>
                {auth.is_moh_admin && (
                  <Link to="/moh/add-staff">
                    <Nav.Item eventKey="6">
                      <div className="flex">
                        {<BsPersonPlusFill className="flex text-lg mr-1" />}
                        Add Staff
                      </div>
                    </Nav.Item>
                  </Link>
                )}
              </Nav>
              <Nav pullRight>
                <Nav.Item
                  icon={<Icon icon="sign-out" />}
                  onClick={() => {
                    dispatch(logout());
                  }}
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
                  <Link to="/accounts/change-password">
                    <Dropdown.Item eventKey="8">Change Password</Dropdown.Item>
                  </Link>
                  {auth.is_moh_admin && (
                    <Link to="/accounts/reset/password/request">
                      <Dropdown.Item eventKey="9">
                        Reset employee password
                      </Dropdown.Item>
                    </Link>
                  )}
                </Dropdown>
              </Nav>
            </Container>
          ) : (
            <Container maxWidth="xsl">
              <Nav onSelect={handelSelect} activeKey={nav.activeKey}>
                <Link to={`/${auth.location}`}>
                  <Nav.Item eventKey="1">
                    <div className="flex">
                      {<AiFillHome className="flex text-lg mr-1" />}
                      Home
                    </div>
                  </Nav.Item>
                </Link>
                <Link to={`/${auth.location}/test-vac/management`}>
                  <Nav.Item eventKey="2" icon={<Icon icon="flask" />}>
                    Vaccination and Testing
                  </Nav.Item>
                </Link>
                <Link to={`/${auth.location}/appointments`}>
                  <Nav.Item eventKey="3" icon={<Icon icon="calendar" />}>
                    Appointments{" "}
                  </Nav.Item>
                </Link>
                {auth.is_location_admin && (
                  <Link to={`/${auth.location}/add-staff`}>
                    <Nav.Item eventKey="4">
                      <div className="flex">
                        {<BsPersonPlusFill className="flex text-lg mr-1" />}
                        Add Staff
                      </div>
                    </Nav.Item>
                  </Link>
                )}
                <Link to={`/${auth.location}/add/availability`}>
                  <Nav.Item eventKey="5">
                    <div className="flex">
                      {<MdEventAvailable className="flex text-lg mr-1" />}Add
                      Availability
                    </div>
                  </Nav.Item>
                </Link>
              </Nav>
              <Nav pullRight>
                <Nav.Item
                  icon={<Icon icon="sign-out" />}
                  onClick={() => {
                    dispatch(logout()).then(() => navigate("/accounts/login"));
                  }}
                >
                  Sign Out
                </Nav.Item>
              </Nav>
              <Nav pullRight onSelect={handelSelect} activeKey={nav.activeKey}>
                <Nav.Item disabled>Hello, {auth.username}</Nav.Item>
                <Dropdown title="Settings" icon={<Icon icon="cog" />}>
                  <Link to={`/accounts/change-password`}>
                    <Dropdown.Item eventKey="6">Change Password</Dropdown.Item>
                  </Link>
                  {auth.is_location_admin && (
                    <Link to={`/accounts/reset/password/request`}>
                      <Dropdown.Item eventKey="7">
                        Reset employee password
                      </Dropdown.Item>
                    </Link>
                  )}
                </Dropdown>
              </Nav>
            </Container>
          )}
        </Navbar.Body>
      </Navbar>
    );
  } else if (hide) {
    return null;
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
            // desktop
            <Container maxWidth="xsl">
              <Nav onSelect={handelSelect} activeKey={nav.activeKey}>
                <Link to="/">
                  <Nav.Item eventKey="1">
                    <div className="flex">
                      {<AiFillHome className="flex text-lg mr-1" />}
                      Home
                    </div>
                  </Nav.Item>
                </Link>
                <Nav.Item
                  eventKey="2"
                  onClick={() =>
                    window.open(
                      "https://www.cdc.gov/coronavirus/2019-ncov/symptoms-testing/testing.html",
                      "_self"
                    )
                  }
                >
                  <div className="flex">
                    {<BiTestTube className="flex text-lg mr-1" />}
                    Testing Information
                  </div>
                </Nav.Item>
                <Nav.Item
                  eventKey="3"
                  onClick={() =>
                    window.open(
                      "https://www.cdc.gov/coronavirus/2019-ncov/vaccines/facts.html",
                      "_self"
                    )
                  }
                >
                  <div className="flex">
                    {<GiHypodermicTest className="flex text-lg mr-1" />}
                    Vaccine Information
                  </div>
                </Nav.Item>
                <Link to="/appointments">
                  <Nav.Item eventKey="4" icon={<Icon icon="calendar" />}>
                    Appoinments
                  </Nav.Item>
                </Link>
                <Link to="/records">
                  <Nav.Item eventKey="5">
                    <div className="flex">
                      {<AiOutlineFileText className="flex text-lg mr-1" />}
                      Get my Records
                    </div>
                  </Nav.Item>
                </Link>
              </Nav>
              <Nav
                pullRight
                onSelect={handelSelect}
                activeKey={nav.activeKey}
                style={{ marginRight: 5 }}
              >
                <Dropdown title="Settings" icon={<Icon icon="cog" />}>
                  <Link to="/update/patient/info">
                    <Dropdown.Item eventKey="6">
                      Update Information
                    </Dropdown.Item>
                  </Link>
                </Dropdown>
              </Nav>
            </Container>
          ) : (
            // mobile
            // eslint-disable-next-line
            <Container maxWidth="xsl" style={{ height: height }}>
              <FaBars
                style={{
                  fontSize: 37,
                  marginTop: 3,
                  marginBottom: 2,
                }}
                onClick={() => setExpand(!expand)}
              />
              {expand && (
                <Nav
                  onSelect={handelSelect}
                  activeKey={nav.activeKey}
                  className="transition-all ease-in-out duration-500 w-full"
                >
                  <div className="grid grid-cols-1 place-items-center">
                    <Link to="/">
                      <Nav.Item
                        onClick={() => {
                          setExpand(!expand);
                        }}
                        eventKey="1"
                      >
                        <div className="flex">
                          {<AiFillHome className="flex text-lg mr-1" />}
                          Home
                        </div>
                      </Nav.Item>
                    </Link>
                    <Nav.Item
                      eventKey="2"
                      onClick={() =>
                        window.open(
                          "https://www.cdc.gov/coronavirus/2019-ncov/symptoms-testing/testing.html",
                          "_self"
                        )
                      }
                    >
                      <div className="flex">
                        {<BiTestTube className="flex text-lg mr-1" />}
                        Testing Information
                      </div>
                    </Nav.Item>
                    <Nav.Item
                      eventKey="3"
                      onClick={() =>
                        window.open(
                          "https://www.cdc.gov/coronavirus/2019-ncov/vaccines/facts.html",
                          "_self"
                        )
                      }
                    >
                      <div className="flex">
                        {<GiHypodermicTest className="flex text-lg mr-1" />}
                        Vaccine Information
                      </div>
                    </Nav.Item>
                    <Link to="/appointments">
                      <Nav.Item
                        onClick={() => {
                          setExpand(!expand);
                        }}
                        eventKey="4"
                        icon={<Icon icon="calendar" />}
                      >
                        Appoinments
                      </Nav.Item>
                    </Link>
                    <Link to="/records">
                      <Nav.Item
                        onClick={() => {
                          setExpand(!expand);
                        }}
                        eventKey="5"
                      >
                        <div className="flex">
                          {<AiOutlineFileText className="flex text-lg mr-1" />}
                          Get my Records
                        </div>
                      </Nav.Item>
                    </Link>
                    <Dropdown title="Settings" icon={<Icon icon="cog" />}>
                      <Link to="/update/patient/info">
                        <Dropdown.Item
                          eventKey="6"
                          onClick={() => {
                            setExpand(!expand);
                          }}
                        >
                          Update Information
                        </Dropdown.Item>
                      </Link>
                    </Dropdown>
                  </div>
                </Nav>
              )}
            </Container>
          )}
        </Navbar.Body>
      </Navbar>
    );
  }
}

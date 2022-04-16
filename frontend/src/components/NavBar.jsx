import React, { useState, useEffect } from "react";
import { Icon, Navbar, Nav, Dropdown } from "rsuite";
import { FaBars, FaBox } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { setActiveKey } from "../store/navbarSlice";
import Container from "@mui/material/Container";
import { BiCurrentLocation } from "react-icons/bi";
import { GiCardboardBox } from "react-icons/gi";
import { BsPersonFill, BsPersonPlusFill } from "react-icons/bs";
import { RiVirusLine } from "react-icons/ri";
import { AiFillEdit, AiFillHome, AiOutlineFileText } from "react-icons/ai";
import { MdDataUsage, MdEventAvailable } from "react-icons/md";
import { Transition } from "@headlessui/react";

export default function NavBar({ hide, setHide }) {
  const auth = useSelector((state) => state.auth);
  const nav = useSelector((state) => state.navbar);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState(true);

  const [expand, setExpand] = useState(false);

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
                <Nav.Item eventKey="1" onClick={() => navigate("/moh")}>
                  <div className="flex items-center space-x-1">
                    {<AiFillHome className="text-lg" />}
                    <span>Home</span>
                  </div>
                </Nav.Item>

                <Nav.Item
                  eventKey="2"
                  onClick={() => navigate("/moh/patients")}
                >
                  <div className="flex items-center space-x-1">
                    {<BsPersonFill className="text-lg" />}
                    <span>Patients</span>
                  </div>
                </Nav.Item>
                <Nav.Item eventKey="3" onClick={() => navigate("/moh/cases")}>
                  <div className="flex items-center space-x-1">
                    {<RiVirusLine className="text-lg" />}
                    <span>Cases</span>
                  </div>
                </Nav.Item>
                <Nav.Item eventKey="4" onClick={() => navigate("/moh/batches")}>
                  <div className="flex items-center space-x-1">
                    {<GiCardboardBox className="text-lg" />}
                    <span>Batch</span>
                  </div>
                </Nav.Item>
                <Nav.Item eventKey="5" onClick={() => navigate("/moh/sites")}>
                  <div className="flex items-center space-x-1">
                    {<BiCurrentLocation className="text-lg" />}
                    <span>Sites</span>
                  </div>
                </Nav.Item>
                {auth.is_moh_admin && (
                  <Nav.Item eventKey="6" onClick={() => navigate("/moh/staff")}>
                    <div className="flex items-center space-x-1">
                      {<BsPersonPlusFill className="text-lg" />}
                      <span>Staff Management</span>
                    </div>
                  </Nav.Item>
                )}
                <Nav.Item
                  eventKey="7"
                  onClick={() => navigate("/moh/inventory")}
                >
                  <div className="flex items-center space-x-1">
                    {<FaBox className="text-lg" />}
                    <span>Inventory Management</span>
                  </div>
                </Nav.Item>
                <Nav.Item
                  eventKey="10"
                  onClick={() => navigate("/moh/summary")}
                >
                  <div className="flex items-center space-x-1">
                    {<MdDataUsage className="text-lg" />}
                    <span>Epidemic Summary</span>
                  </div>
                </Nav.Item>
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
                {/* <Nav.Item disabled>Hello, {auth.username}</Nav.Item> */}
                <Dropdown title="Settings" icon={<Icon icon="cog" />}>
                  <Dropdown.Item
                    eventKey="8"
                    onClick={() => navigate("/accounts/change-password")}
                  >
                    Change Password
                  </Dropdown.Item>
                  {auth.is_moh_admin && (
                    <Dropdown.Item
                      eventKey="9"
                      onClick={() =>
                        navigate("/accounts/reset/password/request")
                      }
                    >
                      Reset employee password
                    </Dropdown.Item>
                  )}
                </Dropdown>
              </Nav>
            </Container>
          ) : (
            <Container maxWidth="xsl">
              <Nav onSelect={handelSelect} activeKey={nav.activeKey}>
                <Nav.Item
                  eventKey="1"
                  onClick={() => navigate(`/${auth.location}`)}
                >
                  <div className="flex items-center space-x-1">
                    {<AiFillHome className="text-lg" />}
                    <span>Home</span>
                  </div>
                </Nav.Item>
                <Nav.Item
                  eventKey="2"
                  icon={<Icon icon="flask" />}
                  onClick={() =>
                    navigate(`/${auth.location}/test-vac/management`)
                  }
                >
                  <span>Vaccination and Testing</span>
                </Nav.Item>
                <Nav.Item
                  eventKey="3"
                  icon={<Icon icon="calendar" />}
                  onClick={() => navigate(`/${auth.location}/appointments`)}
                >
                  <span>Appointments</span>
                </Nav.Item>
                {auth.is_location_admin && (
                  <Nav.Item
                    eventKey="4"
                    onClick={() => navigate(`/${auth.location}/staff`)}
                  >
                    <div className="flex items-center space-x-1">
                      {<BsPersonPlusFill className="text-lg" />}
                      <span>Staff Management</span>
                    </div>
                  </Nav.Item>
                )}
                <Nav.Item
                  eventKey="5"
                  onClick={() => navigate(`/${auth.location}/add/availability`)}
                >
                  <div className="flex items-center space-x-1">
                    {<MdEventAvailable className="text-lg" />}
                    <span>Add Availability</span>
                  </div>
                </Nav.Item>
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
                  <Dropdown.Item
                    eventKey="6"
                    onClick={() => navigate(`/accounts/change-password`)}
                  >
                    Change Password
                  </Dropdown.Item>
                  {auth.is_location_admin && (
                    <Dropdown.Item
                      eventKey="7"
                      onClick={() =>
                        navigate(`/accounts/reset/password/request`)
                      }
                    >
                      Reset employee password
                    </Dropdown.Item>
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
                <Nav.Item eventKey="1" onClick={() => navigate(`/`)}>
                  <div className="flex items-center space-x-1">
                    {<AiFillHome className="text-lg" />}
                    <span>Home</span>
                  </div>
                </Nav.Item>
                <Nav.Item
                  eventKey="4"
                  icon={<Icon icon="calendar" />}
                  onClick={() => navigate(`/appointments`)}
                >
                  <span>Appointment</span>
                </Nav.Item>
                <Nav.Item eventKey="5" onClick={() => navigate(`/records`)}>
                  <div className="flex items-center space-x-1">
                    {<AiOutlineFileText className="text-lg" />}
                    <span>Get My Records</span>
                  </div>
                </Nav.Item>
                <Nav.Item
                  eventKey="6"
                  onClick={() => navigate(`/update/patient/info`)}
                >
                  <div className="flex items-center space-x-1">
                    {<AiFillEdit className="text-lg" />}
                    <span>Update Information</span>
                  </div>
                </Nav.Item>
              </Nav>
            </Container>
          ) : (
            // mobile
            // eslint-disable-next-line

            <div className="px-2">
              <FaBars
                style={{
                  fontSize: 37,
                  marginTop: 3,
                  marginBottom: 2,
                }}
                onClick={() => setExpand(!expand)}
              />
              <Transition
                show={expand}
                className="fixed top-0 left-0 z-[1000] h-full w-[100%] bg-[#000829] text-white"
                enter="transition translation duration-300"
                enterFrom="opacity-0 translate-x-[-200%]"
                enterTo="opacity-100 translate-x-[0%]"
                leave="transition translation duration-300"
                leaveFrom="translate-x-[0%]"
                leaveTo="-translate-x-[200%]"
              >
                <div className="px-2">
                  <div className="flex w-full items-center justify-end">
                    <FaBars
                      style={{
                        fontSize: 37,
                        marginTop: 3,
                        marginBottom: 2,
                      }}
                      onClick={() => setExpand(!expand)}
                    />
                  </div>
                  <Nav
                    onSelect={handelSelect}
                    activeKey={nav.activeKey}
                    className="w-full transition-all duration-500 ease-in-out"
                  >
                    <div className="grid grid-cols-1 place-items-center">
                      <Nav.Item
                        onClick={() => {
                          navigate("/");
                          setExpand(!expand);
                        }}
                        eventKey="1"
                      >
                        <div className="flex items-center space-x-1">
                          {<AiFillHome className="text-lg" />}
                          <span>Home</span>
                        </div>
                      </Nav.Item>
                      <Nav.Item
                        onClick={() => {
                          navigate("/appointments");
                          setExpand(!expand);
                        }}
                        eventKey="4"
                        icon={<Icon icon="calendar" />}
                      >
                        <span>Appointments</span>
                      </Nav.Item>
                      <Nav.Item
                        onClick={() => {
                          navigate("/records");
                          setExpand(!expand);
                        }}
                        eventKey="5"
                      >
                        <div className="flex items-center space-x-1">
                          {<AiOutlineFileText className="text-lg" />}
                          <span>Get My Records</span>
                        </div>
                      </Nav.Item>
                      <Nav.Item
                        eventKey="6"
                        onClick={() => navigate(`/update/patient/info`)}
                      >
                        <div className="flex items-center space-x-1">
                          {<AiFillEdit className="text-lg" />}
                          <span>Update Information</span>
                        </div>
                      </Nav.Item>
                    </div>
                  </Nav>
                </div>
              </Transition>
            </div>
          )}
        </Navbar.Body>
      </Navbar>
    );
  }
}

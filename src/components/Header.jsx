import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Row,
  Col,
  NavDropdown,
} from "react-bootstrap";
import { MdCall } from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa"; 
import logo from "../assets/img/logo.png";
import "./Header.css";

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  // Toggle navbar open/close
  const handleToggle = () => {
    setNavbarOpen(!navbarOpen);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar py-2">
        <Container>
          <Row>
            <Col md={6}>
              <span className="contact-info">
                <span className="icon">
                  <MdCall />
                </span>
                Need Quick Response? Call Us +234 333 000 0000
              </span>
            </Col>
            <Col md={6} className="text-end">
              <span className="working-hours">Monday - Friday / 8AM to 5PM</span>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Navbar */}
      <Navbar expand="lg" className="py-3 main-header">
        <Container>
          <Navbar.Brand href="#home">
            <img
              src={logo}
              alt="Bigfix"
              className="d-inline-block align-top logo"
            />
          </Navbar.Brand>

          {/* Custom Toggle Button */}
          <Button className="custom-toggler" onClick={handleToggle}>
            {navbarOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
          </Button>

          {/* Navbar collapse */}
          <Navbar.Collapse
            id="navbarScroll"
            className={navbarOpen ? "show" : ""}
          >
            <Nav className="ms-auto navbar-item">
              <Nav.Link href="#action1">Company</Nav.Link>

              {/* Fastrasuite Dropdown */}
              <NavDropdown title="Fastrasuite" id="navbarScrollingDropdown">
                <NavDropdown.Item href="#action3">
                  About Fastrasuite
                </NavDropdown.Item>
                <NavDropdown.Item href="#action4">Take a Tour</NavDropdown.Item>
              </NavDropdown>

              {/* Services Dropdown */}
              <NavDropdown title="Services" id="servicesDropdown">
                <div className="dropdown-card">
                  <Row>
                    <Col>
                      <h6>Cloud</h6>
                      <NavDropdown.Item href="#action1">
                        Microsoft Azure
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#action2">
                        Microsoft 365
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#action3">
                        Microsoft SharePoint
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#action4">AWS</NavDropdown.Item>
                      <NavDropdown.Item href="#action5">Google</NavDropdown.Item>
                    </Col>
                    <Col>
                      <h6>Business Application</h6>
                      <NavDropdown.Item href="#action6">Zoho</NavDropdown.Item>
                      <NavDropdown.Item href="#action7">
                        Adobe Creative Cloud
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#action8">
                        Adobe Document Cloud
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#action9">AutoDesk</NavDropdown.Item>
                    </Col>
                    <Col>
                      <h6>IT Infrastructure</h6>
                      <NavDropdown.Item href="#action10">Support</NavDropdown.Item>
                      <NavDropdown.Item href="#action11">
                        Consultancy
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#action12">
                        Implementation
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#action13">Training</NavDropdown.Item>
                    </Col>
                  </Row>
                </div>
              </NavDropdown>

              <Nav.Link href="#insight">Insight</Nav.Link>
              <Button className="book-demo-btn">Book a Demo</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;

import { useState } from "react";
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
import { Link } from "react-router-dom";

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
          <Row style={{ alignItems: "center" }}>
            <Col md={6}>
              <span className="contact-info">
                <span className="icon">
                  <MdCall />
                </span>
                <a
                  href="tel:+234 8056 235 944"
                  style={{
                    color: "#0A2F5A",
                    textDecoration: "none",
                    fontWeight: "700",
                  }}
                >
                  {" "}
                  &nbsp;Need Quick Response? Call Us
                  +234&nbsp;8056&nbsp;235&nbsp;944
                </a>
              </span>
            </Col>
            <Col md={6} className="text-end">
              <span className="working-hours">
                Monday - Friday / 8AM to 5PM
              </span>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Navbar */}
      <Navbar expand="lg" className="py-3 main-header">
        <Container>
          <Link to="/">
            <Navbar.Brand href="#home">
              <img
                src={logo}
                alt="Bigfix"
                className="d-inline-block align-top logo"
              />
            </Navbar.Brand>
          </Link>

          {/* Custom Toggle Button */}
          <Button
            className="custom-toggler d-lg-none" // Hide the button on large screens
            onClick={handleToggle}
          >
            {navbarOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
          </Button>

          {/* Navbar collapse */}
          <Navbar.Collapse
            id="navbarScroll"
            className={`collapse navbar-collapse ${navbarOpen ? "show" : ""}`} // Ensure proper collapse behavior
          >
            <Nav className="ms-auto navbar-item">
              <Link to="/about-us" className="nav-item">
                <Nav.Link href="/about-us" className="white-hover">
                  Company
                </Nav.Link>
              </Link>

              {/* Fastrasuite Dropdown */}
              <NavDropdown title="Fastrasuite" id="navbarScrollingDropdown">
                <Link to="https://web.fastrasuite.com/" target="_blank" className="nav-item">
                  <NavDropdown.Item href="https://web.fastrasuite.com/" target="_blank">
                    About Fastrasuite
                  </NavDropdown.Item>
                </Link>
                <Link to="/about-us" className="nav-item">
                <NavDropdown.Item href="/about-us">Take a Tour</NavDropdown.Item></Link>
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
                      <NavDropdown.Item href="#action5">
                        Google
                      </NavDropdown.Item>
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
                      <NavDropdown.Item href="#action9">
                        AutoDesk
                      </NavDropdown.Item>
                    </Col>
                    <Col>
                      <h6>IT Infrastructure</h6>
                      <NavDropdown.Item href="#action10">
                        Support
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#action11">
                        Consultancy
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#action12">
                        Implementation
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#action13">
                        Training
                      </NavDropdown.Item>
                    </Col>
                  </Row>
                </div>
              </NavDropdown>
              <Link to="/career" className="nav-item">
                <Nav.Link href="#insight" className="white-hover">
                  Career
                </Nav.Link>
              </Link>
              <Link to="/book-demo">
                <Button className="book-demo-btn">Book a Demo</Button>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;

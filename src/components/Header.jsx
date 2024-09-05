import React from 'react';
import { Navbar, Nav, Container, Button, Row, Col, NavDropdown } from 'react-bootstrap';
import logo from '../assets/img/logo.png';
import { MdCall } from "react-icons/md";

const Header = () => {
  return (
    <>
      {/* Top Bar */}
      <div className="top-bar py-2">
        <Container>
          <Row>
            <Col md={6}>
              <span className="contact-info">
                <span className='icon'><MdCall /></span> Need Quick Response? Call Us +234 333 000 0000
              </span>
            </Col>
            <Col md={6} className="text-end">
              <span className="working-hours">Monday - Friday / 8AM to 5PM</span>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Navbar */}
      <Navbar variant="dark" expand="lg" className="py-3 main-header">
        <Container>
          <Navbar.Brand href="#home">
            <img
              src={logo}
              alt="Bigfix"
              width="150"
              height="50"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className='toggler-nav'
          />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto navbar-item">
              <Nav.Link href="#company">Company</Nav.Link>
              <NavDropdown title="FastraSuite" id="fastra-suite-dropdown">
                <NavDropdown.Item href="#action/3.1">Feature 1</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Feature 2</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Feature 3</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Services" id="services-dropdown">
                <NavDropdown.Item href="#action/3.4">Service 1</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.5">Service 2</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.6">Service 3</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="#insight">Insight</Nav.Link>
            </Nav>
            <Button className="book-demo-btn">
              Book a Demo
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;

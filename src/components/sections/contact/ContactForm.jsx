import { forwardRef } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "../contact/ContactForm.css";
import ContactImage from "../../../assets/img/contactimg.png";

const ContactForm = forwardRef((props, ref) => {
  return (
    <section className="contact-section" ref={ref}>
      <Container>
        <Row>
          <Col md={6} className="text-section">
            <h5
              className="title"
              style={{ textAlign: "left", color: "#E5C541" }}
            >
              GET IN TOUCH
            </h5>
            <h3 className="titlePhrase get-in-touch">
              Easiest Way to Get <br /> Started
            </h3>
            <p className="description">
              We are delighted to meet you and to help provide solutions for any
              of the <br /> needs you may have.
            </p>
            <img src={ContactImage} alt="Client" className="client-image" />
          </Col>

          <Col md={6} className="form-section">
            <h3 className="titlePhrase contact">
              Contact Us Now to Get Free Quote <br /> from Our Experts!
            </h3>
            <Form>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Control type="text" placeholder="Your Name" />
              </Form.Group>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Control type="email" placeholder="Your Email Address" />
              </Form.Group>
              <Form.Group controlId="formMessage" className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={9}
                  placeholder="Your Message..."
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="submit-btn">
                Get a Free Quote!
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
});

// Set the display name for the Contact component
ContactForm.displayName = "ContactForm";

export default ContactForm;

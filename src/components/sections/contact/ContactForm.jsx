import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import emailjs from "emailjs-com";
import "../contact/ContactForm.css";
import ContactImage from "../../../assets/img/contactimg.png";

const ContactForm = React.forwardRef((props, ref) => {
  const form = useRef();
  const [formStatus, setFormStatus] = useState("");

  // Function to send email via EmailJS
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_5v9sdio", 
        "template_wxl6muq", 
        form.current,
        "faaKqshB0his5y_bUwrFZ" 
      )
      .then(
        (result) => {
          console.log(result.text);
          setFormStatus("Message sent successfully!");
          form.current.reset(); 
        },
        (error) => {
          console.log(error.text);
          setFormStatus("Failed to send the message.");
        }
      );
  };

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
            <Form ref={form} onSubmit={sendEmail}>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Your Email Address"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formMessage" className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={9}
                  name="message"
                  placeholder="Your Message..."
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="submit-btn">
                Get a Free Quote!
              </Button>
              <div className="form-status mt-2">{formStatus}</div>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
});

// Set the display name for the ContactForm component
ContactForm.displayName = "ContactForm";

export default ContactForm;

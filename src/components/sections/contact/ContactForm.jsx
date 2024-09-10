import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import emailjs from "emailjs-com";
import "../contact/ContactForm.css";
import ContactImage from "../../../assets/img/contactimg.png";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", formData); // Log form data

    const serviceID = "service_agom3yi"; // SMTP server
    const templateID = "template_g2rymic"; // Replace with your EmailJS template ID
    const publicKey = "isCnmUHyXvKklNirG";

    emailjs
      .send(serviceID, templateID, formData, publicKey)
      .then((response) => {
        console.log("EmailJS response:", response.text); // Log successful response
        alert("Your message has been sent successfully. Thank you for contacting us!");
        setFormData({ name: "", email: "", message: "" }); // Clear form
      })
      .catch((error) => {
        console.error("EmailJS error:", error); // Log error details
        setFormStatus("Failed to submit form. Please try again later.");
      });
  };

  return (
    <section className="contact-section">
      <Container>
        <Row>
          <Col md={6} className="text-section">
            <h5 className="title" style={{ textAlign: "left", color: "#E5C541" }}>
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
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email Address"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formMessage" className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={9}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
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
};

ContactForm.displayName = "ContactForm";

export default ContactForm;

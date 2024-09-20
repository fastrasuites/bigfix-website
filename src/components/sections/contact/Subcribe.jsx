import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import emailjs from "emailjs-com";
import "../contact/ContactForm.css";
import subcribeImg from "../../../assets/img/subcribe.png";

const SubcribeSection = () => {
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
    <section className="subcribe-section">
      <Container>
        <Row>
          <Col md={6} className="text-section">
            <img src={subcribeImg} alt="Client" className="client-image" />
          </Col>

          <Col md={6} className="form-section" style={{ backgroundColor: '#F1F4FF', borderRadius: '5px'}}>
            <h3 className="titlePhrase contact" style={{ color: "#000", fontWeight: '600'}}>
            Subscribe to Our Newsletter
            </h3> 
            <p className="sub-text">
                Receive our Latest News from Bigfix <br /> Integrated Technologies</p>
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
              <Form.Group controlId="formEmail" className="mb-5">
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email Address"
                  required
                />
              </Form.Group>
              
              <Button variant="primary" type="submit" className="submit-btn" style={{ marginTop: '25%'}}>
                Subcribe
              </Button>
              <div className="form-status mt-2">{formStatus}</div>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

SubcribeSection.displayName = "SubcribeSection";

export default SubcribeSection;

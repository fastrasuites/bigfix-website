import { useState } from "react";
import dashboard2 from "../../assets/img/dashboard2.png";
import emailjs from "emailjs-com";
import "./BookDemo.css";

const BookDemo = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    date: "",
    order_request: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    const serviceID = "service_agom3yi"; // SMTP server
    const templateID = "template_pz2xi5m"; // Replace with your EmailJS template ID
    const publicKey = "isCnmUHyXvKklNirG";

    emailjs
      .send(serviceID, templateID, formData, publicKey)
      .then((response) => {
        console.log(response.text);
        alert("Thank Yoy. Your demo request has been submitted successfully. We’ll be in touch soon to schedule your demo!");
      })
      .catch((error) => {
        console.log(error);
        alert(`Failed to submit form. Please try again later. `);
      });
  };

  return (
    <>
      <div className="container bookdemo">
        <div className="left-form-side ">
          <small className="subheading">KNOW FASTRASUITE FOR WHAT IT IS</small>
          <h4 className="heading">
            Love to Have a Feel of How FastraSuite Works?
          </h4>
          <p className="desc">
            We are delighted to meet you and to help provide solutions for any
            of the needs you may have
          </p>
          <img src={dashboard2} alt="dashboard" />
        </div>
        <div className="bookdemo-form">
          <h3 className="form-title">Book a Demo</h3>
          <form onSubmit={handleSubmit} className="">
            <input
              type="text"
              name="name"
              className="form-control mb-3"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              className="form-control mb-3"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="company"
              className="form-control mb-3"
              placeholder="Company name"
              value={formData.company}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="date"
              className="form-control mb-3"
              placeholder="Preferred Date dd/mm/yy"
              value={formData.date}
              onChange={handleChange}
              required
            />
            <textarea
              name="order_request"
              className="form-control mb-3"
              placeholder="Order request"
              rows="6"
              value={formData.orderRequest}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit" className="btn submit-btn w-100">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookDemo;

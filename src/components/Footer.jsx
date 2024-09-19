import { Container, Row, Col } from "react-bootstrap";
import facebook from "../assets/icons/facebook.png";
import twitter from "../assets/icons/twitter.png";
import linklden from "../assets/icons/linklden.png";
import instagram from "../assets/icons/instagram.png";
import { MdShareLocation } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { LuMailMinus } from "react-icons/lu";

function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={6} style={{ marginBottom: "30px" }}>
            <h3>
              Your ERP & Digital <br /> Transformation Partner
            </h3>
            <div className="contact-details">
              <br />
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  letterSpacing: "1px",
                }}
              >
                Contacts
              </p>
              <div className="info">
                <MdShareLocation className="icon" />{" "}
                <p>
                  8 Adelabu Street, Masha, Surulere, Lagos.
                  <br /> 8am - 5pm
                </p>
              </div>
              <div className="info">
                {" "}
                <FiPhone className="icon" />{" "}
                <p>
                  +234 805 623 5944 <br /> +234 808 989 2733
                </p>
              </div>
              <div className="info">
                {" "}
                <LuMailMinus className="icon" /> <p>info@bigfixtech.com</p>
              </div>
            </div>
          </Col>

          <Col md={3} style={{ marginBottom: "30px" }}>
            <h4>Navigation</h4>
            <ul className="footer-links">
              <li>
                <a href="#">Company</a>
              </li>
              <li>
                <a href="#">Insight</a>
              </li>
              <li>
                <a href="#">Services</a>
              </li>
              <li>
                <a href="#">FastraSuite</a>
              </li>
            </ul>
          </Col>

          <Col md={3} style={{ marginBottom: "10px" }}>
            <h4>Services</h4>
            <ul className="footer-links">
              <li>
                <a href="#">Cloud</a>
              </li>
              <li>
                <a href="#">Business Application</a>
              </li>
              <li>
                <a href="#">IT Infrastructure</a>
              </li>
            </ul>
            <div className="social-links">
              <a href="#" className="social-icon">
                <img src={facebook} alt="facebook" />
              </a>
              <a href="#" className="social-icon">
                <img src={twitter} alt="twitter" />
              </a>
              <a href="#" className="social-icon">
                <img src={linklden} alt="linklden" />
              </a>
              <a href="#" className="social-icon">
                <img src={instagram} alt="instagram" />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;

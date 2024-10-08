import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../client/client.css";
import Client1 from "../../../assets/img/client1.png";

function EmployeeTestimonial() {
  return (
    <section className="employee">
      <Container>
        <div className="employeeBlock">
          <span
            style={{
              color: "#E37016",
              fontSize: "20px",
              fontWeight: "bold",
              textTransform: "uppercase",
              marginBottom: "30px",
            }}
          >
            Testimonies
          </span>
          <h2 className="titlePhrase clientTitle">BigFix Employees</h2>
          <Row>
            <Col sm={12} md={6} lg={4}>
              <div className="testimonialCard">
                <img src={Client1} alt="Client" className="img" />
                <div>
                  <span className="star">★★★★★</span>
                  <p
                    className="desc"
                    style={{ textAlign: "left", fontSize: "14.5px" }}
                  >
                    At Bigfix Technologies, I’ve found a place where my career
                    growth is supported through mentorship and leadership
                    training programs.{" "}
                  </p>
                  <h4
                    style={{
                      fontSize: "1.5rem",
                      color: "#0A2F5A",
                      fontWeight: "600",
                    }}
                  >
                    Bunmi Doglas
                  </h4>
                </div>
              </div>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <div className="testimonialCard">
                <img src={Client1} alt="Client" className="img" />
                <div>
                  <span className="star">★★★★★</span>
                  <p
                    className="desc"
                    style={{ textAlign: "left", fontSize: "14.5px" }}
                  >
                    I’ve grown both personally and professionally, and it’s
                    exciting to be part of a team that’s always pushing the
                    envelope in the digital transformation field.
                  </p>
                  <h4
                    style={{
                      fontSize: "1.5rem",
                      color: "#0A2F5A",
                      fontWeight: "600",
                    }}
                  >
                    Micheal Samuel
                  </h4>
                </div>
              </div>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <div className="testimonialCard">
                <img src={Client1} alt="Client" className="img" />
                <div>
                  <span className="star">★★★★★</span>
                  <p
                    className="desc"
                    style={{ textAlign: "left", fontSize: "14.5px" }}
                  >
                    The projects are challenging and rewarding, and the
                    leadership team is always available to support you.{" "}
                  </p>
                  <h4
                    style={{
                      fontSize: "1.5rem",
                      color: "#0A2F5A",
                      fontWeight: "600",
                    }}
                  >
                    Olayinka Thomson
                  </h4>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
}

export default EmployeeTestimonial;

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../client/client.css";
import ClientImg from "../../../assets/img/client-img.png";
import Client1 from "../../../assets/img/client1.png";
import Client2 from "../../../assets/img/client2.png";
import Client3 from "../../../assets/img/client3.png";

function ClientTestimonialSection() {
  return (
    <section className="client">
      <Container>
        <Row>
          <Col md={12} sm={12} className="ClientLogo">
            <img src={ClientImg} alt="ClientLogo" />
          </Col>
        </Row>
        <div className="testimonialBlock">
          <h2 className="titlePhrase clientTitle">What Our Clients Say</h2>
          <Row>
            <Col sm={12} lg={6} xxl={4}>
              <div className="testimonialCard">
                <img src={Client1} alt="Client" className="img" />
                <div>
                  <span className="star">★★★★★</span>
                  <p
                    className="desc"
                    style={{
                      textAlign: "left",
                    }}
                  >
                    Partnering with them for our
                    <span> ERP implementation </span> was a game-changer.
                    We&apos;ve seen significant improvements.
                  </p>
                  <h4 style={{ fontSize: "1.5rem", color: "#4161E5" }}>
                    Luis August
                  </h4>
                </div>
              </div>
            </Col>
            <Col sm={12} lg={6} xxl={4}>
              <div className="testimonialCard">
                <img src={Client2} alt="Client" className="img" />
                <div>
                  <span className="star">★★★★★</span>
                  <p className="desc" style={{ textAlign: "left" }}>
                    Bigfix digital transformation services have empowered our
                    business to operate at a higher level.
                  </p>
                  <h4 style={{ fontSize: "1.5rem", color: "#4161E5" }}>
                    Dennis Samuel
                  </h4>
                </div>
              </div>
            </Col>
            <Col sm={12} lg={6} xxl={4}>
              <div className="testimonialCard">
                <img src={Client3} alt="Client" className="img" />
                <div>
                  <span className="star">★★★★★</span>
                  <p className="desc" style={{ textAlign: "left" }}>
                    The ERP solution they provided has completely transformed
                    our <br /> business operations.{" "}
                  </p>
                  <h4 style={{ fontSize: "1.5rem", color: "#4161E5" }}>
                    Bobbie Claire
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

export default ClientTestimonialSection;

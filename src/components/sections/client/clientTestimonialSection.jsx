import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../client/client.css';
import ClientImg from '../../../assets/img/client-img.png';
import Client1 from '../../../assets/img/client1.png';

function ClientTestimonialSection() {
  return (
    <section className="client">
    <Container>
      <Row>
        <Col md={12} sm={12} className='ClientLogo'>
        <img src={ClientImg} alt="ClientLogo" />
        </Col>
      </Row>
      <div className="testimonialBlock">
      <h2 className="titlePhrase clientTitle">What Our Clients Say</h2>
      <Row>
        <Col md={4} sm={12}>
          <div className="testimonialCard">
            <img src={Client1} alt="Client" className="img" />
            <div>
            <span className="star">★★★★★</span>
            <p className='desc' style={{textAlign: "left", fontSize: "14.5px"}}>Partnering with them for our ERP implementation was a game-changer. <br /> We've seen significant improvements. </p>
            <h4 style={{fontSize: "1.5rem", color: "#4161E5"}}>Luis August</h4>
            </div>
          </div>
          </Col>
          <Col md={4} sm={12}>
          <div className="testimonialCard">
            <img src={Client1} alt="Client" className="img" />
            <div>
          <span className="star">★★★★★</span>
          <p className='desc' style={{textAlign: "left", fontSize: "14.5px" }}>Bigfix digital transformation services have empowered our business to operate at a higher level.</p>
          <h4 style={{fontSize: "1.5rem", color: "#4161E5"}}>Dennis Samuel</h4>
          </div>
          </div>
          </Col>
          <Col md={4} sm={12}>
          <div className="testimonialCard">
            <img src={Client1} alt="Client" className="img" />
            <div>
          <span className="star">★★★★★</span>
          <p className='desc' style={{textAlign: "left", fontSize: "14.5px"}}>The ERP solution they provided has completely transformed our <br /> business operations. </p>
          <h4 style={{fontSize: "1.5rem", color: "#4161E5"}}>Bobbie Claire</h4>
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
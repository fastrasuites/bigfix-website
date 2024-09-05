import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../services/Services.css';
import service1 from '../../../assets/img/s1.png';
import service2 from '../../../assets/img/s2.png';
import service3 from '../../../assets/img/s3.png';
import service4 from '../../../assets/img/s4.png';
import service5 from '../../../assets/img/s5.png';
import service6 from '../../../assets/img/s6.png';
import Implementation from '../../../assets/img/implementation.png';
import Consultancy from '../../../assets/img/Consultancy.png';
import Training from '../../../assets/img/Training.png';
import support from '../../../assets/img/support.png';
import { GoArrowRight } from "react-icons/go";

function Services() {
  return (
    <section className='services'>
      <h3 className="title">OUR SERVICES</h3>
      <h3 className="titlePhrase header">Transform Your Company Digitally</h3>
      <p className="desc" style={{paddingBottom: '6%'}}>Posuere sed eu proin elementum nulla. Sed non blandit auctor consequat sit orci <br /> sem. Ultrices adipiscing dictumst purus convallis.</p>
    <Container>
      <Row style={{marginBottom: "30px"}}>
        <Col>
        <div className='service-card'>
          <img src={service1} alt="service1" />
        </div>
        </Col>
        <Col>
        <div className='service-card'>
          <img src={service2} alt="service2 Implementation" />
          <div className='action'>
            <p>Implementation</p>
            <GoArrowRight className='icon' />
          </div>
          <img src={Implementation} className='hover-text' alt="service2 Implementation" />
        </div>
        </Col>
        <Col>
        <div className='service-card'>
          <img src={service3} alt="service3" />
          <div className='action'>
            <p>Consultancy</p>
            <GoArrowRight className='icon' />
          </div>
          <img src={Consultancy} className='hover-text' alt="service2 Consultancy" />
        </div>
        </Col>
      </Row>
      <Row>
        <Col>
        <div className='service-card'>
          <img src={service4} alt="service4" />
          <div className='action'>
            <p>Support</p>
            <GoArrowRight className='icon' />
          </div>
          <img src={support} className='hover-text' alt="service2 support" />
        </div>
        </Col>
        <Col>
        <div className='service-card'>
          <img src={service5} alt="service5" />
          <div className='action'>
            <p>Traning</p>
            <GoArrowRight className='icon' />
          </div>
          <img src={Training} className='hover-text' alt="service2 Training" />
        </div>
        </Col>
        <Col>
        <div className='service-card'>
          <img src={service6} alt="service6" />
         
        </div>
        </Col>
      </Row>
    </Container>
    </section>
  );
}

export default Services;
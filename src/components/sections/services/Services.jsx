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
      <p className="desc" style={{paddingBottom: '6%'}}>Elevate your business with digital solutions that streamline operations, <br /> boost efficiency, and drive innovation. Embrace the future today.</p>
    <Container>
      <Row style={{marginBottom: "30px"}}>
        <Col md={4} sm={12}>
        <div className='service-card'>
          <img src={service1} width="100%"  alt="service1" />
        </div>
        </Col>
        <Col md={4} sm={12}>
        <div className='service-card'>
          <img src={service2} width="100%"  alt="service2 Implementation" />
          <div className='action'>
            <p>Implementation</p>
            <GoArrowRight className='icon' />
          </div>
          <img src={Implementation} width="100%"  className='hover-text' alt="service2 Implementation" />
        </div>
        </Col>
        <Col md={4} sm={12}>
        <div className='service-card'>
          <img src={service3} width="100%"  alt="service3" />
          <div className='action'>
            <p>Consultancy</p>
            <GoArrowRight className='icon' />
          </div>
          <img src={Consultancy} width="100%"  className='hover-text' alt="service2 Consultancy" />
        </div>
        </Col>
      </Row>
      <Row>
        <Col md={4} sm={12}>
        <div className='service-card'>
          <img src={service4} width="100%"  alt="service4" />
          <div className='action'>
            <p>Support</p>
            <GoArrowRight className='icon' />
          </div>
          <img src={support} width="100%"  className='hover-text' alt="service2 support" />
        </div>
        </Col>
        <Col md={4} sm={12}>
        <div className='service-card'>
          <img src={service5} width="100%"  alt="service5" />
          <div className='action'>
            <p>Traning</p>
            <GoArrowRight className='icon' />
          </div>
          <img src={Training} width="100%"  className='hover-text' alt="service2 Training" />
        </div>
        </Col>
        <Col md={4} sm={12}>
        <div className='service-card'>
          <img src={service6} width="100%"  alt="service6" />
         
        </div>
        </Col>
      </Row>
    </Container>
    </section>
  );
}

export default Services;
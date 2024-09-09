import { forwardRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../../sections/moreAbout/MoreAbout.css";

const MoreAbout = forwardRef((props, ref) => {
  return (
    <Container fluid className="section" id="aboutUs" ref={ref}>
      <Row>
        <Col>
          <h3 className="title">MORE ABOUT US</h3>
          <h3 className="titlePhrase">
            We provide effective and efficient <br /> support services that
            guarantee <br />
            seamless operations
          </h3>
          <p className="desc">
            Bigfix Tech specializes in delivering big, powerful,and  tailored IT
            fixes that empower businesses <br />
            to excel. From seamless ERP Implementation to rock-solid IT
            Infrastructure setup, we ensure <br />
            your technology runs smoothly and drives success. Our expert
            Training programs give your team <br />
            the skills they need, while our Business Automation solutions
            streamline your operations, fixing <br />
            inefficiencies for peak performance. With cutting-edge Cloud
            Solutions and top-notch Security <br />
            Services, we safeguard your data and fine-tune your IT environment,
            enabling your business to <br /> thrive in today’s digital
            landscape.
          </p>
        </Col>
      </Row>
    </Container>
  );
});

// Set the display name for the Contact component
MoreAbout.displayName = "MoreAbout";

export default MoreAbout;

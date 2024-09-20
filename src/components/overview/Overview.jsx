import "../ourCompany/OurCompany.css";
import phonePerson from "../../assets/img/phone-person.png";

const Overview = () => {
  return (
    <section className="our-company-section container my-4 mt-4">
      <div className="row">
        <article className="col-12 col-md-12 col-lg-6 py-4">
          {/* details go here */}
          <div className="section1">
            <small className="subheading">BIGFIX OVERVIEW</small>
            <h3 className="heading">
              We provide effective and efficient support services that guarantee
              seamless operations
            </h3>
            <p className="desc">
              Bigfix Tech specializes in delivering big, powerful, and tailored
              IT fixes that <br /> empower businesses to excel. From seamless ERP
              Implementation to <br /> rock-solid IT Infrastructure setup, we ensure
              your technology runs <br /> smoothly and drives success.
            </p>
          </div>
          
        </article>

        <article className="col-12 col-md-12 col-lg-6 py-4">
          <ul className="section2">
            <li className="vision">Our Vision</li>
            <p className="desc ">
              Our Vision is to be a successful global information technology
              company trusted by its customers for service excellence, caring
              for its employees and collaborating with our customers to deliver
              innovative and value driven ICT products and services.
            </p>
            <li className="mission">Our Mission</li>
            <p className="desc">
              We&apos;re on a mission to exceed our customers’ expectations
              with innovative <br /> and bespoke Technology solutions.
            </p>
            <hr />
          </ul>
        </article>
      </div>
      <p style={{textAlign: 'center'}}><button className="explore-button">Explore Open Roles</button></p>
    </section>
  );
};

export default Overview;

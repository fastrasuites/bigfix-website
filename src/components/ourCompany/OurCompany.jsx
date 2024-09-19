import "./OurCompany.css";
import phonePerson from "../../assets/img/phone-person.png";

const OurCompany = () => {
  return (
    <section className="our-company-section container my-4">
      <div className="row">
        <article className="col-12 col-md-12 col-lg-6 py-4">
          {/* details go here */}
          <div className="section1">
            <small className="subheading">OUR COMPANY</small>
            <h3 className="heading">
              We provide effective and efficient support services that guarantee
              seamless operations
            </h3>
            <p className="desc">
              Bigfix Tech specializes in delivering big, powerful, and tailored
              IT fixes that empower businesses to excel. From seamless ERP
              Implementation to rock-solid IT Infrastructure setup, we ensure
              your technology runs smoothly and drives success.
            </p>
          </div>
          <ul className="section2">
            <li className="vision">Our Vision</li>
            <p className="desc ">
              Our Vision is to be a successful global information technology
              company trusted by its customers for service excellence, caring
              for its employees and collaborating with our customers to deliver
              innovative and value driven ICT products and services.”.
            </p>
            <li className="mission">Our Mission</li>
            <p className="desc">
              We &apos; re on a mission to exceed our customers’ expectations
              with innovative and bespoke Technology solutions.
            </p>
            <hr />
          </ul>
        </article>

        {/* Gap for larger screens */}
        <div className="d-none d-lg-block col-lg-1"></div>

        <figure className="col-12 col-md-12 col-lg-5 py-4">
          <img
            src={phonePerson}
            alt="person pressing phone"
            className="img-phoneperson"
          />
        </figure>
      </div>
    </section>
  );
};

export default OurCompany;

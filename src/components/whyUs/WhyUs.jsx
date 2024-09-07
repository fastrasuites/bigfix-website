import progressBar from "../../assets/img/ProgressBar.png";
import fastraDashboard from "../../assets/img/fastra-dashboard.png";
import "./whyUs.css";
const WhyUs = () => {
  return (
    <section className="py-5  why-us">
      <div className="why-us-wrap">
        {/* First Box with Background Image */}

        <div className="bg-image">
          <img src={fastraDashboard} alt="" />
        </div>

        {/* Second Box with Subtitle, Heading, Description, and Image */}
        <div className="why-us-article">
          <small className="why-us-subtitle">Why FASTRASUITE</small>
          <h2 className="my-3 why-us-heading">The Benefits of FastraSuite</h2>
          <p className="mb-4 why-us-desc">
            Fastra integrates all your business processes into one seamless
            system, giving you real-time insights, enhanced productivity, and
            the agility to stay ahead in a competitive market.
          </p>
          <img
            src={progressBar}
            alt="Descriptive Alt"
            className=" progress-bar"
          />
        </div>
      </div>
    </section>
  );
};

export default WhyUs;

import send from "../../assets/img/send.svg";
import thumbsUp from "../../assets/img/thumbs-up.svg";
import userCheck from "../../assets/img/user-check.svg";
import "./heroCard.css";

const HeroCard = () => {
  return (
    <div className="container cards">
      {/* card one */}
      <div className="card white-card">
        <img src={userCheck} alt="icon checked" className="card-icon" />
        <h4 className="card-title">Expert Guidance</h4>
        <p className="card-desc">
          Leverage the wisdom of industry leaders. Our team of seasoned experts
          is here to guide you through every decision.
        </p>
      </div>

      {/* card two */}
      <div className="card dark-blue-card">
        <img src={send} alt="icon checked" className="card-icon" />
        <h4 className="card-title">Tailored Solutions</h4>
        <p className="card-desc">
          One size doesn’t fit all. That’s why we offer customized solutions
          that are specifically designed to meet your unique needs and
          challenges.
        </p>
      </div>

      {/* card three */}
      <div className="card white-card">
        <img src={thumbsUp} alt="thumbs up" className="card-icon" />
        <h4 className="card-title">Streamlined Process</h4>
        <p className="card-desc">
          Our streamlined processes are designed to save you time and resources,
          ensuring that every step is clear, quick, and effective.
        </p>
      </div>
    </div>
  );
};

export default HeroCard;

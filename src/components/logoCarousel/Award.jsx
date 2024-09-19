import "./LogoCarousel.css";
import ultra from "../../assets/awards/ultra.svg";
import ultimate from "../../assets/awards/ultimate.svg";
import mega from "../../assets/awards/mega.svg";
import qc from "../../assets/awards/qc.svg";
import logoipsum from "../../assets/awards/logoipsum.svg";

const Award = () => {
  let logos = [ultra, qc, ultimate, mega, logoipsum];
  return (
    <div className="logo-carousel">
      <div className="logo-carousel-track">
        {logos.map((logo, index) => (
          <div className="logo-carousel-item" key={index}>
            <img src={logo} alt={`Partner Logo ${index + 1}`} />
          </div>
        ))}
        {logos.map((logo, index) => (
          <div className="logo-carousel-item" key={`duplicate-${index}`}>
            <img src={logo} alt={`Partner Logo ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Award;

import "./LogoCarousel.css";
import waec from "../../assets/companyLogos/waec.svg";
import mtn from "../../assets/companyLogos/mtn.svg";
import cyberspace from "../../assets/companyLogos/cyberspace.svg";
import alm from "../../assets/companyLogos/alm.svg";
import dataNetwork from "../../assets/companyLogos/data-network.svg";
import bcl from "../../assets/companyLogos/bcl.svg";
import bluechip from "../../assets/companyLogos/blue-chip.svg";
import hospitalita from "../../assets/companyLogos/hospitalita.svg";
import auslind from "../../assets/companyLogos/auslind.svg";

const LogoCarousel = () => {
  let logos = [
    waec,
    mtn,
    cyberspace,
    alm,
    dataNetwork,
    bcl,
    bluechip,
    hospitalita,
    auslind,
    // Add more logo URLs as needed
  ];

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

export default LogoCarousel;

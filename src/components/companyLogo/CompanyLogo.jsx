import "./CompanyLogo.css";
import clientLogos from "../../assets/img/client-logos.png";
import microsoft from "../../assets/companyLogos2/microsoft.png";
import zoho from "../../assets/companyLogos2/zoho.png";
import dell from "../../assets/companyLogos2/dell.png";
import hp from "../../assets/companyLogos2/hp.png";
import ibm from "../../assets/companyLogos2/ibm.png";
import cisco from "../../assets/companyLogos2/cisco.png";
import checkpoint from "../../assets/companyLogos2/checkpoint.png";
import sophos from "../../assets/companyLogos2/sophos.png";
import veeam from "../../assets/companyLogos2/veeam.png";
import symantec from "../../assets/companyLogos2/symantec.png";

const CompanyLogo = () => {
  const logos = [
    microsoft,
    dell,
    zoho,
    hp,
    ibm,
    cisco,
    checkpoint,
    sophos,
    veeam,
    symantec,
  ];

  return (
    <div className="container">
      <div style={{ marginTop: "48px" }}>
        <img src={clientLogos} alt="" className="clientLogo" />
      </div>
      {/* <div className="logos-grid-container">
        {logos.map((logo) => (
          <img src={logo} alt="" key={logo} className="logo" />
        ))}
      </div> */}
    </div>
  );
};

export default CompanyLogo;

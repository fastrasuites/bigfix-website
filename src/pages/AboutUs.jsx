import styled from "styled-components";
import Award from "../components/logoCarousel/Award";
import OurCompany from "../components/ourCompany/OurCompany";
import OurStory from "../components/ourStory/OurStory";
import ContactForm from "../components/sections/contact/ContactForm";
import bannerUrl from "../assets/img/aboutus-hero.png";
import CompanyLogo from "../components/companyLogo/CompanyLogo";

const AboutUs = () => {
  return (
    <div style={{ fontFamily: `"PT Sans", sans-serif` }}>
      <AboutUsBanner />
      <CompanyLogo />
      {/* <Award /> */}

      <OurCompany />

      <OurStory />
      <ContactForm />
    </div>
  );
};

export default AboutUs;

const AboutUsBanner = styled.section`
  background-image: url(${bannerUrl});
  background-repeat: no-repeat;
  background-size: cover;
  height: 392px;
  background-position: center;

  @media (max-width: 425px) {
    background-position: 55% 40%;
  }
`;

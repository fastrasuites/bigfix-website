import styled from "styled-components";
import Overview from "../components/overview/Overview";
import BenefitsSection from "../components/bigfixBenefit/BenefitsSection";
import CareerHero from "../components/careerHero/CareerHero";
import SubcribeSection from "../components/sections/contact/Subcribe";
import EmployeeTestimonial from "../components/sections/client/EmployeeTestimonials";

const Career = () => {
  return (
    <div style={{ fontFamily: `"PT Sans", sans-serif` }}>
      <CareerHero />
      <Overview />
      <BenefitsSection />
      <EmployeeTestimonial />
      <SubcribeSection />
    </div>
  );
};

export default Career;

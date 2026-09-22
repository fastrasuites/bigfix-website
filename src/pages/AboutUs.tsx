import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImageAbout from "../assets/bgimageabout.png";
import bigfixLogo from "../assets/bigfixlogopng.png";
import AboutHero from "../components/AboutUs/AboutHero";
import CtaSection from "../components/AboutUs/CtaSection";
import HowWeWorkSection from "../components/AboutUs/HowWeWorkSection";
import OurApproachSection from "../components/AboutUs/OurApproachSection";
import VisionMissionSection from "../components/AboutUs/VisionMissionSection";
import WhoWeAreSection from "../components/AboutUs/WhoWeAreSection";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import { ABOUT_US_TOP_SECTION_ID } from "../constants/links";
import { aboutStats, approachCards, visionMissionCards, workSteps } from "../data/about";
import {
  aboutSupportLink,
  footerApplications,
  footerBottomLinks,
  footerCompanyLinks,
  footerContact,
  footerCopyright,
  footerInfrastructure,
} from "../data/footer";
import { aboutMobileNavLinks, navApplications, navServices } from "../data/navigation";
import { useNavigationState } from "../hooks/useNavigationState";
import { useSmoothScroll } from "../hooks/useSmoothScroll";

const scrollToAboutTop = () => {
  document.getElementById(ABOUT_US_TOP_SECTION_ID)?.scrollIntoView({ behavior: "smooth" });
};

/**
 * About page: company story, vision and mission, process, approach and CTA.
 */
const AboutUs = (): JSX.Element => {
  useSmoothScroll();
  useEffect(() => {
    scrollToAboutTop();
  }, []);
  const navigate = useNavigate();
  const {
    isDropdownOpen,
    isServicesOpen,
    isMobileMenuOpen,
    setDropdownOpen,
    setServicesOpen,
    toggleMobileMenu,
  } = useNavigationState();

  return (
    <div id="about-us-top" className="w-full min-h-screen bg-white font-sans selection:bg-[#E37016] selection:text-white flex flex-col">
      <Header
        logoSrc={bigfixLogo}
        navApplications={navApplications}
        services={navServices}
        isDropdownOpen={isDropdownOpen}
        isServicesOpen={isServicesOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        onDropdownChange={setDropdownOpen}
        onServicesChange={setServicesOpen}
        onBookDemo={() => navigate("/book-demo")}
        onMobileMenuToggle={toggleMobileMenu}
        tagline="Integrated Technologies"
        mobileLinks={aboutMobileNavLinks}
      />

      <AboutHero backgroundImage={bgImageAbout} />

      <WhoWeAreSection />

      <VisionMissionSection cards={visionMissionCards} />

      <HowWeWorkSection steps={workSteps} />

      <OurApproachSection cards={approachCards} stats={aboutStats} />

      <CtaSection />

      <Footer
        logoSrc={bigfixLogo}
        contact={footerContact}
        applications={footerApplications}
        infrastructure={footerInfrastructure}
        companyLinks={footerCompanyLinks}
        bottomLinks={footerBottomLinks}
        copyright={footerCopyright}
        supportLink={aboutSupportLink}
      />
    </div>
  );
};

export default AboutUs;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImageHome from "../assets/bgimagehomepage.png";
import bigfixLogo from "../assets/bigfixlogopng.png";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import CloudOneSection from "../components/Home/CloudOneSection";
import HomeHero from "../components/Home/HomeHero";
import ModularInfrastructure from "../components/Home/ModularInfrastructure";
import ModuleDeepDive from "../components/Home/ModuleDeepDive";
import RequestReviewSection from "../components/Home/RequestReviewSection";
import SolutionsAccordion from "../components/Home/SolutionsAccordion";
import { REQUEST_REVIEW_SECTION_ID } from "../constants/links";
import {
  footerApplications,
  footerBottomLinks,
  footerCompanyLinks,
  footerContact,
  footerCopyright,
  footerInfrastructure,
  footerSocials,
  homeSupportLink,
} from "../data/footer";
import {
  cloudFeatures,
  modularCards,
  moduleFeatures,
  requestReviewBenefits,
  solutionsData,
} from "../data/home";
import { navApplications, navServices } from "../data/navigation";
import { useNavigationState } from "../hooks/useNavigationState";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { createScrollHandler } from "../utils/scroll";

const scrollToRequestReview = createScrollHandler(REQUEST_REVIEW_SECTION_ID);

/**
 * Landing page: hero, product accordion, modular positioning, module
 * deep-dive, review form, CloudOne and the footer.
 */
const Home = (): JSX.Element => {
  useSmoothScroll();
  useEffect(() => {
    if (window.location.hash) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({
        behavior: "smooth",
      });
    }
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
    <div className="w-full min-h-screen bg-white font-sans selection:bg-[#E37016] selection:text-white flex flex-col">
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
      />

      <HomeHero
        badge="BUSINESS SOFTWARE FOR COMPLEX OPERATIONS"
        titleLine1="Business Applications"
        titleLine2={
          <>
            Built for the Way <br className="hidden md:block" /> You Work
          </>
        }
        description="BigFix develops advanced enterprise software platforms for financial management, lifecycle project cost orchestration, and corporate operations. Choose the solution that meets your needs today and add more as your business grows."
        buttonLabel="Request a Review"
        backgroundImage={bgImageHome}
        onButtonClick={scrollToRequestReview}
      />

      <SolutionsAccordion solutions={solutionsData} />

      <ModularInfrastructure
        eyebrow="WHY MODULAR INFRASTRUCTURE WORKS"
        titleLine1="Start With What You Need."
        titleLine2="Grow When You're Ready."
        paragraphs={[
          "Traditional organizations often rely on multiple software systems that must be connected before they can work together effectively.",
          "BigFix takes a modular approach. Organizations can start with the application that addresses their most critical operational need and expand their technology ecosystem as their requirements grow.",
        ]}
        cards={modularCards}
      />

      <ModuleDeepDive
        titleLine1="OptimaOne: Asset & Investment"
        titleLine2="Management Module"
        description="Manage investments, assets, and profit-sharing with greater transparency and control."
        features={moduleFeatures}
        id="optimaone-section"
      />

      <RequestReviewSection benefits={requestReviewBenefits} />

      <CloudOneSection features={cloudFeatures} />

      <Footer
        logoSrc={bigfixLogo}
        contact={footerContact}
        socials={footerSocials}
        applications={footerApplications}
        infrastructure={footerInfrastructure}
        companyLinks={footerCompanyLinks}
        bottomLinks={footerBottomLinks}
        copyright={footerCopyright}
        supportLink={homeSupportLink}
      />
    </div>
  );
};

export default Home;

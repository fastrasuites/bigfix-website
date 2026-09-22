import { Link } from "react-router-dom";
import bigfixLogo from "../assets/bigfixlogopng.png";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import { navApplications, navServices } from "../data/navigation";
import {
  footerApplications,
  footerBottomLinks,
  footerCompanyLinks,
  footerContact,
  footerCopyright,
  footerInfrastructure,
  footerSocials,
} from "../data/footer";
import { useNavigationState } from "../hooks/useNavigationState";

const clientLogos = ["OptimaOne", "FastraSuite", "CloudOne", "TechPartner", "FinServe"];

const bulletPoints = [
  "Strategic IT consulting services to give you a winning advantage.",
  "Information security services.",
  "Cloud services and infrastructure management.",
  "Workflow and business process automation.",
  "Seamless integration with OptimaOne, FastraSuite, and EnterpriseOne.",
];

const statData = {
  title: "Strategic IT Consulting",
  stat: "70%",
  subtext: "Reduction in operational downtime for BigFix ERP clients.",
};

const ITConsultancy = (): JSX.Element => {
  const { isDropdownOpen, isServicesOpen, isMobileMenuOpen, setDropdownOpen, setServicesOpen, toggleMobileMenu } = useNavigationState();

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        logoSrc={bigfixLogo}
        navApplications={navApplications}
        services={navServices}
        isDropdownOpen={isDropdownOpen}
        isServicesOpen={isServicesOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        onDropdownChange={setDropdownOpen}
        onServicesChange={setServicesOpen}
        onBookDemo={() => {}}
        onMobileMenuToggle={toggleMobileMenu}
      />

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-24">
          <h1 className="text-[#0A2F5A] text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            IT Consultancy
          </h1>
          <p className="text-[#A8A8A8] text-lg mb-10 max-w-lg">
            We will help evaluate your company's technology infrastructure to achieve strategic goals that have been defined. Standalone, industry-grade software solutions designed to scale complex corporate operations.
          </p>
          <Link
            to="/book-demo"
            className="inline-block bg-[#E37016] hover:bg-[#c56012] text-white font-semibold text-lg px-8 py-4 rounded-full transition-colors w-fit"
          >
            Request a Project
          </Link>
        </div>
        <div className="w-full lg:w-1/2 min-h-[300px] lg:min-h-[500px] bg-cover bg-center rounded-tl-3xl lg:rounded-tl-none lg:rounded-br-3xl" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&q=80')" }}>
        </div>
      </section>

      {/* Trusted by Strip */}
      <section className="bg-[#0A2F5A] py-8">
        <div className="max-w-7xl mx-auto px-8">
          <h3 className="text-center text-white/60 text-sm font-medium uppercase tracking-wider mb-8">
            Trusted by 100+ Partners & Customers
          </h3>
          <div className="flex justify-center items-center gap-12 flex-wrap">
            {clientLogos.map((name) => (
              <span key={name} className="text-white/40 text-xl font-bold tracking-wide grayscale hover:grayscale-0 transition-all duration-300">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 1: Get Expert Advice */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 lg:flex-row-reverse">
            <div className="w-full lg:w-1/2">
              <h2 className="text-[#0A2F5A] text-3xl font-bold mb-6">Get expert advice</h2>
              <ul className="space-y-4 mb-8">
                {bulletPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="text-[#00B4D8] text-xl flex-shrink-0 mt-0.5">✓</span>
                    <span className="text-[#A8A8A8] text-base leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/book-demo"
                className="inline-block bg-[#E37016] hover:bg-[#c56012] text-white font-semibold text-lg px-8 py-4 rounded-full transition-colors"
              >
                Request a Project
              </Link>
            </div>
            <div className="w-full lg:w-1/2 relative">
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80"
                alt="Person coding"
                className="w-full rounded-2xl shadow-xl"
              />
              <div className="absolute bottom-4 left-4 bg-white rounded-2xl p-6 shadow-xl max-w-[280px]">
                <h4 className="text-[#0A2F5A] font-bold text-lg mb-1">{statData.title}</h4>
                <p className="text-[#0A2F5A] text-3xl font-bold mb-1">{statData.stat}</p>
                <p className="text-[#A8A8A8] text-sm">{statData.subtext}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/Support Strip */}
      <section className="bg-[#F7F7F7] py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div>
                <h3 className="text-[#0A2F5A] text-xl font-bold mb-1">Have any questions? Talk to us</h3>
                <Link
                  to="/book-demo"
                  className="inline-block bg-[#0A2F5A] hover:bg-[#082044] text-white font-semibold px-6 py-3 rounded-full transition-colors"
                >
                  Book a callback
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <h4 className="text-[#0A2F5A] font-bold mb-1">24/7 Customer support</h4>
                <p className="text-[#A8A8A8] text-sm">+234 805 623 5944</p>
                <p className="text-[#A8A8A8] text-sm">+234 808 989 6733</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA Banner */}
      <section className="bg-[#0A2F5A] py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white text-2xl font-bold">Run your business better with the right software solution</h3>
            </div>
            <div>
              <Link
                to="/book-demo"
                className="inline-block bg-[#E37016] hover:bg-[#c56012] text-white font-semibold px-8 py-4 rounded-full transition-colors"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer
        logoSrc={bigfixLogo}
        contact={footerContact}
        socials={footerSocials}
        applications={footerApplications}
        infrastructure={footerInfrastructure}
        companyLinks={footerCompanyLinks}
        bottomLinks={footerBottomLinks}
        copyright={footerCopyright}
      />
    </div>
  );
};

export default ITConsultancy;

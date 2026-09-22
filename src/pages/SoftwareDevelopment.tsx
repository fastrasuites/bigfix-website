import { useState } from "react";
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

const accordionItems = [
  {
    category: "Mobile Development",
    items: ["iOS", "Android", "Hybrid", "Native"],
  },
  {
    category: "Web Development",
    items: ["React", "Angular", "Vue.js", "Node.js"],
  },
  {
    category: "Cloud & DevOps",
    items: ["AWS", "Azure", "Google Cloud", "CI/CD Pipelines"],
  },
  {
    category: "Data & Analytics",
    items: ["SQL", "NoSQL", "Power BI", "Machine Learning"],
  },
];

const techItems = [
  { name: "Blockchain Technology", desc: "Use blockchain to secure enterprise transactions and ensure data integrity across distributed networks." },
  { name: "Augmented Reality", desc: "Deliver immersive AR experiences that transform how enterprises visualize and interact with data." },
  { name: "Artificial Intelligence", desc: "Use AI to automate complex financial processes and gain deep insights from your enterprise data." },
  { name: "Internet Of Things", desc: "Connect and manage IoT devices to collect real-time data and optimize operational efficiency." },
  { name: "Cloud Computing", desc: "Leverage scalable cloud infrastructure to deploy enterprise applications with maximum uptime and flexibility." },
  { name: "API Integration", desc: "Seamlessly integrate third-party services and systems through robust API management and orchestration." },
];

const solutions = [
  {
    title: "Custom Enterprise Software Development",
    desc: "Build robust, secure, and tailored software solutions that meet your specific business needs and drive digital transformation.",
  },
  {
    title: "Enterprise Software Integration",
    desc: "Enhance your enterprise software infrastructure with seamless integration, data synchronization, and API management.",
  },
  {
    title: "Legacy Application Modernization",
    desc: "Increase the productivity of your operations and maximize your profitability by modernizing your legacy applications.",
  },
  {
    title: "Application Portfolio Consolidation",
    desc: "Streamline and optimize your application portfolio by eliminating redundant systems and aligning with business goals.",
  },
];

const processSteps = [
  {
    title: "Analyze your requirements",
    desc: "Analyze your requirements, design, and prototype your enterprise application.",
  },
  {
    title: "Build your enterprise application",
    desc: "Use flow methodology, build, test, and deploy your enterprise application.",
  },
  {
    title: "Support and maintenance",
    desc: "Perform continuous application and server monitoring, and provide ongoing support.",
  },
];

const clientLogos = ["TechCorp", "FinServe", "GlobalBank", "DataSys", "CloudNet"];

const SoftwareDevelopment = (): JSX.Element => {
  const { isDropdownOpen, isServicesOpen, isMobileMenuOpen, setDropdownOpen, setServicesOpen, toggleMobileMenu } = useNavigationState();
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

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
        <div className="w-full lg:w-[55%] bg-[#0A2F5A] flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-24">
          <h1 className="text-white text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Enterprise Software Development
          </h1>
          <p className="text-white/70 text-lg mb-10 max-w-lg">
            We help you build enterprise software solutions that scale complex corporate operations.
          </p>
          <Link
            to="/book-demo"
            className="inline-block bg-[#E37016] hover:bg-[#c56012] text-white font-semibold text-lg px-8 py-4 rounded-full transition-colors w-fit"
          >
            Request a Demo
          </Link>
        </div>
        <div className="w-full lg:w-[45%] min-h-[300px] lg:min-h-[500px] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80')" }}>
        </div>
      </section>

      {/* Trusted by Strip */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-8">
          <h3 className="text-center text-[#A8A8A8] text-sm font-medium uppercase tracking-wider mb-8">
            Trusted by 100+ Partners & Customers
          </h3>
          <div className="flex justify-center items-center gap-12 flex-wrap">
            {clientLogos.slice(0, 5).map((name) => (
              <span key={name} className="text-[#A8A8A8] text-xl font-bold tracking-wide">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-[#0A2F5A] text-3xl font-bold text-center mb-4">
            Success stories from our clients and partners
          </h2>
          <p className="text-[#A8A8A8] text-center mb-12 max-w-2xl mx-auto">
            We have successfully developed and deployed enterprise applications for reputable companies in various sectors.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {clientLogos.map((name) => (
              <div
                key={name}
                className="bg-[#F7F7F7] rounded-2xl flex items-center justify-center h-32 grayscale hover:grayscale-0 transition-all duration-300 hover:shadow-lg"
              >
                <span className="text-[#0A2F5A] font-bold text-lg">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Enterprise Software Solutions */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-[#0A2F5A] text-3xl font-bold text-center mb-4">
            Our enterprise software solutions
          </h2>
          <p className="text-[#A8A8A8] text-center mb-12 max-w-3xl mx-auto">
            Your business needs a reliable enterprise software solution to support your many operations. It needs to scale, integrate with existing systems, and provide a seamless user experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solutions.map((sol) => (
              <div
                key={sol.title}
                className="bg-white border border-[#E0E0E0] rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-[#0A2F5A] text-xl font-bold mb-3">{sol.title}</h3>
                <p className="text-[#A8A8A8] text-sm leading-relaxed">{sol.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Latest Tech */}
      <section className="bg-[#0A2F5A] py-16">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-white text-3xl font-bold text-center mb-4">The Latest Tech</h2>
          <p className="text-white/70 text-center mb-12 max-w-2xl mx-auto">
            BigFix is always on the lookout for new technologies to provide state-of-the-art enterprise software solutions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techItems.map((tech) => (
              <div
                key={tech.name}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-300"
              >
                <h3 className="text-white text-lg font-bold mb-2">{tech.name}</h3>
                <p className="text-white/60 text-sm">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Accordion */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-[#0A2F5A] text-3xl font-bold text-center mb-4">
            Capabilities of our enterprise Software Developers
          </h2>
          <p className="text-[#A8A8A8] text-center mb-12 max-w-2xl mx-auto">
            Our enterprise software developers have the knowledge, niche skills, and experience to build you a solid software solution.
          </p>
          <div className="max-w-3xl mx-auto">
            {accordionItems.map((item, index) => (
              <div key={item.category} className="border border-[#E0E0E0] rounded-xl mb-2 overflow-hidden">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex justify-between items-center px-6 py-4 bg-[#F7F7F7] hover:bg-[#E8E8E8] transition-colors"
                >
                  <span className="text-[#0A2F5A] font-semibold text-lg">{item.category}</span>
                  <svg
                    className={`w-5 h-5 text-[#0A2F5A] transition-transform duration-300 ${openAccordion === index ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openAccordion === index && (
                  <div className="px-6 py-4 bg-white flex flex-wrap gap-3">
                    {item.items.map((i) => (
                      <span key={i} className="bg-[#F7F7F7] text-[#0A2F5A] text-sm font-medium px-4 py-2 rounded-full">
                        {i}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/book-demo"
              className="inline-block bg-[#00B4D8] hover:bg-[#0099b3] text-white font-semibold text-lg px-8 py-4 rounded-full transition-colors"
            >
              Request a proposal
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Showcase */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="relative flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&q=80"
              alt="Developer working on tablet"
              className="w-full max-w-2xl rounded-2xl shadow-xl"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#0A2F5A] text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
              <span className="text-lg">🍎</span>
              <span className="font-semibold text-sm">iOS</span>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#0A2F5A] text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
              <span className="text-lg">🤖</span>
              <span className="font-semibold text-sm">Android</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-[#0A2F5A] text-3xl font-bold text-center mb-4">
            Our enterprise software development process
          </h2>
          <p className="text-[#A8A8A8] text-center mb-12 max-w-2xl mx-auto">
            We create processes that ensure high productivity and efficiency for your SME or enterprise solution.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {processSteps.map((step, index) => (
              <div key={step.title} className="bg-[#F7F7F7] rounded-2xl p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-[#0A2F5A] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-[#0A2F5A] text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-[#A8A8A8] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Callout */}
      <section className="bg-[#0A2F5A] py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80"
                alt="Team meeting"
                className="w-full rounded-2xl shadow-xl"
              />
            </div>
            <div className="w-full lg:w-1/2 text-white">
              <h2 className="text-3xl font-bold mb-4">Tell us about your project</h2>
              <p className="text-white/70 text-lg mb-8">
                Let's discuss about your project with us, we will help you provide a solution.
              </p>
              <Link
                to="/book-demo"
                className="inline-block bg-[#E37016] hover:bg-[#c56012] text-white font-semibold text-lg px-8 py-4 rounded-full transition-colors"
              >
                Request a Proposal
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

export default SoftwareDevelopment;

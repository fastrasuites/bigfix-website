import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import bgImageAbout from "../assets/bgimageabout.png";
import bigfixLogo from "../assets/bigfixlogopng.png";

const AboutUs = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  // Dropdown data for Navbar
  const navApplications = [
    {
      title: "Optima One",
      subtitle: "Core Banking, Asset & Investment Management",
      description:
        "Equity-backed deposit accounts, profit-share calculation, and fund ledgering",
      link: "#", // Yet to be live
      icon: (
        <svg
          className="w-5 h-3.25 text-[#00B4D8] mt-1"
          viewBox="0 0 24 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="1" y="2" width="22" height="12" rx="2" />
          <path d="M1 6h22" />
        </svg>
      ),
    },
    {
      title: "FastraSuite",
      subtitle: "Project Costing & Shadow Ledger",
      description:
        "Advanced margin tracking and parallel sub-accounting. Plugs into any existing ERP.",
      link: "https://www.fastrasuite.com/",
      icon: (
        <svg
          className="w-5 h-[13px] text-[#00B4D8] mt-1"
          viewBox="0 0 24 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 1h18v14H3z" />
          <path d="M7 4h10M7 8h10M7 12h6" />
        </svg>
      ),
    },
    {
      title: "EnterpriseOne",
      subtitle: "Corporate ERP Suite",
      description:
        "General ledger, procurement, asset management, and financial audits.",
      link: "https://www.enterpriseone.com.ng/",
      icon: (
        <svg
          className="w-5 h-[13px] text-[#00B4D8] mt-1"
          viewBox="0 0 24 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M4 1h16v14H4z" />
          <path d="M8 5h8M8 9h8M8 13h4" />
        </svg>
      ),
    },
  ];

  // Data for "How We Work" section
  const workSteps = [
    {
      num: "01",
      title: "Understand the Business",
      desc: "We start by understanding how the business operates, what it needs, and where its challenges are.",
      color: "#00B4D8",
    },
    {
      num: "02",
      title: "Build for the Need",
      desc: "We develop solutions around specific business requirements instead of forcing every organization into the same approach.",
      color: "#E37016",
    },
    {
      num: "03",
      title: "Make It Work",
      desc: "We focus on solutions that are practical to implement, easy to understand, and capable of supporting the business as its needs change.",
      color: "#00B4D8",
    },
  ];

  // Data for "Our Approach" cards
  const approachCards = [
    {
      title: "Business Applications",
      subtitle: "OptimaOne · FastraSuite · EnterpriseOne",
      color: "#00B4D8",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "Cloud Infrastructure",
      subtitle: "CloudOne VPS · Dedicated Instances",
      color: "#E37016",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "Flexibility First",
      subtitle: "Modular by design · Expand when ready",
      color: "#00B4D8",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "Reliability",
      subtitle: "Practical · Implementable · Scalable",
      color: "#E37016",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white font-sans selection:bg-[#E37016] selection:text-white flex flex-col">
      {/* Navbar Section */}
      <nav className="w-full flex justify-center py-4 lg:py-[24px] px-4 md:px-8 lg:px-[94px] bg-[#0A192F] relative z-50 border-b border-white/10 lg:border-none">
        <div className="w-full max-w-[1252px] flex justify-between items-center h-[72px]">
          {/* Logo Section - NOW CLICKABLE */}
          <Link
            to="/"
            className="w-[138.14px] h-[52.43px] flex flex-col justify-center cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <img
                src={bigfixLogo}
                alt="BigFix Logo"
                className="w-[138.1px] h-[52.4px] flex pb-[1.4px]"
              />
            </div>
            <span className="text-[7px] text-gray-400 tracking-[0.15em] mt-0.5 uppercase font-medium">
              Integrated Technologies
            </span>
          </Link>

          <div className="hidden lg:flex gap-[21px] h-full items-center text-white text-[15px] font-semibold">
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-[#1EBED4] transition-colors h-full relative py-2 group">
                Business Applications
                <svg
                  className={`w-4 h-4 mt-0.5 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1EBED4] transition-all duration-300 group-hover:w-full"></span>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-[100%] left-[-100px] pt-4 z-50">
                  <div className="absolute top-[10px] left-[130px] w-4 h-4 bg-[#F7F7F7] rotate-45 shadow-sm"></div>
                  <div className="w-[423px] bg-[#F7F7F7] rounded-[10px] p-[32px] shadow-2xl flex flex-col gap-[10px] relative z-10">
                    <div className="text-[#A8A8A8] text-[12px] font-medium uppercase tracking-[0.5px] leading-[150%] mb-2">
                      Business Applications suite
                    </div>
                    <div className="flex flex-col gap-5">
                      {navApplications.map((app, index) => (
                        <a
                          key={index}
                          href={app.link}
                          target={app.link !== "#" ? "_blank" : "_self"}
                          rel={app.link !== "#" ? "noopener noreferrer" : ""}
                          className="flex gap-3 items-start group cursor-pointer"
                        >
                          <div className="mt-1 flex-shrink-0">{app.icon}</div>
                          <div className="flex flex-col gap-[2px]">
                            <h4 className="text-[#1A1A1A] font-bold text-[16px] leading-tight group-hover:text-[#00B4D8] transition-colors">
                              {app.title}
                            </h4>
                            <p className="text-[#00B4D8] font-medium text-[14px] leading-[150%]">
                              {app.subtitle}
                            </p>
                            <p className="text-[#A8A8A8] font-normal text-[14px] leading-[150%] mt-0.5">
                              {app.description}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <a
              href="https://www.cloud.enterpriseone.com.ng/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1EBED4] transition-colors relative py-2 group"
            >
              Cloud Infrastructure
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1EBED4] transition-all duration-300 group-hover:w-full"></span>
            </a>
            {/* <Link
              to="/company"
              className="hover:text-[#1EBED4] transition-colors"
            >
              Company
            </Link> */}
            <Link
              to="/about-us"
              className={`transition-colors relative py-2 group ${
                location.pathname === "/about-us" ? "text-[#1EBED4]" : "hover:text-[#1EBED4]"
              }`}
            >
              About Us
              <span className={`absolute bottom-0 left-0 h-0.5 bg-[#1EBED4] transition-all duration-300 ${
                location.pathname === "/about-us" ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link>
            <a
              href="#contact"
              className="hover:text-[#1EBED4] transition-colors relative py-2 group"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("contact");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1EBED4] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#0A192F] border-t border-white/10 shadow-xl lg:hidden flex flex-col py-4 px-4 h-[calc(100vh-80px)] overflow-y-auto z-50">
            <div className="flex flex-col gap-4 text-white text-[16px] font-semibold">
              <div className="flex flex-col">
                <button
                  className="flex justify-between items-center w-full py-2 text-left hover:text-[#1EBED4]"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  Business Applications
                  <svg
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="flex flex-col gap-4 pl-4 py-2 border-l border-white/20 mt-2">
                    {navApplications.map((app, index) => (
                      <a
                        key={index}
                        href={app.link}
                        target={app.link !== "#" ? "_blank" : "_self"}
                        rel={app.link !== "#" ? "noopener noreferrer" : ""}
                        className="flex flex-col gap-1"
                      >
                        <span className="text-[#1EBED4] font-bold">
                          {app.title}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {app.subtitle}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <a
                href="https://www.cloud.enterpriseone.com.ng/"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 hover:text-[#1EBED4]"
              >
                Cloud Infrastructure
              </a>
              <Link to="/company" className="py-2 hover:text-[#1EBED4]">
                Company
              </Link>
              <Link to="/about-us" className="py-2 hover:text-[#1EBED4]">
                About Us
              </Link>
              <Link to="/contact" className="py-2 hover:text-[#1EBED4]">
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-100.23px)] overflow-hidden flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bgImageAbout})`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F] via-[#0A192F]/90 to-[#0A192F]/40"></div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[94px] flex flex-col justify-center pt-16 pb-24 lg:pt-[100px] lg:pb-[150px]">
          <div className="inline-block border border-[#1EBED4] rounded-full px-4 py-1.5 lg:px-[24px] lg:py-[8px] text-[#1EBED4] text-[10px] lg:text-[12px] font-semibold tracking-[0.05em] uppercase mb-6 lg:mb-[24px] w-fit bg-[#1EBED4]/5 backdrop-blur-sm">
            Our Company
          </div>
          <div className="max-w-[795px]">
            <h1 className="text-[36px] md:text-[48px] lg:text-[72px] font-bold text-white leading-[1.1] mb-4 lg:mb-[16px] tracking-tight">
              Technology Built <br className="hidden md:block" />
              <span className="text-[#00B4D8]">to Help Businesses</span>{" "}
              <br className="hidden md:block" />
              Work Better.
            </h1>
          </div>
          <p className="text-slate-300 text-[16px] lg:text-[20px] leading-[1.6] max-w-[795px] mb-8 lg:mb-[40px] font-normal">
            We bridge the gap between strategic vision and technical execution.
            BigFix Integrated Technologies engineers robust, unified frameworks
            tailored to solve the complex financial, operational, and technology
            challenges faced by modern organizations.
          </p>
          <a
            href="#our-company"
            className="inline-block bg-[#1EBED4] hover:bg-[#00B4D8] text-white font-semibold text-[16px] leading-[19.2px] tracking-[0.2px] px-[43px] py-[18px] rounded-[10px] transition-all duration-300 ease-in-out w-fit shadow-lg hover:shadow-[#1EBED4]/30 hover:-translate-y-0.5"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById("our-company");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Our Company
          </a>
        </div>
      </section>

      {/* Who We Are Section */}
      <section
        id="our-company"
        className="w-full bg-white py-16 lg:py-[120px] px-4 md:px-8 lg:px-[140px]"
      >
        <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between gap-12 lg:gap-[100px]">
          <div className="flex-1 max-w-[497px] flex flex-col gap-4">
            <span className="text-[#E37016] font-semibold text-[16px] leading-[24px] tracking-[-0.2px] uppercase">
              Who We Are
            </span>
            <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-bold leading-[1.2] tracking-[0.2px] text-[#0A2F5A]">
              Our Company
            </h2>
            <div className="w-[100px] h-[4px] bg-[#00B4D8] mt-2 rounded-full"></div>
          </div>

          <div className="flex-1 max-w-[687px] flex flex-col gap-6">
            <p className="text-[18px] md:text-[24px] font-medium text-[#1A1A1AF5] leading-[1.4] tracking-[0.2px]">
              BigFix Integrated Technologies develops technology solutions that
              help businesses manage their financial, operational, and
              technology needs.
            </p>
            <p className="text-[16px] lg:text-[20px] text-[#1A1A1ACC] leading-[1.6] tracking-[0.2px]">
              We build business applications and cloud infrastructure designed
              around real business requirements — from managing financial
              operations and projects to running the systems that support them.
            </p>

            {/* Quote Box */}
            <div className="w-full bg-[#0A2F5A] rounded-[20px] p-[32px] flex gap-[16px] items-start mt-4">
              <div className="text-[#00B4D8] flex-shrink-0 mt-1">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.748-9.072 8.983-9.072v3.857c-2.665 0-4.375 1.586-4.375 4.152v1.075h4.375v7.379h-8.983zm-14.017 0v-7.391c0-5.704 3.748-9.072 8.983-9.072v3.857c-2.665 0-4.375 1.586-4.375 4.152v1.075h4.375v7.379h-8.983z" />
                </svg>
              </div>
              <p className="text-[#FFFFFF] text-[18px] lg:text-[22px] font-bold leading-[1.4] tracking-[0.2px]">
                Our approach is simple: understand the problem, build the right
                solution, and make technology work for the business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="w-full bg-[#F9F9F9] py-16 lg:py-[120px] px-4 md:px-8 lg:px-[140px]">
        <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-[40px]">
          {/* Vision Card */}
          <div className="bg-[#0A2F5A] rounded-[20px] p-8 lg:p-[40px] flex flex-col gap-6 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-[40px] h-[40px] rounded-[8px] bg-[#00B4D8]/20 flex items-center justify-center text-[#00B4D8]">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <span className="text-[#00B4D8] font-semibold text-[16px] uppercase tracking-[-0.2px]">
                Our Vision
              </span>
            </div>
            <h3 className="text-[22px] font-extrabold text-white leading-[1.2] tracking-[0.2px]">
              To build technology that businesses can rely on.
            </h3>
            <p className="text-[14px] text-[#DEDEDE] leading-[1.6] tracking-[0.2px]">
              We aim to become a trusted technology partner for businesses by
              delivering practical, reliable, and continuously improving
              solutions that support the way they operate and grow.
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-[#0A2F5A] rounded-[20px] p-8 lg:p-[40px] flex flex-col gap-6 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-[40px] h-[40px] rounded-[8px] bg-[#E37016]/20 flex items-center justify-center text-[#E37016]">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-[#E37016] font-semibold text-[16px] uppercase tracking-[-0.2px]">
                Our Mission
              </span>
            </div>
            <h3 className="text-[22px] font-extrabold text-white leading-[1.2] tracking-[0.2px]">
              To provide practical technology solutions that solve real business
              problems.
            </h3>
            <p className="text-[14px] text-[#DEDEDE] leading-[1.6] tracking-[0.2px]">
              We work closely with businesses to understand their needs and
              deliver solutions that improve how they manage their operations,
              information, and technology.
            </p>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="w-full bg-white py-16 lg:py-[120px] px-4 md:px-8 lg:px-[140px]">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-16">
          <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-[100px]">
            <div className="flex-1 max-w-[631px] flex flex-col gap-4">
              <span className="text-[#E37016] font-semibold text-[16px] leading-[24px] tracking-[-0.2px] uppercase">
                How We Work
              </span>
              <h2 className="text-[36px] md:text-[48px] font-bold leading-[1.1] tracking-[0.2px] text-[#0A2F5A]">
                We Focus on What <br className="hidden md:block" /> Businesses{" "}
                <br />
                <span className="text-[#00B4D8]">Actually Need</span>
              </h2>
            </div>
            <div className="flex-1 max-w-[631px] flex items-center">
              <p className="text-[16px] lg:text-[18px] text-[#1A1A1ACC] leading-[1.7] tracking-[0.2px]">
                Technology should solve problems, not create more of them.
                That's why we take a practical approach to every solution we
                build and deliver.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-[40px]">
            {workSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-[48px] h-[48px] rounded-full border-2 flex items-center justify-center text-[16px] font-bold"
                    style={{ borderColor: step.color, color: step.color }}
                  >
                    {step.num}
                  </div>
                  <div
                    className="w-[48px] h-[2px]"
                    style={{ backgroundColor: step.color }}
                  ></div>
                </div>
                <h3 className="text-[22px] font-extrabold text-[#0A2F5A] leading-[1.2] tracking-[0.2px] mt-2">
                  {step.title}
                </h3>
                <p className="text-[16px] text-[#1A1A1ACC] leading-[1.6] tracking-[-0.2px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="w-full bg-[#F9F9F9] py-16 lg:py-[120px] px-4 md:px-8 lg:px-[140px]">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between gap-12 lg:gap-[100px]">
          {/* Left Column: Text */}
          <div className="flex-1 max-w-[510px] flex flex-col gap-6">
            <span className="text-[#E37016] font-semibold text-[16px] leading-[24px] tracking-[-0.2px] uppercase">
              Our Approach
            </span>
            <h2 className="text-[36px] md:text-[48px] font-bold leading-[1.1] tracking-[0.2px] text-[#0A2F5A]">
              Practical Technology. <br />
              <span className="text-[#00B4D8]">Built for Real Operations.</span>
            </h2>
            <div className="flex flex-col gap-6 text-[16px] lg:text-[20px] text-[#1A1A1ACC] leading-[1.6] tracking-[0.2px] mt-2">
              <p>
                Businesses have different processes, requirements, and
                challenges. We don't believe technology should be designed
                around a one-size-fits-all model.
              </p>
              <p>
                Our solutions are built to address specific operational needs
                while giving businesses the flexibility to adapt and grow.
              </p>
              <p>
                From business applications to cloud infrastructure, we focus on
                making technology useful, reliable, and relevant to the
                organizations that depend on it.
              </p>
            </div>
          </div>

          {/* Right Column: Cards & Stats */}
          <div className="flex-1 max-w-[590px] flex flex-col gap-[26px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[26px]">
              {approachCards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#C4C4C4]/20 rounded-[10px] p-[40px] flex flex-col gap-4"
                >
                  <div
                    className="w-[24px] h-[24px] flex items-center justify-center"
                    style={{ color: card.color }}
                  >
                    {card.icon}
                  </div>
                  <h3 className="text-[18px] font-bold text-[#0A2F5A] leading-[1.2] tracking-[-0.2px]">
                    {card.title}
                  </h3>
                  <p className="text-[14px] text-[#1A1A1ACC] leading-[1.5] tracking-[-0.2px]">
                    {card.subtitle}
                  </p>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="w-full bg-[#F7F7F7] rounded-[10px] p-[32px] flex justify-around items-center mt-2">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[32px] font-bold text-[#0A2F5A] leading-[1]">
                  4
                </span>
                <span className="text-[14px] text-[#1A1A1ACC] font-medium">
                  Products
                </span>
              </div>
              <div className="w-[1px] h-[40px] bg-[#C4C4C4]/30"></div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[32px] font-bold text-[#0A2F5A] leading-[1]">
                  1
                </span>
                <span className="text-[14px] text-[#1A1A1ACC] font-medium">
                  Platform
                </span>
              </div>
              <div className="w-[1px] h-[40px] bg-[#C4C4C4]/30"></div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[32px] font-bold text-[#0A2F5A] leading-[1]">
                  ∞
                </span>
                <span className="text-[14px] text-[#1A1A1ACC] font-medium">
                  Scale
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-[#0A2F5A] py-16 lg:py-[120px] px-4 md:px-8 relative overflow-hidden">
        {/* Background Grid Pattern Effect */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        ></div>

        <div className="w-full max-w-[1440px] mx-auto flex flex-col items-center text-center relative z-10">
          <span className="text-[#E37016] font-semibold text-[16px] leading-[24px] tracking-[-0.2px] uppercase mb-4">
            Let's Work Together
          </span>
          <h2 className="text-[36px] md:text-[48px] font-bold leading-[1.2] tracking-[0.2px] text-white mb-6">
            Have a Business or <br />
            <span className="text-[#00B4D8]">Technology Challenge?</span>
          </h2>
          <p className="text-[16px] lg:text-[18px] text-[#A8A8A8] leading-[1.7] tracking-[0.2px] max-w-[762px] mb-10">
            CloudOne provides secure, high-performance virtual servers for
            hosting business applications, databases, websites, and development
            workloads.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-[24px]">
            <button className="w-full sm:w-auto bg-[#E37016] hover:bg-[#c96012] text-white px-6 lg:px-[43px] py-4 lg:py-[18px] rounded-[10px] font-semibold text-[16px] transition-colors shadow-lg text-center justify-center flex">
              Talk to Our Team
            </button>
            <button className="w-full sm:w-auto border border-white/80 hover:border-white hover:bg-white/10 text-white px-6 lg:px-[43px] py-4 lg:py-[18px] rounded-[10px] font-semibold text-[16px] transition-colors flex items-center justify-center gap-2 backdrop-blur-sm">
              Explore Our Products
            </button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="contact" className="w-full bg-[#0A2F5A] pt-16 lg:pt-[80px] pb-8 px-4 md:px-8 lg:px-[140px] text-white">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-12 lg:gap-[80px]">
          {/* Top Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
            {/* Column 1: Logo, Description, Contact Info */}
            <div className="lg:col-span-2 flex flex-col gap-6 max-w-[439px]">
              <Link to="/" className="flex items-center gap-1.5 mb-2">
                <img
                  src={bigfixLogo}
                  alt="BigFix Logo"
                  className="w-[138.1px] h-[52.4px] flex pb-[1.4px]"
                />
              </Link>

              <p className="text-[#C4C4C4] text-[14px] leading-[150%] max-w-[439px]">
                Standalone, industry-grade software solutions designed to scale
                complex corporate operations.
              </p>

              <div className="flex flex-col gap-4 text-[14px] text-[#F7F7F7] mt-2">
                <div className="flex gap-3 items-start">
                  <svg
                    className="w-4 h-4 mt-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4M9 10h.01M15 10h.01M9 14h.01M15 14h.01"
                    />
                  </svg>
                  <div className="flex flex-col gap-1">
                    <span>8 Adelabu Street, Masha, Surulere, Lagos.</span>
                    <span className="text-[12px] text-[#C4C4C4]">
                      8am - 5pm
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <svg
                    className="w-4 h-4 mt-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                    />
                  </svg>
                  <div className="flex flex-col gap-1">
                    <span>+234 805 623 5944</span>
                    <span>+234 808 989 6733</span>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>info@bigfixtech.com</span>
                </div>
              </div>

              <div className="flex gap-4 mt-2">
                <a
                  href="#"
                  className="text-white hover:text-[#00B4D8] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-[#00B4D8] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-[#00B4D8] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-[#00B4D8] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-[#00B4D8] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Applications */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[#00B4D8] font-bold text-[14px] uppercase tracking-[0.2px] leading-[150%]">
                Applications
              </h4>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-white font-semibold text-[14px] leading-[150%]">
                    OptimaOne
                  </span>
                  <span className="text-white text-[12px] leading-[150%] opacity-90">
                    Core Banking & Asset Management
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white font-semibold text-[14px] leading-[150%]">
                    FastraSuite
                  </span>
                  <span className="text-white text-[12px] leading-[150%] opacity-90">
                    Project Costing & Shadow Ledger
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white font-semibold text-[14px] leading-[150%]">
                    EnterpriseOne
                  </span>
                  <span className="text-white text-[12px] leading-[150%] opacity-90">
                    Corporate ERP Suite
                  </span>
                </div>
              </div>
            </div>

            {/* Column 3: Infrastructure */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[#00B4D8] font-bold text-[14px] uppercase tracking-[0.2px] leading-[150%]">
                Infrastructure
              </h4>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-white font-semibold text-[14px] leading-[150%]">
                    CloudOne VPS
                  </span>
                  <span className="text-white text-[12px] leading-[150%] opacity-90">
                    Enterprise Virtual Servers
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white font-semibold text-[14px] leading-[150%]">
                    Dedicated Instances
                  </span>
                  <span className="text-white text-[12px] leading-[150%] opacity-90">
                    Bare-metal performance
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white font-semibold text-[14px] leading-[150%]">
                    Global Regions
                  </span>
                  <span className="text-white text-[12px] leading-[150%] opacity-90">
                    40+ deployment zones
                  </span>
                </div>
              </div>
            </div>

            {/* Column 4: Company */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[#00B4D8] font-bold text-[14px] uppercase tracking-[0.2px] leading-[150%]">
                Company
              </h4>
              <div className="flex flex-col gap-4 text-white text-[14px] leading-[150%]">
                <Link
                  to="/about-us"
                  className="hover:text-[#00B4D8] transition-colors"
                >
                  About Us
                </Link>
                <Link
                  to="/careers"
                  className="hover:text-[#00B4D8] transition-colors"
                >
                  Careers
                </Link>
                <Link
                  to="/security"
                  className="hover:text-[#00B4D8] transition-colors"
                >
                  Security & Compliance
                </Link>
                <a href="#" className="hover:text-[#00B4D8] transition-colors">
                  Documentation
                </a>
                <a href="#" className="hover:text-[#00B4D8] transition-colors">
                  Support
                </a>
              </div>
            </div>
          </div>

          {/* Divider Line */}
          <div className="w-full border-t border-[#FFFFFF] max-w-[1160px] mx-auto"></div>

          {/* Bottom Bar */}
          <div className="w-full max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[#C4C4C4] text-[14px] leading-[150%]">
            <p>© 2026 FastraSuite. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;

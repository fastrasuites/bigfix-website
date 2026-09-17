import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import bigfixLogo from "../assets/bigfixlogopng.png";
import bgImageHome from "../assets/bgimagehomepage.png";

const Home = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState("optima");
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

  // Data for the Software Solutions Accordion
  const solutionsData = [
    {
      id: "optima",
      title: "OptimaOne",
      subtitle: "Core Banking, Asset & Investment Management",
      color: "#00B4D8",
      bgColor: "bg-[#00B4D8]/10",
      icon: (
        <svg
          className="w-6 h-6 text-[#00B4D8]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 8h20M6 12h.01M10 12h.01M14 12h.01M18 12h.01" />
        </svg>
      ),
      content: [
        {
          title: "WHAT IT DOES",
          text: "OptimaOne helps financial organizations manage accounts, investments, asset-backed transactions, profit-sharing, and joint-venture funds in one system.",
        },
        {
          title: "KEY VALUE",
          text: "Built around a central ledger that keeps transactions organized, traceable, and easy to reconcile.",
        },
        {
          title: "INTEGRATION",
          text: "Connect OptimaOne to payment networks, wealth-management platforms, and other financial systems through APIs.",
        },
      ],
      exploreLink: "Explore OptimaOne →",
    },
    {
      id: "fastra",
      title: "FastraSuite",
      subtitle: "Project Costing & Financial Tracking",
      color: "#E37016",
      bgColor: "bg-[#E37016]/10",
      icon: (
        <svg
          className="w-6 h-6 text-[#E37016]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </svg>
      ),
      content: [
        {
          title: "WHAT IT DOES",
          text: "FastraSuite tracks project costs and margins separately from your main accounting records, giving project teams a clearer view of financial performance.",
        },
        {
          title: "KEY VALUE",
          text: "See project costs, budgets, and expected margins as they change, so potential overruns can be identified early.",
        },
        {
          title: "INTEGRATION",
          text: "FastraSuite is designed to integrate with existing ERP databases and banking systems.",
        },
      ],
      exploreLink: "Explore FastraSuite →",
    },
    {
      id: "enterprise",
      title: "EnterpriseOne",
      subtitle: "Corporate ERP",
      color: "#00B4D8",
      bgColor: "bg-[#00B4D8]/10",
      icon: (
        <svg
          className="w-6 h-6 text-[#00B4D8]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
        >
          <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4M9 10h.01M15 10h.01M9 14h.01M15 14h.01" />
        </svg>
      ),
      content: [
        {
          title: "WHAT IT DOES",
          text: "EnterpriseOne manages core corporate financial and operational processes including: General ledger, Procurement, fixed asset management, Multi-currency transactions, and Compliance and financial auditing.",
        },
        {
          title: "KEY VALUE",
          text: "Bring your day-to-day financial and operational transactions together in one system and turn them into reliable financial reports.",
        },
        {
          title: "INTEGRATION",
          text: "EnterpriseOne can operate as the central corporate ERP or work with FastraSuite for continued reconciliation.",
        },
      ],
      exploreLink: "Explore EnterpriseOne →",
      link: "https://www.enterpriseone.com.ng/",
    },
  ];

  // Data for the "Why Modular Infrastructure Works" section
  const modularCards = [
    {
      title: "OptimaOne",
      subtitle: "Core Banking & Asset Management",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 8h20M6 12h.01M10 12h.01M14 12h.01M18 12h.01" />
        </svg>
      ),
    },
    {
      title: "FastraSuite",
      subtitle: "Project Costing & Shadow Ledger",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </svg>
      ),
    },
    {
      title: "EnterpriseOne",
      subtitle: "Corporate ERP Suite",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
        >
          <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4M9 10h.01M15 10h.01M9 14h.01M15 14h.01" />
        </svg>
      ),
    },
  ];

  // Data for the "Module Deep-Dive" section
  const moduleFeatures = [
    {
      title: "Manage Funds and Capital in One Place",
      items: [
        {
          subtitle: "Multi-Entity Fund Segregation",
          desc: "Track multiple investment pools, capital allocations, and joint ventures separately within one system.",
        },
        {
          subtitle: "Asset-Backed Account Verification",
          desc: "Link accounts and investment records to the assets or portfolios they relate to, making transactions easier to track and verify.",
        },
      ],
    },
    {
      title: "Automated Profit-Share Accounting",
      items: [
        {
          subtitle: "Automated Profit Sharing",
          desc: "Automatically calculate how profits are distributed based on your defined sharing rules and portfolio returns.",
        },
        {
          subtitle: "Automated Ledger Reconciliation",
          desc: "Support automated distribution and reconciliation of earned profits across user accounts and multi-tier corporate partnerships.",
        },
      ],
    },
    {
      title: "Better Control and Auditability",
      items: [
        {
          subtitle: "Transaction Records",
          desc: "Keep a complete record of transactions, capital movements, and profit distributions for easier review and auditing.",
        },
        {
          subtitle: "Portfolio Monitoring",
          desc: "Monitor portfolio values and capital obligations to help identify potential financial risks early.",
        },
      ],
    },
    {
      title: "Connect With Your Existing System",
      items: [
        {
          subtitle: "Seamless Fintech Integration",
          desc: "Connect OptimaOne to investment platforms, financial applications, and external systems through APIs.",
        },
        {
          subtitle: "Works With Other BigFix Applications",
          desc: "OptimaOne can send relevant transaction data to FastraSuite for project costing and to EnterpriseOne for corporate reporting and reconciliation.",
        },
      ],
    },
  ];

  // Data for CloudOne Section
  const cloudFeatures = [
    {
      title: "Dedicated Resources",
      desc: "Get dedicated CPU and RAM resources for your virtual server.",
    },
    {
      title: "Flexible Deployment",
      desc: "Choose the operating system and deploy the server configuration you need.",
    },
    {
      title: "Built for Business Applications",
      desc: "Run business applications, databases, and development workloads in a dedicated virtual environment.",
    },
  ];

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="w-full min-h-screen bg-white font-sans selection:bg-[#E37016] selection:text-white flex flex-col">
      {/* Navbar Section */}
      <nav className="w-full flex justify-center py-4 lg:py-[24px] px-4 md:px-8 lg:px-[94px] bg-[#0A192F] relative z-50 border-b border-white/10 lg:border-none">
        <div className="w-full max-w-[1252px] flex justify-between items-center h-[72px]">
          {/* UPDATED LOGO SECTION - Using imported asset */}
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
            backgroundImage: `url(${bgImageHome})`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F] via-[#0A192F]/90 to-[#0A192F]/40"></div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[94px] flex flex-col justify-center pt-16 pb-24 lg:pt-[100px] lg:pb-[150px]">
          <div className="inline-block border border-[#1EBED4] rounded-full px-4 py-1.5 lg:px-[24px] lg:py-[8px] text-[#1EBED4] text-[10px] lg:text-[12px] font-semibold tracking-[0.05em] uppercase mb-6 lg:mb-[24px] w-fit bg-[#1EBED4]/5 backdrop-blur-sm">
            BUSINESS SOFTWARE FOR COMPLEX OPERATIONS
          </div>
          <div className="max-w-200">
            <h1 className="text-[36px] md:text-[48px] lg:text-[64px] font-bold text-white leading-[1.1] mb-1 lg:mb-[4px] tracking-tight">
              Business Applications
            </h1>
            <h2 className="text-[36px] md:text-[48px] lg:text-[64px] font-bold text-[#1EBED4] leading-[1.1] block mb-6 lg:mb-[32px] tracking-tight">
              Built for the Way <br className="hidden md:block" /> You Work
            </h2>
          </div>
          <p className="text-slate-300 text-[16px] lg:text-[18px] leading-[1.6] max-w-[680px] mb-8 lg:mb-[40px] font-normal">
            BigFix develops software for financial management, project costing,
            and corporate operations. Choose the solution that meets your needs
            today and add more as your business grows
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-[24px]">
            <button className="w-full sm:w-auto bg-[#E37016] hover:bg-[#c96012] text-white px-6 lg:px-[32px] py-3 lg:py-[16px] rounded-[8px] font-semibold text-[16px] transition-colors shadow-lg text-center justify-center flex">
              Request a Review
            </button>
            <button className="w-full sm:w-auto border border-white/80 hover:border-white hover:bg-white/10 text-white px-6 lg:px-[32px] py-3 lg:py-[16px] rounded-[8px] font-semibold text-[16px] transition-colors flex items-center justify-center gap-2 backdrop-blur-sm">
              Watch the 2-Min Overview
            </button>
          </div>
        </div>
      </section>

      {/* Software Solutions Accordion Section */}
      <section className="w-full bg-white py-16 lg:py-[100px]">
        <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col gap-[40px]">
          <div className="flex flex-col gap-4">
            <h2 className="text-[32px] md:text-[42px] lg:text-[56px] font-bold leading-[1.2] tracking-[0.2px] text-[#0A2F5A] max-w-[860px]">
              Custom Enterprise Solutions <br className="hidden lg:block" />
              <span className="text-[#00B4D8]">
                Deployed Seamlessly Around Your Business.
              </span>
            </h2>
            <p className="text-[16px] md:text-[20px] font-normal leading-[1.5] tracking-[0.2px] text-[#A8A8A8] max-w-[795px]">
              We eliminate the risk and complexity of digital transformation.
              BigFix architects integrate and optimize high-performance software
              ecosystems tailored entirely to your organization’s unique
              operational DNA delivering total system harmony from day one.
            </p>
          </div>

          <div className="w-full bg-[#F7F7F7] rounded-[32px] border border-[#A8A8A8] flex flex-col overflow-hidden">
            {solutionsData.map((item, index) => {
              const isOpen = activeAccordion === item.id;
              return (
                <div
                  key={item.id}
                  className={`w-full flex flex-col ${index !== solutionsData.length - 1 ? "border-b-[0.5px] border-[#A8A8A8]" : ""}`}
                >
                  <div
                    className="w-full flex justify-between items-center p-6 lg:p-[32px] cursor-pointer transition-colors hover:bg-black/5"
                    onClick={() => toggleAccordion(item.id)}
                  >
                    <div className="flex items-center gap-4 lg:gap-[16px]">
                      <div
                        className={`w-[48px] h-[48px] rounded-[10px] flex items-center justify-center ${item.bgColor}`}
                      >
                        {item.icon}
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-[20px] lg:text-[24px] font-bold text-[#0A2F5A] leading-[1.2] tracking-[0.2px]">
                          {item.title}
                        </h3>
                        <p className="text-[12px] lg:text-[14px] font-normal text-[#A8A8A8] leading-[1.5] tracking-[-0.2px]">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <svg
                      className={`w-6 h-6 text-[#A8A8A8] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </div>

                  {isOpen && (
                    <div className="w-full p-6 lg:p-[32px] pt-0 flex flex-col gap-[24px]">
                      <div className="w-full flex flex-col md:flex-row gap-8 md:gap-[24px] relative">
                        {item.content.map((col, colIndex) => (
                          <React.Fragment key={colIndex}>
                            <div className="flex-1 flex flex-col gap-[16px]">
                              <div className="flex items-center gap-[8px]">
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: item.color }}
                                ></div>
                                <span
                                  className="text-[14px] font-semibold uppercase tracking-[-0.2px] leading-[1]"
                                  style={{ color: item.color }}
                                >
                                  {col.title}
                                </span>
                              </div>
                              <p className="text-[14px] font-normal text-[#0A2F5A] leading-[1.5] tracking-[-0.2px]">
                                {col.text}
                              </p>
                            </div>
                            {colIndex < item.content.length - 1 && (
                              <div className="hidden md:block w-[1px] bg-[#A8A8A8] mx-4"></div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <div className="mt-4 md:mt-8">
                        <a
                          href={item.link}
                          target={item.link !== "#" ? "_blank" : "_self"}
                          rel={item.link !== "#" ? "noopener noreferrer" : ""}
                          className="inline-flex items-center gap-2 text-[16px] font-semibold text-[#0A2F5A] hover:text-[#00B4D8] transition-colors group"
                        >
                          {item.exploreLink}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Modular Infrastructure Works */}
      <section className="w-full bg-[#0A2F5A] py-16 lg:py-[120px] px-4 md:px-8 lg:px-[140px]">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between gap-12 lg:gap-10">
          <div className="flex-1 max-w-[535px] flex flex-col gap-6">
            <span className="text-[#E37016] font-semibold text-[16px] uppercase tracking-[-0.2px] leading-[24px]">
              WHY MODULAR INFRASTRUCTURE WORKS
            </span>
            <h2 className="text-[32px] lg:text-[40px] font-bold leading-[1.2] lg:leading-[1] tracking-[0.2px] text-white">
              Start With What You Need. <br className="hidden lg:block" />
              <span className="text-[#00B4D8]">Grow When You're Ready.</span>
            </h2>
            <div className="flex flex-col gap-6 text-[16px] lg:text-[18px] text-[#A8A8A8] leading-[1.7] lg:leading-[30px] tracking-[0.2px]">
              <p>
                Traditional organizations often rely on multiple software
                systems that must be connected before they can work together
                effectively.
              </p>
              <p>
                BigFix takes a modular approach. Organizations can start with
                the application that addresses their most critical operational
                need and expand their technology ecosystem as their requirements
                grow.
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-[542px] flex flex-col gap-[24px]">
            {modularCards.map((card, idx) => (
              <div
                key={idx}
                className="w-full bg-[#FFFFFF1A] border-[0.5px] border-[#F7F7F780] rounded-[10px] p-[24px] flex items-center gap-[24px] backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-[4px] bg-[#FFFFFF1A] border-[1.5px] border-[#00B4D8] flex items-center justify-center text-[#00B4D8] flex-shrink-0">
                  {card.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-[20px] font-bold text-[#F7F7F7] leading-[1] tracking-[-0.2px]">
                    {card.title}
                  </h3>
                  <p className="text-[14px] text-[#F7F7F7] leading-[24px] tracking-[-0.2px]">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module Deep-Dive */}
      <section className="w-full bg-white py-16 lg:py-[120px] px-4 md:px-8">
        <div className="w-full max-w-[1160px] mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center text-center gap-4 mb-12 lg:mb-[60px] max-w-[894px]">
            <span className="text-[#E37016] font-semibold text-[16px] uppercase tracking-[-0.2px] leading-[24px]">
              Module Deep-Dive
            </span>
            <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-bold leading-[1.2] tracking-[0.2px]">
              <span className="text-[#0A2F5A]">
                OptimaOne: Asset & Investment
              </span>
              <br className="hidden md:block" />
              <span className="text-[#00B4D8]">Management Module</span>
            </h2>
            <p className="text-[16px] lg:text-[20px] leading-[1.5] lg:leading-[30px] text-[#A8A8A8] tracking-[0.2px] mt-2">
              Manage investments, assets, and profit-sharing with greater
              transparency and control.
            </p>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-[26px]">
            {moduleFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="bg-[#F7F7F7] rounded-[16px] p-6 lg:p-[32px] flex flex-col gap-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[4px] bg-[#00B4D826] flex items-center justify-center text-[#00B4D8] flex-shrink-0">
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
                  </div>
                  <h3 className="text-[18px] font-bold text-[#0A2F5A] leading-[1.2] tracking-[-0.2px]">
                    {feature.title}
                  </h3>
                </div>

                <div className="flex flex-col gap-5">
                  {feature.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex gap-3 items-start">
                      <svg
                        className="w-5 h-5 text-[#00B4D8] flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <div className="flex flex-col gap-1">
                        <h4 className="text-[16px] font-semibold text-[#0A2F5A] leading-[1.3] tracking-[-0.2px]">
                          {item.subtitle}
                        </h4>
                        <p className="text-[14px] text-[#1A1A1ACC] leading-[1.7] tracking-[-0.2px]">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Let's Find the Right Solution */}
      <section className="w-full bg-[#F9F9F9] py-16 lg:py-[120px] px-4 md:px-8 lg:px-[140px]">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-[100px]">
          <div className="flex-1 max-w-[559px] flex flex-col gap-6">
            <span className="text-[#E37016] font-semibold text-[16px] leading-[24px] tracking-[-0.2px] uppercase">
              Why Modular Works
            </span>
            <h2 className="text-[32px] lg:text-[40px] font-bold leading-[1.2] lg:leading-[100%] tracking-[0.2px]">
              <span className="text-[#0A2F5A]">Let's Find the Right</span>
              <br className="hidden md:block" />
              <span className="text-[#00B4D8]">Solution for Your Business</span>
            </h2>
            <p className="text-[16px] lg:text-[18px] text-[#1A1A1ACC] leading-[1.7] lg:leading-[30px] tracking-[0.2px]">
              Tell us what you're looking for and our team will help you
              identify the right BigFix solution.
            </p>

            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center text-[#F7B23B] flex-shrink-0">
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
                </div>
                <span className="text-[16px] font-medium text-[#1A1A1ACC] leading-[21.6px] tracking-[-0.2px]">
                  Response within 1 business day
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center text-[#00B4D8] flex-shrink-0">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <span className="text-[16px] font-medium text-[#1A1A1ACC] leading-[21.6px] tracking-[-0.2px]">
                  Enterprise-grade NDA available on request
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center text-[#00B4D8] flex-shrink-0">
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
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-[16px] font-medium text-[#1A1A1ACC] leading-[21.6px] tracking-[-0.2px]">
                  Global deployment support across 40+ regions
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center text-[#E37016] flex-shrink-0">
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
                </div>
                <span className="text-[16px] font-medium text-[#1A1A1ACC] leading-[21.6px] tracking-[-0.2px]">
                  Dedicated solutions architect for each account
                </span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[542px] flex-shrink-0">
            <div className="bg-white rounded-[32px] p-6 lg:p-[40px_32px] shadow-2xl flex flex-col gap-[26px]">
              <h3 className="text-[18px] font-bold text-[#0A2F5A] leading-[21.6px] tracking-[-0.2px]">
                Request a Systems Architecture Review
              </h3>

              <form className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[13px] font-semibold text-[#0A2F5A] leading-[100%] tracking-[-0.2px]">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      placeholder="Sarah Alen"
                      className="w-full border border-[#A8A8A8] rounded-[8px] px-4 py-3 text-[14px] text-[#0A2F5A] placeholder-[#A8A8A8] focus:outline-none focus:border-[#00B4D8] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[13px] font-semibold text-[#0A2F5A] leading-[100%] tracking-[-0.2px]">
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      placeholder="Sarah Alen"
                      className="w-full border border-[#A8A8A8] rounded-[8px] px-4 py-3 text-[14px] text-[#0A2F5A] placeholder-[#A8A8A8] focus:outline-none focus:border-[#00B4D8] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-semibold text-[#0A2F5A] leading-[100%] tracking-[-0.2px]">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Meridian Capital Holdings"
                    className="w-full border border-[#A8A8A8] rounded-[8px] px-4 py-3 text-[14px] text-[#0A2F5A] placeholder-[#A8A8A8] focus:outline-none focus:border-[#00B4D8] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-semibold text-[#0A2F5A] leading-[100%] tracking-[-0.2px]">
                    Primary Product of Interest *
                  </label>
                  <div className="relative">
                    <select className="w-full border border-[#A8A8A8] rounded-[8px] px-4 py-3 text-[14px] text-[#A8A8A8] focus:outline-none focus:border-[#00B4D8] transition-colors appearance-none bg-white">
                      <option value="" disabled selected>
                        What are you interested in?
                      </option>
                      <option value="optima">OptimaOne</option>
                      <option value="fastra">FastraSuite</option>
                      <option value="enterprise">EnterpriseOne</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#A8A8A8]">
                      <svg
                        className="w-4 h-4"
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
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-semibold text-[#0A2F5A] leading-[100%] tracking-[-0.2px]">
                    Primary Operation *
                  </label>
                  <input
                    type="text"
                    placeholder="Tell us briefly what you need"
                    className="w-full border border-[#A8A8A8] rounded-[8px] px-4 py-3 text-[14px] text-[#0A2F5A] placeholder-[#A8A8A8] focus:outline-none focus:border-[#00B4D8] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-semibold text-[#0A2F5A] leading-[100%] tracking-[-0.2px]">
                    Estimated Project Timeline *
                  </label>
                  <div className="relative">
                    <select className="w-full border border-[#A8A8A8] rounded-[8px] px-4 py-3 text-[14px] text-[#A8A8A8] focus:outline-none focus:border-[#00B4D8] transition-colors appearance-none bg-white">
                      <option value="" disabled selected>
                        When are you looking to get started?
                      </option>
                      <option value="immediate">Immediately</option>
                      <option value="1-3">1-3 Months</option>
                      <option value="3-6">3-6 Months</option>
                      <option value="6+">6+ Months</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#A8A8A8]">
                      <svg
                        className="w-4 h-4"
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
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full bg-[#0A2F5A] text-white rounded-[8px] py-4 font-bold text-[16px] hover:bg-[#0A2F5A]/90 transition-colors mt-2"
                >
                  Talk to Our Team
                </button>
                <p className="text-[12px] text-[#A8A8A8] text-center mt-1">
                  No spam. Your data is never shared with third parties.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CloudOne Section */}
      <section className="w-full bg-[#F7F7F7] py-16 lg:py-[120px] px-4 md:px-8">
        <div className="w-full max-w-[1440px] mx-auto">
          <div className="w-full bg-[#0A2F5A] rounded-[24px] lg:rounded-[32px] p-8 lg:p-[80px] flex flex-col lg:flex-row gap-12 lg:gap-[54px] relative overflow-hidden">
            {/* Background Grid Pattern Effect */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            ></div>

            {/* Left Column: Text */}
            <div className="flex-1 flex flex-col gap-6 relative z-10 max-w-[500px]">
              <div className="flex items-center gap-[16px] mb-2">
                <div className="w-[48px] h-[48px] rounded-[12px] border border-[#E37016] flex items-center justify-center text-[#E37016] flex-shrink-0">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <span className="text-[#E37016] font-semibold text-[16px] uppercase tracking-[-0.2px] leading-[24px]">
                  NEED RELIABLE INFRASTRUCTURE FOR YOUR APPLICATIONS?
                </span>
              </div>

              <h2 className="text-[36px] md:text-[48px] font-bold text-[#F7F7F7] leading-[1.2] tracking-[0.2px]">
                CloudOne
              </h2>
              <p className="text-[18px] md:text-[20px] font-medium text-[#00B4D8] leading-[1.2] tracking-[0.2px]">
                Virtual Private Servers for Business and Development
              </p>
              <p className="text-[16px] text-[#F7F7F7] opacity-80 leading-[1.7] tracking-[0.2px] mb-4">
                CloudOne provides secure, high-performance virtual servers for
                hosting business applications, databases, websites, and
                development workloads.
              </p>

              <a
                href="https://cloudone.com.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#E37016] hover:bg-[#c96012] text-[#F7F7F7] font-semibold text-[16px] leading-[19.2px] tracking-[0.2px] px-[43px] py-[18px] rounded-[10px] transition-colors w-fit shadow-lg inline-block"
              >
                View VPS Hosting Plans
              </a>
            </div>

            {/* Right Column: Feature Cards */}
            <div className="flex-1 flex flex-col gap-[26px] w-full max-w-[609px] relative z-10 justify-center">
              {cloudFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="w-full bg-[#FFFFFF1A] border border-[#FFFFFF33] rounded-[10px] p-6 flex flex-col gap-3 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-[12px] h-[12px] bg-[#00B4D8] rounded-full flex-shrink-0"></div>
                    <h3 className="text-[18px] font-semibold text-[#F7F7F7] leading-[21.6px] tracking-[-0.2px]">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-[14px] font-normal text-[#F7F7F7] opacity-80 leading-[24px] tracking-[-0.2px] pl-[24px]">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION: Footer */}
      <footer id="contact" className="w-full bg-[#0A2F5A] pt-16 lg:pt-[80px] pb-8 px-4 md:px-8 lg:px-[140px] text-white">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-12 lg:gap-[80px]">
          {/* Top Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
            {/* Column 1: Logo, Description, Contact Info */}
            <div className="lg:col-span-2 flex flex-col gap-6 max-w-[439px]">
              {/* Logo */}
              <div className="flex items-center gap-1.5 mb-2">
                <img
                  src={bigfixLogo}
                  alt="BigFix Logo"
                  className="w-[138.1px] h-[52.4px] flex pb-[1.4px]"
                />
              </div>

              <p className="text-[#C4C4C4] text-[14px] leading-[150%] max-w-[439px]">
                Standalone, industry-grade software solutions designed to scale
                complex corporate operations.
              </p>

              {/* Contact Details */}
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

              {/* Social Icons */}
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
                <a href="#" className="hover:text-[#00B4D8] transition-colors">
                  Careers
                </a>
                <a href="#" className="hover:text-[#00B4D8] transition-colors">
                  Security & Compliance
                </a>
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

export default Home;

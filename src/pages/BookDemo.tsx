import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bigfixLogo from "../assets/bigfixlogopng.png";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { navApplications, navServices } from "../data/navigation";
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
import { useNavigationState } from "../hooks/useNavigationState";
import { useSmoothScroll } from "../hooks/useSmoothScroll";

interface FormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  product: string;
  industry: string;
  users: string;
  date: string;
  time: string;
  notes: string;
}

const initialFormData: FormData = {
  name: "",
  company: "",
  email: "",
  phone: "",
  product: "",
  industry: "",
  users: "",
  date: "",
  time: "",
  notes: "",
};

const productOptions = [
  { value: "", label: "--- Select a Product ---" },
  { value: "optima", label: "OptimaOne (Core Banking & Asset Management)" },
  { value: "fastra", label: "FastraSuite (Project Costing & Shadow Ledger)" },
  { value: "enterprise", label: "EnterpriseOne (Corporate ERP Suite)" },
  { value: "cloudone", label: "CloudOne (Virtual Private Servers)" },
];

const industryOptions = [
  { value: "", label: "--- Select an Industry ---" },
  { value: "financial", label: "Financial Services" },
  { value: "banking", label: "Banking" },
  { value: "investment", label: "Investment Management" },
  { value: "erp", label: "Corporate ERP" },
  { value: "technology", label: "Technology" },
  { value: "other", label: "Other" },
];

const userOptions = [
  { value: "", label: "" },
  { value: "1-5", label: "1 - 5 Users" },
  { value: "5-10", label: "5 - 10 Users" },
  { value: "10-20", label: "10 - 20 Users" },
  { value: "20-50", label: "20 - 50 Users" },
  { value: "50-100", label: "50 - 100 Users" },
  { value: "100-5000", label: "100 - 5000 Users" },
  { value: "unsure", label: "I'm not sure" },
];

const stepLabels = ["Personal Data", "Industries/Users", "Schedule"];

const BookDemo = (): JSX.Element => {
  useSmoothScroll();
  const navigate = useNavigate();
  const {
    isDropdownOpen,
    isServicesOpen,
    isMobileMenuOpen,
    setDropdownOpen,
    setServicesOpen,
    toggleMobileMenu,
  } = useNavigationState();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep((s) => Math.min(3, s + 1));
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    navigate("/");
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

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Panel - Deep Navy Blue */}
        <div className="hidden lg:flex w-[40%] bg-[#0A2F5A] flex-col justify-center px-12 py-16">
          <img
            src={bigfixLogo}
            alt="BigFix Logo"
            className="w-[180px] h-[68px] mb-8"
          />
          <h1 className="text-white text-4xl font-bold mb-4">Book a Demo</h1>
          <p className="text-white/70 text-lg mb-10">
            Thank you for your interest in receiving a demo of our solutions.
          </p>

          <div className="flex flex-col gap-3 text-white/80 text-sm">
            <div className="flex flex-col">
              <span>8 Adelabu Street, Masha, Surulere, Lagos.</span>
              <span className="text-white/50">8am - 5pm</span>
            </div>
            <div className="flex flex-col">
              <span>+234 805 623 5944</span>
              <span>+234 808 989 6733</span>
            </div>
            <div className="flex flex-col">
              <span>info@bigfixtech.com</span>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            {footerSocials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-white hover:text-[#00B4D8] transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Right Panel - White with Form */}
        <div className="flex-1 bg-white flex flex-col items-center py-10 px-6 lg:px-12">
          <div className="w-full max-w-md">
            {/* Close Button */}
            <button
              onClick={() => navigate("/")}
              className="self-end text-[#0A2F5A] text-sm font-medium mb-4 hover:opacity-70 transition-opacity"
            >
              ✕ Close
            </button>

            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-10">
              {stepLabels.map((label, i) => (
                <div key={label} className="flex flex-col items-center flex-1">
                  <span
                    className={`text-sm font-semibold mb-1 ${
                      step === i + 1
                        ? "text-[#0A2F5A]"
                        : step > i + 1
                        ? "text-[#00B4D8]"
                        : "text-[#A8A8A8]"
                    }`}
                  >
                    {label}
                  </span>
                  <div
                    className={`w-full h-[3px] rounded-full transition-colors ${
                      step >= i + 1 ? "bg-[#0A2F5A]" : "bg-[#E0E0E0]"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Step 1: Personal Data */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-[#0A2F5A] text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full border border-[#A8A8A8] rounded-lg px-4 py-3 text-[#0A2F5A] text-sm focus:outline-none focus:border-[#00B4D8] transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-[#0A2F5A] text-sm font-medium mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    className="w-full border border-[#A8A8A8] rounded-lg px-4 py-3 text-[#0A2F5A] text-sm focus:outline-none focus:border-[#00B4D8] transition-colors"
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label className="block text-[#0A2F5A] text-sm font-medium mb-1">
                    Business Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full border border-[#A8A8A8] rounded-lg px-4 py-3 text-[#0A2F5A] text-sm focus:outline-none focus:border-[#00B4D8] transition-colors"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[#0A2F5A] text-sm font-medium mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full border border-[#A8A8A8] rounded-lg px-4 py-3 text-[#0A2F5A] text-sm focus:outline-none focus:border-[#00B4D8] transition-colors"
                    placeholder="+234 ..."
                  />
                </div>
                <div>
                  <label className="block text-[#0A2F5A] text-sm font-medium mb-1">
                    Product of Interest
                  </label>
                  <select
                    value={formData.product}
                    onChange={(e) => handleChange("product", e.target.value)}
                    className="w-full border border-[#A8A8A8] rounded-lg px-4 py-3 text-[#0A2F5A] text-sm focus:outline-none focus:border-[#00B4D8] transition-colors bg-white"
                  >
                    {productOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleNext}
                  className="w-full bg-[#0A2F5A] hover:bg-[#0A2F5A]/90 text-white font-semibold text-sm rounded-full py-3 transition-colors"
                >
                  Next
                </button>
              </div>
            )}

            {/* Step 2: Industries/Users */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-[#0A2F5A] text-sm font-medium mb-1">
                    Select Industry*
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleChange("industry", e.target.value)}
                    className="w-full border border-[#A8A8A8] rounded-lg px-4 py-3 text-[#0A2F5A] text-sm focus:outline-none focus:border-[#00B4D8] transition-colors bg-white"
                  >
                    {industryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#0A2F5A] text-sm font-medium mb-2">
                    Select number of users*
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {userOptions.map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer text-sm transition-colors ${
                          formData.users === opt.value
                            ? "border-[#00B4D8] bg-[#F0F8FF]"
                            : "border-[#A8A8A8] hover:border-[#00B4D8]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="users"
                          value={opt.value}
                          checked={formData.users === opt.value}
                          onChange={(e) => handleChange("users", e.target.value)}
                          className="accent-[#00B4D8]"
                        />
                        <span className="text-[#0A2F5A]">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleBack}
                    className="flex-1 border border-[#A8A8A8] text-[#0A2F5A] font-semibold text-sm rounded-full py-3 hover:border-[#0A2F5A] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 bg-[#0A2F5A] hover:bg-[#0A2F5A]/90 text-white font-semibold text-sm rounded-full py-3 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Schedule */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-[#0A2F5A] text-sm font-medium mb-1">
                    Choose date*
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    className="w-full border border-[#A8A8A8] rounded-lg px-4 py-3 text-[#0A2F5A] text-sm focus:outline-none focus:border-[#00B4D8] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#0A2F5A] text-sm font-medium mb-1">
                    Choose time*
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.time}
                      onChange={(e) => handleChange("time", e.target.value)}
                      className="flex-1 border border-[#A8A8A8] rounded-lg px-3 py-3 text-[#0A2F5A] text-sm focus:outline-none focus:border-[#00B4D8] transition-colors bg-white"
                    >
                      <option value="">Hour</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <select
                      value={formData.time}
                      onChange={(e) => handleChange("time", e.target.value)}
                      className="flex-1 border border-[#A8A8A8] rounded-lg px-3 py-3 text-[#0A2F5A] text-sm focus:outline-none focus:border-[#00B4D8] transition-colors bg-white"
                    >
                      <option value="">Minute</option>
                      {Array.from({ length: 4 }, (_, i) => (
                        <option key={i} value={i * 15}>
                          {i * 15}
                        </option>
                      ))}
                    </select>
                    <select
                      value={formData.time}
                      onChange={(e) => handleChange("time", e.target.value)}
                      className="flex-1 border border-[#A8A8A8] rounded-lg px-3 py-3 text-[#0A2F5A] text-sm focus:outline-none focus:border-[#00B4D8] transition-colors bg-white"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[#0A2F5A] text-sm font-medium mb-1">
                    Anything else you would like us to know?
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    rows={4}
                    className="w-full border border-[#A8A8A8] rounded-lg px-4 py-3 text-[#0A2F5A] text-sm focus:outline-none focus:border-[#00B4D8] transition-colors resize-none"
                    placeholder="Tell us more..."
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleBack}
                    className="flex-1 border border-[#A8A8A8] text-[#0A2F5A] font-semibold text-sm rounded-full py-3 hover:border-[#0A2F5A] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-[#0A2F5A] hover:bg-[#0A2F5A]/90 text-white font-semibold text-sm rounded-full py-3 transition-colors"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer
        logoSrc={bigfixLogo}
        contact={footerContact}
        applications={footerApplications}
        infrastructure={footerInfrastructure}
        companyLinks={footerCompanyLinks}
        bottomLinks={footerBottomLinks}
        copyright={footerCopyright}
        socials={footerSocials}
        supportLink={homeSupportLink}
      />
    </div>
  );
};

export default BookDemo;

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

const clientLogos = ["OptimaOne", "FastraSuite", "CloudOne", "TechPartner", "FinServe"];

const ContactUs = (): JSX.Element => {
  const { isDropdownOpen, isServicesOpen, isMobileMenuOpen, setDropdownOpen, setServicesOpen, toggleMobileMenu } = useNavigationState();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
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
        <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-24">
          <h1 className="text-[#0A2F5A] text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Contact Us
          </h1>
          <p className="text-[#A8A8A8] text-lg mb-10 max-w-lg">
            Have any business enquiries? Reach out to us. Standalone, industry-grade software solutions designed to scale complex corporate operations.
          </p>
          <Link
            to="/book-demo"
            className="inline-block bg-[#E37016] hover:bg-[#c56012] text-white font-semibold text-lg px-8 py-4 rounded-full transition-colors w-fit"
          >
            Request a Project
          </Link>
        </div>
        <div className="w-full lg:w-1/2 min-h-[300px] lg:min-h-[500px] bg-cover bg-center rounded-tl-3xl lg:rounded-tl-none lg:rounded-br-3xl" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80')" }}>
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

      {/* Section 1: Get in Touch */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 lg:flex-row-reverse">
            <div className="w-full lg:w-1/2">
              <h2 className="text-[#0A2F5A] text-3xl font-bold mb-4">Get in touch</h2>
              <p className="text-[#A8A8A8] text-base leading-relaxed mb-8">
                You can also contact us with the contact information below.
              </p>
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-[#00B4D8] text-2xl">✉</span>
                  <a href="mailto:info@bigfixtech.com" className="text-[#0A2F5A] font-medium hover:text-[#00B4D8] transition-colors">
                    info@bigfixtech.com
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#00B4D8] text-2xl">📞</span>
                  <div>
                    <a href="tel:+2348056235944" className="text-[#0A2F5A] font-medium hover:text-[#00B4D8] transition-colors block">
                      +234 805 623 5944
                    </a>
                    <a href="tel:+2348089896733" className="text-[#0A2F5A] font-medium hover:text-[#00B4D8] transition-colors block">
                      +234 808 989 6733
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#00B4D8] text-2xl">📍</span>
                  <span className="text-[#0A2F5A] font-medium">
                    8 Adelabu Street, Masha, Surulere, Lagos. (8am - 5pm)
                  </span>
                </div>
              </div>
              <Link
                to="/book-demo"
                className="inline-block bg-[#E37016] hover:bg-[#c56012] text-white font-semibold text-lg px-8 py-4 rounded-full transition-colors"
              >
                Request a Project
              </Link>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.5!2d3.38!3d6.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjYnMTEuMiJFdjhEMMM!5e0!3m2!1sen!2sng!4v1700000000000"
                  className="w-full h-[400px] lg:h-[500px] border-0"
                  allowFullScreen
                  loading="lazy"
                  title="BigFix Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Contact Form */}
      <section className="bg-[#F7F7F7] py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                alt="Contact interface"
                className="w-full rounded-2xl shadow-xl"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[#0A2F5A] text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full border border-[#A8A8A8] rounded-lg px-4 py-3 text-[#0A2F5A] text-sm focus:outline-none focus:border-[#00B4D8] transition-colors"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#0A2F5A] text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full border border-[#A8A8A8] rounded-lg px-4 py-3 text-[#0A2F5A] text-sm focus:outline-none focus:border-[#00B4D8] transition-colors"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[#0A2F5A] text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full border border-[#A8A8A8] rounded-lg px-4 py-3 text-[#0A2F5A] text-sm focus:outline-none focus:border-[#00B4D8] transition-colors"
                      placeholder="+234 ..."
                    />
                  </div>
                  <div>
                    <label className="block text-[#0A2F5A] text-sm font-medium mb-1">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                      className="w-full border border-[#A8A8A8] rounded-lg px-4 py-3 text-[#0A2F5A] text-sm focus:outline-none focus:border-[#00B4D8] transition-colors"
                      placeholder="Subject"
                      required
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-[#0A2F5A] text-sm font-medium mb-1">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    rows={4}
                    className="w-full border border-[#A8A8A8] rounded-lg px-4 py-3 text-[#0A2F5A] text-sm focus:outline-none focus:border-[#00B4D8] transition-colors resize-none"
                    placeholder="Your message"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#0A2F5A] hover:bg-[#082044] text-white font-semibold text-lg px-8 py-4 rounded-full transition-colors"
                >
                  Send Message
                </button>
              </form>
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

export default ContactUs;

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

const clientLogos = ["TechCorp", "FinServe", "GlobalBank", "OptimaOne", "CloudOne"];

const syncSteps = [
  { icon: "☁️", title: "Google Drive", desc: "Sync with your Google Drive seamlessly." },
  { icon: "📁", title: "Dropbox", desc: "Access your Dropbox files instantly." },
  { icon: "💻", title: "OneDrive", desc: "Integrate with Microsoft OneDrive." },
  { icon: "📄", title: "PDF Files", desc: "Manage and edit PDF documents." },
];

const workflowItems = [
  "Reduce operational downtimes",
  "Improve administrative effectiveness",
  "Centralize file repository",
  "Automate manual processes",
];

const CloudStorage = (): JSX.Element => {
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
        <div className="w-full lg:w-[60%] bg-[#0A2F5A] flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-24">
          <h1 className="text-white text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Cloud Services
          </h1>
          <p className="text-white/70 text-lg mb-10 max-w-lg">
            Work with your files from anywhere, anytime. Seamlessly integrate your cloud files with OptimaOne, FastraSuite, and EnterpriseOne.
          </p>
          <Link
            to="/book-demo"
            className="inline-block bg-[#E37016] hover:bg-[#c56012] text-white font-semibold text-lg px-8 py-4 rounded-full transition-colors w-fit"
          >
            Request a Demo
          </Link>
        </div>
        <div className="w-full lg:w-[40%] min-h-[300px] lg:min-h-[500px] bg-cover bg-center rounded-tl-3xl lg:rounded-tl-none lg:rounded-br-3xl" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80')" }}>
        </div>
      </section>

      {/* Trusted by Strip */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-8">
          <h3 className="text-center text-[#A8A8A8] text-sm font-medium uppercase tracking-wider mb-8">
            Trusted by 100+ Partners & Customers
          </h3>
          <div className="flex justify-center items-center gap-12 flex-wrap">
            {clientLogos.map((name) => (
              <span key={name} className="text-[#A8A8A8] text-xl font-bold tracking-wide grayscale hover:grayscale-0 transition-all duration-300">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 1: Sync Files */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-1/2">
              <h2 className="text-[#0A2F5A] text-3xl font-bold mb-4">Sync Files to Your Secured Cloud Space</h2>
              <p className="text-[#A8A8A8] text-base leading-relaxed mb-8">
                Access your files anytime, away from your office, and work seamlessly while automating manual processes and workflows. Manage your files in your secure cloud workspace and facilitate its accessibility across multiple devices.
              </p>
              <Link
                to="/book-demo"
                className="inline-block bg-[#00B4D8] hover:bg-[#0099b3] text-white font-semibold text-lg px-8 py-4 rounded-full transition-colors"
              >
                Get Started
              </Link>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                {syncSteps.map((item) => (
                  <div key={item.title} className="bg-[#F7F7F7] rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <span className="text-4xl mb-3 block">{item.icon}</span>
                    <h4 className="text-[#0A2F5A] font-bold mb-1">{item.title}</h4>
                    <p className="text-[#A8A8A8] text-xs">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Read and Edit */}
      <section className="bg-[#0A2F5A] py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 lg:flex-row-reverse">
            <div className="w-full lg:w-1/2">
              <h2 className="text-white text-3xl font-bold mb-4">Read and Edit Your Files from Anywhere</h2>
              <p className="text-white/70 text-base leading-relaxed mb-8">
                You can work on your office files from anywhere without setting up a complex network. Supported file formats include but are not limited to Microsoft Office, Excel, PowerPoint, Access, JPEG, PNG, MP3, and MP4.
              </p>
              <Link
                to="/book-demo"
                className="inline-block bg-[#00B4D8] hover:bg-[#0099b3] text-white font-semibold text-lg px-8 py-4 rounded-full transition-colors"
              >
                Get Started
              </Link>
            </div>
            <div className="w-full lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                alt="Woman working on laptop"
                className="w-full rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Intelligent Workflow */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-1/2">
              <h2 className="text-[#0A2F5A] text-3xl font-bold mb-4">Establish an Intelligent Workflow</h2>
              <p className="text-[#A8A8A8] text-base leading-relaxed mb-8">
                Having all of an organization's files in one repository can reduce operational downtimes and improve administrative effectiveness. Seamlessly integrate your cloud files with OptimaOne, FastraSuite, and EnterpriseOne.
              </p>
              <Link
                to="/book-demo"
                className="inline-block bg-[#00B4D8] hover:bg-[#0099b3] text-white font-semibold text-lg px-8 py-4 rounded-full transition-colors"
              >
                Get Started For Free
              </Link>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="bg-[#F7F7F7] rounded-2xl p-8">
                <div className="flex flex-col gap-4">
                  {workflowItems.map((item, i) => (
                    <div key={item} className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#0A2F5A] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-[#0A2F5A] font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Share and Collaborate */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 lg:flex-row-reverse">
            <div className="w-full lg:w-1/2">
              <h2 className="text-[#0A2F5A] text-3xl font-bold mb-4">Share Files/Folders and Collaborate with Your Team</h2>
              <p className="text-[#A8A8A8] text-base leading-relaxed mb-8">
                Store and organize your team's work files in a shared and secure space. Create files and invite users to view or edit them. You can also create a shared folder so that your team can collectively have access to files within the folder.
              </p>
              <Link
                to="/book-demo"
                className="inline-block bg-[#00B4D8] hover:bg-[#0099b3] text-white font-semibold text-lg px-8 py-4 rounded-full transition-colors"
              >
                Get Started For Free
              </Link>
            </div>
            <div className="w-full lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                alt="People collaborating"
                className="w-full rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Public Folder */}
      <section className="bg-[#0A2F5A] py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-1/2">
              <h2 className="text-white text-3xl font-bold mb-4">Create A Public Folder For Your Organization</h2>
              <p className="text-white/70 text-base leading-relaxed mb-8">
                Create a main folder with access privileges and achieve data loss prevention, visibility, control, and compliance. Increase team collaboration and security while increasing the advantage of scalability and performance.
              </p>
              <Link
                to="/book-demo"
                className="inline-block bg-[#00B4D8] hover:bg-[#0099b3] text-white font-semibold text-lg px-8 py-4 rounded-full transition-colors"
              >
                Get Started
              </Link>
            </div>
            <div className="w-full lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1497366811268-49698a95572b?w=800&q=80"
                alt="Modern office space"
                className="w-full rounded-2xl shadow-xl"
              />
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
                  className="inline-block bg-[#00B4D8] hover:bg-[#0099b3] text-white font-semibold px-6 py-3 rounded-full transition-colors"
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

export default CloudStorage;

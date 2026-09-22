import { useLocation } from "react-router-dom";
import {
  ABOUT_US_PATH,
  CLOUD_INFRASTRUCTURE_URL,
  CONTACT_SECTION_ID,
} from "../../constants/links";
import { createScrollHandler } from "../../utils/scroll";
import type { DesktopNavProps } from "../../types";
import NavUnderline from "./NavUnderline";
import NavUnderlineLink from "./NavUnderlineLink";
import ApplicationsDropdown from "./ApplicationsDropdown";
import ServicesDropdown from "./ServicesDropdown";

const handleContactClick = createScrollHandler(CONTACT_SECTION_ID);

const DesktopNav = ({
  applications,
  services,
  isDropdownOpen,
  isServicesOpen,
  onDropdownChange,
  onServicesChange,
  onBookDemo,
}: DesktopNavProps): JSX.Element => {
  const location = useLocation();
  return (
    <div className="hidden lg:flex gap-10 h-full items-center text-white text-[15px] font-semibold">
      <div
        className="relative h-full flex items-center"
        onMouseEnter={() => onDropdownChange(true)}
        onMouseLeave={() => onDropdownChange(false)}
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
          <NavUnderline />
        </button>

        {isDropdownOpen && (
          <ApplicationsDropdown applications={applications} />
        )}
      </div>

      <div
        className="relative h-full flex items-center"
        onMouseEnter={() => onServicesChange(true)}
        onMouseLeave={() => onServicesChange(false)}
      >
        <button className="flex items-center gap-1 hover:text-[#1EBED4] transition-colors h-full relative py-2 group">
          Services
          <svg
            className={`w-4 h-4 mt-0.5 transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`}
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
          <NavUnderline />
        </button>

        {isServicesOpen && (
          <ServicesDropdown services={services} />
        )}
      </div>

      <NavUnderlineLink
        label="Cloud Infrastructure"
        href={CLOUD_INFRASTRUCTURE_URL}
        external
      />
      <NavUnderlineLink
        label="About Us"
        to={ABOUT_US_PATH}
        isActive={location.pathname === ABOUT_US_PATH}
      />
      <NavUnderlineLink
        label="Contact"
        href={`#${CONTACT_SECTION_ID}`}
        onClick={handleContactClick}
      />

      <button
        onClick={onBookDemo}
        className="ml-4 bg-[#00B4D8] hover:bg-[#0099b3] text-white font-semibold text-[14px] leading-[150%] px-6 py-2.5 rounded-full transition-colors"
      >
        Book a Demo
      </button>
    </div>
  );
};

export default DesktopNav;
import { Link } from "react-router-dom";
import {
  ABOUT_US_PATH,
  CLOUD_INFRASTRUCTURE_URL,
  CONTACT_PATH,
} from "../../constants/links";
import type { MobileNavProps } from "../../types";

/**
 * Full-height mobile menu panel.
 */
const MobileNav = ({
  applications,
  isDropdownOpen,
  onDropdownChange,
  extraLinks,
}: MobileNavProps): JSX.Element => (
  <div className="absolute top-full left-0 w-full bg-[#0A192F] border-t border-white/10 shadow-xl lg:hidden flex flex-col py-4 px-4 h-[calc(100vh-80px)] overflow-y-auto z-50">
    <div className="flex flex-col gap-4 text-white text-[16px] font-semibold">
      <div className="flex flex-col">
        <button
          className="flex justify-between items-center w-full py-2 text-left hover:text-[#1EBED4]"
          onClick={() => onDropdownChange(!isDropdownOpen)}
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
            {applications.map((app) => (
              <a
                key={app.title}
                href={app.link}
                target={app.link !== "#" ? "_blank" : "_self"}
                rel={app.link !== "#" ? "noopener noreferrer" : ""}
                className="flex flex-col gap-1"
              >
                <span className="text-[#1EBED4] font-bold">{app.title}</span>
                <span className="text-gray-400 text-sm">{app.subtitle}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      <a
        href={CLOUD_INFRASTRUCTURE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="py-2 hover:text-[#1EBED4]"
      >
        Cloud Infrastructure
      </a>

      {extraLinks?.map((link) => (
        <Link key={link.label} to={link.to} className="py-2 hover:text-[#1EBED4]">
          {link.label}
        </Link>
      ))}

      <Link to={ABOUT_US_PATH} className="py-2 hover:text-[#1EBED4]">
        About Us
      </Link>
      <Link to={CONTACT_PATH} className="py-2 hover:text-[#1EBED4]">
        Contact
      </Link>
    </div>
  </div>
);

export default MobileNav;
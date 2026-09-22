import type { NavApplication, NavLink } from "../types";
import { OPTIMA_ONE_SECTION_ID } from "../constants/links";
import { createCrossPageScrollHandler } from "../utils/scroll";

/**
 * Products listed in the "Business Applications" navigation dropdown.
 */
export const navApplications: NavApplication[] = [
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
  {
    title: "Optima One",
    subtitle: "Core Banking, Asset & Investment Management",
    description:
      "Equity-backed deposit accounts, profit-share calculation, and fund ledgering",
    link: `/#${OPTIMA_ONE_SECTION_ID}`,
    icon: (
      <svg
        className="w-5 h-3 text-[#00B4D8] mt-1"
        viewBox="0 0 24 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="1" y="2" width="22" height="12" rx="2" />
        <path d="M1 6h22" />
      </svg>
    ),
    onClick: createCrossPageScrollHandler(OPTIMA_ONE_SECTION_ID),
  },
];

/**
 * Services listed in the "Services" navigation dropdown.
 */
export const navServices: NavLink[] = [
  { label: "Enterprise Software Development", to: "/software-development" },
  { label: "Cloud Storage", to: "/cloud-storage" },
  { label: "IT Consultancy", to: "/it-consultancy" },
];

/**
 * Links that only the About Us mobile menu shows.
 */
export const aboutMobileNavLinks: NavLink[] = [
  { label: "Company", to: "/company" },
];
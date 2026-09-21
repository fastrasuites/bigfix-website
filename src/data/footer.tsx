import { ABOUT_US_PATH, REQUEST_REVIEW_SECTION_ID, OPTIMA_ONE_SECTION_ID, ABOUT_US_TOP_SECTION_ID } from "../constants/links";
import { createScrollHandler, createCrossPageScrollHandler, createPageScrollHandler } from "../utils/scroll";
import type {
  FooterContact,
  FooterLinkItem,
  FooterProductItem,
  FooterSupportLink,
  SocialLink,
} from "../types";

/**
 * Company contact details shown in the first footer column.
 */
export const footerContact: FooterContact = {
  address: "8 Adelabu Street, Masha, Surulere, Lagos.",
  addressHours: "8am - 5pm",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=8+Adelabu+Street,+Masha,+Surulere,+Lagos",
  phone1: "+234 805 623 5944",
  phone2: "+234 808 989 6733",
  email: "info@bigfixtech.com",
};

/**
 * Social profiles rendered underneath the contact details.
 */
export const footerSocials: SocialLink[] = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </svg>
    ),
  },
];
/**
 * Applications column.
 */
export const footerApplications: FooterProductItem[] = [
  {
    name: "FastraSuite",
    href: "https://www.fastrasuite.com/",
    description: "Project Costing & Shadow Ledger",
  },
  {
    name: "EnterpriseOne",
    href: "https://www.enterpriseone.com.ng/",
    description: "Corporate ERP Suite",
  },
  {
    name: "OptimaOne",
    href: `/#${OPTIMA_ONE_SECTION_ID}`,
    description: "Core Banking & Asset Management",
    onClick: createCrossPageScrollHandler(OPTIMA_ONE_SECTION_ID),
  },
];

/**
 * Infrastructure column.
 */
export const footerInfrastructure: FooterProductItem[] = [
  {
    name: "CloudOne VPS",
    href: "https://cloudone.com.ng/",
    description: "Enterprise Virtual Servers",
  },
];

/**
 * Company column. The "Support" entry is rendered by the `supportLink` prop so
 * each page can decide how that link behaves.
 */
export const footerCompanyLinks: FooterLinkItem[] = [
  {
    label: "About Us",
    href: ABOUT_US_PATH,
    onClick: createPageScrollHandler("/about-us", ABOUT_US_TOP_SECTION_ID),
  },
  { label: "Careers", href: "#" },
  {
    label: "Support",
    href: `#${REQUEST_REVIEW_SECTION_ID}`,
    isSupportLink: true,
  },
];

/**
 * Legal links rendered in the footer bottom bar.
 */
export const footerBottomLinks: FooterLinkItem[] = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", href: "#" },
];

export const footerCopyright = "© 2026 FastraSuite. All rights reserved.";

/**
 * Home page support link: scrolls to the on-page review form.
 */
export const homeSupportLink: FooterSupportLink = {
  href: `#${REQUEST_REVIEW_SECTION_ID}`,
  onClick: createScrollHandler(REQUEST_REVIEW_SECTION_ID),
};

/**
 * About Us support link: navigates back to the Home page review form.
 */
export const aboutSupportLink: FooterSupportLink = {
  href: `/#${REQUEST_REVIEW_SECTION_ID}`,
};

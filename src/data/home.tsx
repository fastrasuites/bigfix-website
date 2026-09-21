import {
  BOLT_ICON_PATH,
  GLOBE_ICON_PATH,
  SHIELD_CHECK_ICON_PATH,
} from "../constants/icons";
import { OPTIMA_ONE_SECTION_ID } from "../constants/links";
import { createScrollHandler } from "../utils/scroll";
import type {
  CloudFeature,
  ModularCard,
  ModuleFeature,
  RequestReviewBenefit,
  SolutionData,
} from "../types";

/**
 * Products shown in the "Custom Enterprise Solutions" accordion.
 */
export const solutionsData: SolutionData[] = [
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
    link: "https://www.OptimaOne.com.ng/",
    onClick: createScrollHandler(OPTIMA_ONE_SECTION_ID),
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
    link: "https://www.fastrasuite.com/",
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
/**
 * Product cards shown in the "Why Modular Infrastructure Works" section.
 */
export const modularCards: ModularCard[] = [
  {
    title: "OptimaOne",
    subtitle: "Core Banking & Asset Management",
    link: "https://www.OptimaOne.com.ng/",
    onClick: createScrollHandler(OPTIMA_ONE_SECTION_ID),
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
    link: "https://www.fastrasuite.com/",
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
    link: "https://www.enterpriseone.com.ng/",
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
/**
 * Feature cards shown in the "Module Deep-Dive" section.
 */
export const moduleFeatures: ModuleFeature[] = [
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
/**
 * Feature cards shown in the CloudOne section.
 */
export const cloudFeatures: CloudFeature[] = [
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

/**
 * Checklist shown next to the "Request a Systems Architecture Review" form.
 */
export const requestReviewBenefits: RequestReviewBenefit[] = [
  {
    text: "Response within 1 business day",
    colorClass: "text-[#F7B23B]",
    iconPath: BOLT_ICON_PATH,
  },
  {
    text: "Enterprise-grade NDA available on request",
    colorClass: "text-[#00B4D8]",
    iconPath: SHIELD_CHECK_ICON_PATH,
  },
  {
    text: "Global deployment support across 40+ regions",
    colorClass: "text-[#00B4D8]",
    iconPath: GLOBE_ICON_PATH,
  },
  {
    text: "Dedicated solutions architect for each account",
    colorClass: "text-[#E37016]",
    iconPath: BOLT_ICON_PATH,
  },
];
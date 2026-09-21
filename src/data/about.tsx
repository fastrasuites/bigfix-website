import OutlineIcon from "../components/common/OutlineIcon";
import { BOLT_ICON_PATH } from "../constants/icons";
import type { ApproachCard, InfoCard, StatItem, WorkStep } from "../types";

/**
 * Steps shown in the "How We Work" section.
 */
export const workSteps: WorkStep[] = [
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

/**
 * Capability cards shown in the "Our Approach" section.
 */
export const approachCards: ApproachCard[] = [
  {
    title: "Business Applications",
    subtitle: "OptimaOne · FastraSuite · EnterpriseOne",
    color: "#00B4D8",
    icon: <OutlineIcon path={BOLT_ICON_PATH} />,
  },
  {
    title: "Cloud Infrastructure",
    subtitle: "CloudOne VPS · Dedicated Instances",
    color: "#E37016",
    icon: <OutlineIcon path={BOLT_ICON_PATH} />,
  },
  {
    title: "Flexibility First",
    subtitle: "Modular by design · Expand when ready",
    color: "#00B4D8",
    icon: <OutlineIcon path={BOLT_ICON_PATH} />,
  },
  {
    title: "Reliability",
    subtitle: "Practical · Implementable · Scalable",
    color: "#E37016",
    icon: <OutlineIcon path={BOLT_ICON_PATH} />,
  },
];

/**
 * Vision and mission cards.
 */
export const visionMissionCards: InfoCard[] = [
  {
    title: "Our Vision",
    heading: "To build technology that businesses can rely on.",
    description:
      "We aim to become a trusted technology partner for businesses by delivering practical, reliable, and continuously improving solutions that support the way they operate and grow.",
    accentClass: "text-[#00B4D8]",
    iconBgClass: "bg-[#00B4D8]/20",
    icon: (
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
    ),
  },
  {
    title: "Our Mission",
    heading:
      "To provide practical technology solutions that solve real business problems.",
    description:
      "We work closely with businesses to understand their needs and deliver solutions that improve how they manage their operations, information, and technology.",
    accentClass: "text-[#E37016]",
    iconBgClass: "bg-[#E37016]/20",
    icon: <OutlineIcon path={BOLT_ICON_PATH} className="w-6 h-6" />,
  },
];

/**
 * Numbers shown in the "Our Approach" stats row.
 */
export const aboutStats: StatItem[] = [
  { value: "4", label: "Products" },
  { value: "1", label: "Platform" },
  { value: "∞", label: "Scale" },
];
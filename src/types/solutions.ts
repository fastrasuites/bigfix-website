import type { MouseEvent, ReactNode } from "react";

/**
 * A single titled paragraph shown inside an accordion solution panel.
 */
export interface SolutionItem {
  title: string;
  text: string;
}

/**
 * A product shown in the "Custom Enterprise Solutions" accordion.
 */
export interface SolutionData {
  id: string;
  title: string;
  subtitle: string;
  /** Accent colour used for the panel bullets, labels and dividers. */
  color: string;
  /** Tailwind background class for the panel icon tile. */
  bgColor: string;
  icon: ReactNode;
  content: SolutionItem[];
  exploreLink: string;
  link?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

/* ------------------------------------------------------------------ */
/* Accordion component contracts                                       */
/* ------------------------------------------------------------------ */

export interface SolutionsAccordionProps {
  solutions: SolutionData[];
}

export interface SolutionPanelProps {
  solution: SolutionData;
  isOpen: boolean;
  isLast: boolean;
  onToggle: (id: string) => void;
}

export interface SolutionDetailsProps {
  solution: SolutionData;
}

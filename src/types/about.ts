import type { ReactNode } from "react";

/**
 * A numbered step shown in the "How We Work" section.
 */
export interface WorkStep {
  num: string;
  title: string;
  desc: string;
  color: string;
}

/**
 * A capability card shown in the "Our Approach" section.
 */
export interface ApproachCard {
  title: string;
  subtitle: string;
  color: string;
  icon: ReactNode;
}

/**
 * A vision/mission card. Accent colours are supplied as Tailwind classes so the
 * card markup stays identical for every entry.
 */
export interface InfoCard {
  title: string;
  heading: string;
  description: string;
  /** Tailwind text colour class, e.g. `text-[#00B4D8]`. */
  accentClass: string;
  /** Tailwind background class for the icon tile, e.g. `bg-[#00B4D8]/20`. */
  iconBgClass: string;
  icon: ReactNode;
}

/**
 * A number/label pair shown in the "Our Approach" stats row.
 */
export interface StatItem {
  value: string;
  label: string;
}

/* ------------------------------------------------------------------ */
/* About page component contracts                                      */
/* ------------------------------------------------------------------ */

export interface AboutHeroProps {
  backgroundImage: string;
}

export interface VisionMissionSectionProps {
  cards: InfoCard[];
}

export interface HowWeWorkSectionProps {
  steps: WorkStep[];
}

export interface OurApproachSectionProps {
  cards: ApproachCard[];
  stats: StatItem[];
}

export interface ApproachCardItemProps {
  card: ApproachCard;
}

export interface InfoCardItemProps {
  card: InfoCard;
}

export interface WorkStepItemProps {
  step: WorkStep;
}

export interface ApproachStatsProps {
  stats: StatItem[];
}
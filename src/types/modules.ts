import type { MouseEvent, ReactNode } from "react";

/**
 * A product card shown in the "Why Modular Infrastructure Works" section.
 */
export interface ModularCard {
  title: string;
  subtitle: string;
  link: string;
  icon: ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * A single point inside a module deep-dive feature card.
 */
export interface ModuleFeatureItem {
  subtitle: string;
  desc: string;
}

/**
 * A feature card shown in the "Module Deep-Dive" section.
 */
export interface ModuleFeature {
  title: string;
  items: ModuleFeatureItem[];
}

/**
 * A feature card shown in the CloudOne section.
 */
export interface CloudFeature {
  title: string;
  desc: string;
}

/* ------------------------------------------------------------------ */
/* Section component contracts                                         */
/* ------------------------------------------------------------------ */

export interface ModularInfrastructureProps {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  paragraphs: string[];
  cards: ModularCard[];
}

export interface ModuleDeepDiveProps {
  eyebrow?: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  features: ModuleFeature[];
  id?: string;
}

export interface ModuleFeatureCardProps {
  feature: ModuleFeature;
}

export interface CloudOneSectionProps {
  features: CloudFeature[];
}

export interface CloudFeatureCardProps {
  feature: CloudFeature;
}

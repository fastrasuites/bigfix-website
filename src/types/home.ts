import type { MouseEvent, ReactNode } from "react";

/**
 * The landing hero shown at the top of the Home page.
 */
export interface HomeHeroProps {
  badge: string;
  titleLine1: string;
  /** Allows markup (e.g. a responsive line break) inside the highlighted title. */
  titleLine2: ReactNode;
  description: string;
  buttonLabel: string;
  backgroundImage: string;
  onButtonClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * A checklist item shown next to the "Request a Review" form.
 */
export interface RequestReviewBenefit {
  text: string;
  /** Tailwind text colour class applied to the icon. */
  colorClass: string;
  /** `d` attribute of the outline icon path. */
  iconPath: string;
}

export interface RequestReviewSectionProps {
  benefits: RequestReviewBenefit[];
}

export interface RequestReviewInfoProps {
  benefits: RequestReviewBenefit[];
}

export interface RequestReviewBenefitsProps {
  benefits: RequestReviewBenefit[];
}

import type { MouseEvent, ReactNode } from "react";

/**
 * A product entry rendered inside the "Business Applications" nav dropdown.
 */
export interface NavApplication {
  title: string;
  subtitle: string;
  description: string;
  link: string;
  icon: ReactNode;
}

/**
 * A plain text link used by the navigation and footer link lists.
 */
export interface NavLink {
  label: string;
  to: string;
}

/**
 * A social profile link rendered in the footer.
 */
export interface SocialLink {
  label: string;
  href: string;
  icon: ReactNode;
}

/* ------------------------------------------------------------------ */
/* Header component contracts                                          */
/* ------------------------------------------------------------------ */

export interface HeaderProps {
  logoSrc: string;
  navApplications: NavApplication[];
  isDropdownOpen: boolean;
  isMobileMenuOpen: boolean;
  /** Opens/closes the applications dropdown (desktop hover + mobile trigger). */
  onDropdownChange: (isOpen: boolean) => void;
  onMobileMenuToggle: () => void;
  /** Optional tagline rendered underneath the logo. */
  tagline?: string;
  /** Extra links rendered only in the mobile menu, before "About Us". */
  mobileLinks?: NavLink[];
}

export interface HeaderLogoProps {
  logoSrc: string;
  tagline?: string;
}

export interface DesktopNavProps {
  applications: NavApplication[];
  isDropdownOpen: boolean;
  onDropdownChange: (isOpen: boolean) => void;
}

export interface ApplicationsDropdownProps {
  applications: NavApplication[];
}

export interface MobileNavProps {
  applications: NavApplication[];
  isDropdownOpen: boolean;
  onDropdownChange: (isOpen: boolean) => void;
  extraLinks?: NavLink[];
}

/** Shared animated underline used by the desktop nav items. */
export interface NavUnderlineProps {
  isActive?: boolean;
}

export interface NavUnderlineLinkProps {
  label: string;
  /** Internal route. Mutually exclusive with `href`. */
  to?: string;
  /** External URL. Mutually exclusive with `to`. */
  href?: string;
  /** Keeps the underline visible and highlights the label. */
  isActive?: boolean;
  /** Adds `target="_blank"` and `rel="noopener noreferrer"`. */
  external?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

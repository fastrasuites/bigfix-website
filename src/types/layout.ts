import type { MouseEvent } from "react";
import type { SocialLink } from "./navigation";

/**
 * A product link shown in the footer "Applications" / "Infrastructure" columns.
 */
export interface FooterProductItem {
  name: string;
  href: string;
  description: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * A simple labelled link shown in a footer link column.
 */
export interface FooterLinkItem {
  label: string;
  href: string;
  /**
   * Marks the entry that should render with the page specific `supportLink`
   * (plain anchor + optional click handler) instead of a router `Link`.
   */
  isSupportLink?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Company contact details rendered in the first footer column.
 */
export interface FooterContact {
  address: string;
  addressHours: string;
  mapUrl: string;
  phone1: string;
  phone2: string;
  whatsappUrl1: string;
  whatsappUrl2: string;
  email: string;
}

/**
 * Behaviour of the "Support" company link, which differs per page.
 */
export interface FooterSupportLink {
  href: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export interface FooterProps {
  logoSrc: string;
  contact: FooterContact;
  applications: FooterProductItem[];
  infrastructure: FooterProductItem[];
  companyLinks: FooterLinkItem[];
  bottomLinks: FooterLinkItem[];
  copyright: string;
  id?: string;
  /** Optional social profiles; the block is omitted when empty. */
  socials?: SocialLink[];
  supportLink?: FooterSupportLink;
}

/* ------------------------------------------------------------------ */
/* Footer component contracts                                          */
/* ------------------------------------------------------------------ */

export interface FooterContactDetailsProps {
  contact: FooterContact;
}

export interface FooterSocialLinksProps {
  links: SocialLink[];
}

export interface FooterProductColumnProps {
  title: string;
  items: FooterProductItem[];
}

export interface FooterLinkColumnProps {
  title: string;
  links: FooterLinkItem[];
  supportLink?: FooterSupportLink;
}

export interface FooterBottomBarProps {
  copyright: string;
  links: FooterLinkItem[];
}
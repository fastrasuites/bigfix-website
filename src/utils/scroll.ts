import type { MouseEvent } from "react";

/**
 * Smoothly scrolls the viewport to the element carrying the given id.
 */
export const scrollToSection = (id: string): void => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

/**
 * Builds an anchor/button click handler that scrolls to a section instead of
 * letting the browser jump to it.
 */
export const createScrollHandler =
  (id: string) =>
  (event: MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    scrollToSection(id);
  };

/**
 * Builds a cross-page scroll handler:
 * - Always prevents default to avoid unhandled anchor navigation.
 * - If already on the home page ("/"), smooth-scrolls to the section.
 * - Otherwise, navigates to "/#id" so the target page loads the section.
 */
export const createCrossPageScrollHandler =
  (id: string) =>
  (event: MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    if (window.location.pathname === "/") {
      scrollToSection(id);
    } else {
      window.location.href = `/#${id}`;
    }
  };

/**
 * Builds a scroll handler for links pointing to a specific page:
 * - If already on the target page, prevents default and smooth-scrolls to the section.
 * - Otherwise, lets the router handle navigation to the target page.
 */
export const createPageScrollHandler =
  (pathname: string, id: string) =>
  (event: MouseEvent<HTMLElement>): void => {
    if (window.location.pathname === pathname) {
      event.preventDefault();
      scrollToSection(id);
    }
    // else: let the Link/router handle navigation
  };

/**
 * Returns true if the URL is an external link (http:// or https://).
 */
export const isExternalUrl = (url: string | undefined): boolean =>
  url !== undefined && /^https?:\/\//i.test(url);
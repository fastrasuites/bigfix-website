import type { FooterSocialLinksProps } from "../../types";

/**
 * Row of social profile icons.
 */
const FooterSocialLinks = ({ links }: FooterSocialLinksProps): JSX.Element => (
  <div className="flex gap-4 mt-2">
    {links.map((link) => (
      <a
        key={link.label}
        href={link.href}
        aria-label={link.label}
        className="text-white hover:text-[#00B4D8] transition-colors"
      >
        {link.icon}
      </a>
    ))}
  </div>
);

export default FooterSocialLinks;
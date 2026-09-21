import { Link } from "react-router-dom";
import type { FooterBottomBarProps } from "../../types";

/**
 * Copyright line plus the legal links.
 */
const FooterBottomBar = ({
  copyright,
  links,
}: FooterBottomBarProps): JSX.Element => (
  <div className="w-full max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[#C4C4C4] text-[14px] leading-[150%]">
    <p>{copyright}</p>
    <div className="flex gap-6">
      {links.map((link) => (
        <Link
          key={link.label}
          to={link.href}
          className="hover:text-white transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </div>
  </div>
);

export default FooterBottomBar;
import { Link } from "react-router-dom";
import type { NavUnderlineLinkProps } from "../../types";
import NavUnderline from "./NavUnderline";

/**
 * Navigation link with the hover/active underline treatment. Renders a router
 * `Link` when `to` is provided, otherwise a plain anchor.
 */
const NavUnderlineLink = ({
  label,
  to,
  href,
  isActive = false,
  external = false,
  onClick,
}: NavUnderlineLinkProps): JSX.Element => {
  const className = `transition-colors relative py-2 group ${
    isActive ? "text-[#1EBED4]" : "hover:text-[#1EBED4]"
  }`;

  if (to) {
    return (
      <Link to={to} className={className}>
        {label}
        <NavUnderline isActive={isActive} />
      </Link>
    );
  }

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={className}
      onClick={onClick}
    >
      {label}
      <NavUnderline isActive={isActive} />
    </a>
  );
};

export default NavUnderlineLink;
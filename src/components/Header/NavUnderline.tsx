import type { NavUnderlineProps } from "../../types";

/**
 * Animated underline shared by every desktop nav item.
 */
const NavUnderline = ({ isActive = false }: NavUnderlineProps): JSX.Element => (
  <span
    className={`absolute bottom-0 left-0 h-0.5 bg-[#1EBED4] transition-all duration-300 ${
      isActive ? "w-full" : "w-0 group-hover:w-full"
    }`}
  ></span>
);

export default NavUnderline;
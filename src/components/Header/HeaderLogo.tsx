import { Link } from "react-router-dom";
import { HOME_PATH } from "../../constants/links";
import type { HeaderLogoProps } from "../../types";

/**
 * Header logo, optionally followed by a tagline underneath.
 */
const HeaderLogo = ({ logoSrc, tagline }: HeaderLogoProps): JSX.Element => (
  <Link
    to={HOME_PATH}
    className="w-[138.14px] h-[52.43px] flex flex-col justify-center cursor-pointer"
  >
    <div className="flex items-center gap-1.5">
      <img
        src={logoSrc}
        alt="BigFix Logo"
        className="w-[138.1px] h-[52.4px] flex pb-[1.4px]"
      />
    </div>
    {tagline && (
      <span className="text-[7px] text-gray-400 tracking-[0.15em] mt-0.5 uppercase font-medium">
        {tagline}
      </span>
    )}
  </Link>
);

export default HeaderLogo;
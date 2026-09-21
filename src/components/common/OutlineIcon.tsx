import type { OutlineIconProps } from "../../types";

/**
 * Outline icon rendered from a single SVG path definition, so sections can
 * declare their icons as data instead of duplicating `<svg>` markup.
 */
const OutlineIcon = ({
  path,
  className = "w-5 h-5",
  strokeWidth = 2,
}: OutlineIconProps): JSX.Element => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

export default OutlineIcon;
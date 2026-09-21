/**
 * Contract for the generic single-path outline icon primitive.
 */
export interface OutlineIconProps {
  /** `d` attribute of the icon path. */
  path: string;
  /** Tailwind classes applied to the `<svg>`; defaults to `w-5 h-5`. */
  className?: string;
  /** SVG stroke width; defaults to `2`. */
  strokeWidth?: number;
}
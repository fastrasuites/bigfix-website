import { isExternalUrl } from "../../utils/scroll";
import type { FooterProductColumnProps } from "../../types";

/**
 * Footer column listing products with a short description each.
 */
const FooterProductColumn = ({
  title,
  items,
}: FooterProductColumnProps): JSX.Element => (
  <div className="flex flex-col gap-6">
    <h4 className="text-[#00B4D8] font-bold text-[14px] uppercase tracking-[0.2px] leading-[150%]">
      {title}
    </h4>
    <div className="flex flex-col gap-4">
    {items.map((item) => (
      <a
        key={item.name}
        href={item.href}
        target={isExternalUrl(item.href) ? "_blank" : undefined}
        rel={isExternalUrl(item.href) ? "noopener noreferrer" : undefined}
        className="flex flex-col gap-1 text-left hover:text-[#00B4D8] transition-colors"
        onClick={item.onClick}
      >
        <span className="text-white font-semibold text-[14px] leading-[150%] hover:text-[#00B4D8] transition-colors">
          {item.name}
        </span>
        <span className="text-white text-[12px] leading-[150%] opacity-90">
          {item.description}
        </span>
      </a>
    ))}
    </div>
  </div>
);

export default FooterProductColumn;
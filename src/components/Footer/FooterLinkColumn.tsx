import { Link } from "react-router-dom";
import type { FooterLinkColumnProps } from "../../types";

/**
 * Footer column of internal links. The "Support" entry is rendered as a plain
 * anchor because its target/behaviour differs per page.
 */
const FooterLinkColumn = ({
  title,
  links,
  supportLink,
}: FooterLinkColumnProps): JSX.Element => (
  <div className="flex flex-col gap-6">
    <h4 className="text-[#00B4D8] font-bold text-[14px] uppercase tracking-[0.2px] leading-[150%]">
      {title}
    </h4>
    <div className="flex flex-col gap-4 text-white text-[14px] leading-[150%]">
      {links.map((link) =>
        link.isSupportLink && supportLink ? (
          <a
            key={link.label}
            href={supportLink.href}
            className="hover:text-[#00B4D8] transition-colors"
            onClick={supportLink.onClick}
          >
            {link.label}
          </a>
        ) : (
          <Link
            key={link.label}
            to={link.href}
            className="hover:text-[#00B4D8] transition-colors"
          >
            {link.label}
          </Link>
        ),
      )}
    </div>
  </div>
);

export default FooterLinkColumn;
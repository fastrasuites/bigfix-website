import { Link } from "react-router-dom";
import { CONTACT_SECTION_ID, HOME_PATH } from "../../constants/links";
import type { FooterProps } from "../../types";
import FooterBottomBar from "./FooterBottomBar";
import FooterContactDetails from "./FooterContactDetails";
import FooterLinkColumn from "./FooterLinkColumn";
import FooterProductColumn from "./FooterProductColumn";
import FooterSocialLinks from "./FooterSocialLinks";

/**
 * Site footer: brand and contact details, product columns, company links and
 * the bottom bar.
 */
const Footer = ({
  logoSrc,
  contact,
  applications,
  infrastructure,
  companyLinks,
  bottomLinks,
  copyright,
  id = CONTACT_SECTION_ID,
  socials,
  supportLink,
}: FooterProps): JSX.Element => (
  <footer
    id={id}
    className="w-full bg-[#0A2F5A] pt-16 lg:pt-[80px] pb-8 px-4 md:px-8 lg:px-[140px] text-white"
  >
    <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-12 lg:gap-[80px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6 max-w-[439px]">
          <Link to={HOME_PATH} className="flex items-center gap-1.5 mb-2">
            <img
              src={logoSrc}
              alt="BigFix Logo"
              className="w-[138.1px] h-[52.4px] flex pb-[1.4px]"
            />
          </Link>

          <p className="text-[#C4C4C4] text-[14px] leading-[150%] max-w-[439px]">
            Standalone, industry-grade software solutions designed to scale
            complex corporate operations.
          </p>

          <FooterContactDetails contact={contact} />

          {socials && socials.length > 0 && (
            <FooterSocialLinks links={socials} />
          )}
        </div>

        <FooterProductColumn title="Applications" items={applications} />
        <FooterProductColumn title="Infrastructure" items={infrastructure} />
        <FooterLinkColumn
          title="Company"
          links={companyLinks}
          supportLink={supportLink}
        />
      </div>

      <div className="w-full border-t border-[#FFFFFF] max-w-[1160px] mx-auto"></div>

      <FooterBottomBar copyright={copyright} links={bottomLinks} />
    </div>
  </footer>
);

export default Footer;

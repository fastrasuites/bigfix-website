import type { AboutHeroProps } from "../../types";

/**
 * About page hero with the company positioning statement.
 */
const AboutHero = ({ backgroundImage }: AboutHeroProps): JSX.Element => (
  <section className="relative w-full min-h-[calc(100vh-100.23px)] overflow-hidden flex items-center">
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    ></div>
    <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F] via-[#0A192F]/90 to-[#0A192F]/40"></div>

    <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[94px] flex flex-col justify-center pt-16 pb-24 lg:pt-[100px] lg:pb-[150px]">
      <div className="inline-block border border-[#1EBED4] rounded-full px-4 py-1.5 lg:px-[24px] lg:py-[8px] text-[#1EBED4] text-[10px] lg:text-[12px] font-semibold tracking-[0.05em] uppercase mb-6 lg:mb-[24px] w-fit bg-[#1EBED4]/5 backdrop-blur-sm">
        Our Company
      </div>
      <div className="max-w-[795px]">
        <h1 className="text-[36px] md:text-[48px] lg:text-[72px] font-bold text-white leading-[1.1] mb-4 lg:mb-[16px] tracking-tight">
          Technology Built <br className="hidden md:block" />
          <span className="text-[#00B4D8]">to Help Businesses</span>{" "}
          <br className="hidden md:block" />
          Work Better.
        </h1>
      </div>
      <p className="text-slate-300 text-[16px] lg:text-[20px] leading-[1.6] max-w-[795px] mb-8 lg:mb-[40px] font-normal">
        We bridge the gap between strategic vision and technical execution.
        BigFix Integrated Technologies engineers robust, unified frameworks
        tailored to solve the complex financial, operational, and technology
        challenges faced by modern organizations.
      </p>
      {/* <a
        href={`#${OUR_COMPANY_SECTION_ID}`}
        className="inline-block bg-[#1EBED4] hover:bg-[#00B4D8] text-white font-semibold text-[16px] leading-[19.2px] tracking-[0.2px] px-[43px] py-[18px] rounded-[10px] transition-all duration-300 ease-in-out w-fit shadow-lg hover:shadow-[#1EBED4]/30 hover:-translate-y-0.5"
        onClick={handleCompanyClick}
      >
        Our Company
      </a> */}
    </div>
  </section>
);

export default AboutHero;

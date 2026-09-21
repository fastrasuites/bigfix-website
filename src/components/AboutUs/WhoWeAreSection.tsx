import { OUR_COMPANY_SECTION_ID } from "../../constants/links";

/**
 * "Who We Are" section: company summary plus the approach quote box.
 */
const WhoWeAreSection = (): JSX.Element => (
  <section
    id={OUR_COMPANY_SECTION_ID}
    className="w-full bg-white py-16 lg:py-[120px] px-4 md:px-8 lg:px-[140px]"
  >
    <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between gap-12 lg:gap-[100px]">
      <div className="flex-1 max-w-[497px] flex flex-col gap-4">
        <span className="text-[#E37016] font-semibold text-[16px] leading-[24px] tracking-[-0.2px] uppercase">
          Who We Are
        </span>
        <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-bold leading-[1.2] tracking-[0.2px] text-[#0A2F5A]">
          Our Company
        </h2>
        <div className="w-[100px] h-[4px] bg-[#00B4D8] mt-2 rounded-full"></div>
      </div>

      <div className="flex-1 max-w-[687px] flex flex-col gap-6">
        <p className="text-[18px] md:text-[24px] font-medium text-[#1A1A1AF5] leading-[1.4] tracking-[0.2px]">
          BigFix Integrated Technologies develops technology solutions that help
          businesses manage their financial, operational, and technology needs.
        </p>
        <p className="text-[16px] lg:text-[20px] text-[#1A1A1ACC] leading-[1.6] tracking-[0.2px]">
          We build business applications and cloud infrastructure designed
          around real business requirements — from managing financial
          operations and projects to running the systems that support them.
        </p>

        {/* Quote Box */}
        <div className="w-full bg-[#0A2F5A] rounded-[20px] p-[32px] flex gap-[16px] items-start mt-4">
          <div className="text-[#00B4D8] flex-shrink-0 mt-1">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.748-9.072 8.983-9.072v3.857c-2.665 0-4.375 1.586-4.375 4.152v1.075h4.375v7.379h-8.983zm-14.017 0v-7.391c0-5.704 3.748-9.072 8.983-9.072v3.857c-2.665 0-4.375 1.586-4.375 4.152v1.075h4.375v7.379h-8.983z" />
            </svg>
          </div>
          <p className="text-[#FFFFFF] text-[18px] lg:text-[22px] font-bold leading-[1.4] tracking-[0.2px]">
            Our approach is simple: understand the problem, build the right
            solution, and make technology work for the business.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default WhoWeAreSection;
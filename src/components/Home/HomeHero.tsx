import type { HomeHeroProps } from "../../types";

/**
 * Hero banner shown at the top of the Home and About pages.
 */
const HomeHero = ({
  badge,
  titleLine1,
  titleLine2,
  description,
  buttonLabel,
  backgroundImage,
  onButtonClick,
}: HomeHeroProps): JSX.Element => (
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
        {badge}
      </div>
      <div className="max-w-200">
        <h1 className="text-[36px] md:text-[48px] lg:text-[64px] font-bold text-white leading-[1.1] mb-1 lg:mb-[4px] tracking-tight">
          {titleLine1}
        </h1>
        <h2 className="text-[36px] md:text-[48px] lg:text-[64px] font-bold text-[#1EBED4] leading-[1.1] block mb-6 lg:mb-[32px] tracking-tight">
          {titleLine2}
        </h2>
      </div>
      <p className="text-slate-300 text-[16px] lg:text-[18px] leading-[1.6] max-w-[680px] mb-8 lg:mb-[40px] font-normal">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-[24px]">
        <button
          className="w-full sm:w-auto bg-[#E37016] hover:bg-[#c96012] text-white px-6 lg:px-[32px] py-3 lg:py-[16px] rounded-[8px] font-semibold text-[16px] transition-colors shadow-lg text-center justify-center flex"
          onClick={onButtonClick}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  </section>
);

export default HomeHero;

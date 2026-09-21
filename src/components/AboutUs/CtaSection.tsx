/**
 * Closing call-to-action band on the About page.
 */
const CtaSection = (): JSX.Element => (
  <section className="w-full bg-[#0A2F5A] py-16 lg:py-[120px] px-4 md:px-8 relative overflow-hidden">
    {/* Background Grid Pattern Effect */}
    <div
      className="absolute inset-0 opacity-10 pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }}
    ></div>

    <div className="w-full max-w-[1440px] mx-auto flex flex-col items-center text-center relative z-10">
      <span className="text-[#E37016] font-semibold text-[16px] leading-[24px] tracking-[-0.2px] uppercase mb-4">
        Let's Work Together
      </span>
      <h2 className="text-[36px] md:text-[48px] font-bold leading-[1.2] tracking-[0.2px] text-white mb-6">
        Have a Business or <br />
        <span className="text-[#00B4D8]">Technology Challenge?</span>
      </h2>
      <p className="text-[16px] lg:text-[18px] text-[#A8A8A8] leading-[1.7] tracking-[0.2px] max-w-[762px] mb-10">
        CloudOne provides secure, high-performance virtual servers for hosting
        business applications, databases, websites, and development workloads.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-[24px]">
        <button className="w-full sm:w-auto bg-[#E37016] hover:bg-[#c96012] text-white px-6 lg:px-[43px] py-4 lg:py-[18px] rounded-[10px] font-semibold text-[16px] transition-colors shadow-lg text-center justify-center flex">
          Talk to Our Team
        </button>
        <button className="w-full sm:w-auto border border-white/80 hover:border-white hover:bg-white/10 text-white px-6 lg:px-[43px] py-4 lg:py-[18px] rounded-[10px] font-semibold text-[16px] transition-colors flex items-center justify-center gap-2 backdrop-blur-sm">
          Explore Our Products
        </button>
      </div>
    </div>
  </section>
);

export default CtaSection;
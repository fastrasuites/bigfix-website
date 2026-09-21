import type { CloudOneSectionProps } from "../../types";
import CloudFeatureCard from "./CloudFeatureCard";
import CloudOneIntro from "./CloudOneIntro";

/**
 * CloudOne hosting section: dark panel with the grid pattern background.
 */
const CloudOneSection = ({ features }: CloudOneSectionProps): JSX.Element => (
  <section className="w-full bg-[#F7F7F7] py-16 lg:py-[120px] px-4 md:px-8">
    <div className="w-full max-w-[1440px] mx-auto">
      <div className="w-full bg-[#0A2F5A] rounded-[24px] lg:rounded-[32px] p-8 lg:p-[80px] flex flex-col lg:flex-row gap-12 lg:gap-[54px] relative overflow-hidden">
        {/* Background Grid Pattern Effect */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        ></div>

        <CloudOneIntro />

        <div className="flex-1 flex flex-col gap-[26px] w-full max-w-[609px] relative z-10 justify-center">
          {features.map((feature) => (
            <CloudFeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default CloudOneSection;
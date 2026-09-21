import type { ModuleDeepDiveProps } from "../../types";
import ModuleFeatureCard from "./ModuleFeatureCard";

/**
 * "Module Deep-Dive" section: heading plus a two-column grid of feature cards.
 */
const ModuleDeepDive = ({
  eyebrow = "Module Deep-Dive",
  titleLine1,
  titleLine2,
  description,
  features,
  id,
}: ModuleDeepDiveProps): JSX.Element => (
  <section
    id={id}
    className="w-full bg-white py-16 lg:py-[120px] px-4 md:px-8"
  >
    <div className="w-full max-w-[1160px] mx-auto flex flex-col items-center">
      <div className="flex flex-col items-center text-center gap-4 mb-12 lg:mb-[60px] max-w-[894px]">
        <span className="text-[#E37016] font-semibold text-[16px] uppercase tracking-[-0.2px] leading-[24px]">
          {eyebrow}
        </span>
        <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-bold leading-[1.2] tracking-[0.2px]">
          <span className="text-[#0A2F5A]">{titleLine1}</span>
          <br className="hidden md:block" />
          <span className="text-[#00B4D8]">{titleLine2}</span>
        </h2>
        <p className="text-[16px] lg:text-[20px] leading-[1.5] lg:leading-[30px] text-[#A8A8A8] tracking-[0.2px] mt-2">
          {description}
        </p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-[26px]">
        {features.map((feature) => (
          <ModuleFeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </div>
  </section>
);

export default ModuleDeepDive;

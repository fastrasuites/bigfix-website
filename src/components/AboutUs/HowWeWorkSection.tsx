import type { HowWeWorkSectionProps } from "../../types";
import WorkStepItem from "./WorkStepItem";

/**
 * "How We Work" section: intro copy plus the numbered process steps.
 */
const HowWeWorkSection = ({ steps }: HowWeWorkSectionProps): JSX.Element => (
  <section className="w-full bg-white py-16 lg:py-[120px] px-4 md:px-8 lg:px-[140px]">
    <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-16">
      <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-[100px]">
        <div className="flex-1 max-w-[631px] flex flex-col gap-4">
          <span className="text-[#E37016] font-semibold text-[16px] leading-[24px] tracking-[-0.2px] uppercase">
            How We Work
          </span>
          <h2 className="text-[36px] md:text-[48px] font-bold leading-[1.1] tracking-[0.2px] text-[#0A2F5A]">
            We Focus on What <br className="hidden md:block" /> Businesses{" "}
            <br />
            <span className="text-[#00B4D8]">Actually Need</span>
          </h2>
        </div>
        <div className="flex-1 max-w-[631px] flex items-center">
          <p className="text-[16px] lg:text-[18px] text-[#1A1A1ACC] leading-[1.7] tracking-[0.2px]">
            Technology should solve problems, not create more of them. That's
            why we take a practical approach to every solution we build and
            deliver.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-[40px]">
        {steps.map((step) => (
          <WorkStepItem key={step.num} step={step} />
        ))}
      </div>
    </div>
  </section>
);

export default HowWeWorkSection;
import { useState } from "react";
import type { SolutionsAccordionProps } from "../../types";
import SolutionPanel from "./SolutionPanel";

/** Solution expanded on first render. */
const DEFAULT_OPEN_SOLUTION = "optima";

/**
 * "Custom Enterprise Solutions" accordion. Owns the open/closed state and
 * delegates each row to `SolutionPanel`.
 */
const SolutionsAccordion = ({
  solutions,
}: SolutionsAccordionProps): JSX.Element => {
  const [activeSolution, setActiveSolution] = useState<string | null>(
    DEFAULT_OPEN_SOLUTION,
  );

  const toggleSolution = (id: string): void => {
    setActiveSolution((current) => (current === id ? null : id));
  };

  return (
    <section className="w-full bg-white py-16 lg:py-[100px]">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col gap-[40px]">
        <div className="flex flex-col gap-4">
          <h2 className="text-[32px] md:text-[42px] lg:text-[56px] font-bold leading-[1.2] tracking-[0.2px] text-[#0A2F5A] max-w-[860px]">
            Custom Enterprise Solutions <br className="hidden lg:block" />
            <span className="text-[#00B4D8]">
              Deployed Seamlessly Around Your Business.
            </span>
          </h2>
          <p className="text-[16px] md:text-[20px] font-normal leading-[1.5] tracking-[0.2px] text-[#A8A8A8] max-w-[795px]">
            We eliminate the risk and complexity of digital transformation.
            BigFix architects integrate and optimize high-performance software
            ecosystems tailored entirely to your organization’s unique
            operational DNA delivering total system harmony from day one.
          </p>
        </div>

        <div className="w-full bg-[#F7F7F7] rounded-[32px] border border-[#A8A8A8] flex flex-col overflow-hidden">
          {solutions.map((solution, index) => (
            <SolutionPanel
              key={solution.id}
              solution={solution}
              isOpen={activeSolution === solution.id}
              isLast={index === solutions.length - 1}
              onToggle={toggleSolution}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsAccordion;

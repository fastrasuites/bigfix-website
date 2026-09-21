import type { SolutionPanelProps } from "../../types";
import SolutionDetails from "./SolutionDetails";

/**
 * A single accordion row: the always-visible summary plus the collapsible
 * details panel.
 */
const SolutionPanel = ({
  solution,
  isOpen,
  isLast,
  onToggle,
}: SolutionPanelProps): JSX.Element => (
  <div
    className={`w-full flex flex-col ${
      isLast ? "" : "border-b-[0.5px] border-[#A8A8A8]"
    }`}
  >
    <div
      className="w-full flex justify-between items-center p-6 lg:p-[32px] cursor-pointer transition-colors hover:bg-black/5"
      onClick={() => onToggle(solution.id)}
    >
      <div className="flex items-center gap-4 lg:gap-[16px]">
        <div
          className={`w-[48px] h-[48px] rounded-[10px] flex items-center justify-center ${solution.bgColor}`}
        >
          {solution.icon}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-[20px] lg:text-[24px] font-bold text-[#0A2F5A] leading-[1.2] tracking-[0.2px]">
            {solution.title}
          </h3>
          <p className="text-[12px] lg:text-[14px] font-normal text-[#A8A8A8] leading-[1.5] tracking-[-0.2px]">
            {solution.subtitle}
          </p>
        </div>
      </div>
      <svg
        className={`w-6 h-6 text-[#A8A8A8] transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    </div>

    {isOpen && <SolutionDetails solution={solution} />}
  </div>
);

export default SolutionPanel;
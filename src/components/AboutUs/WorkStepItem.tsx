import type { WorkStepItemProps } from "../../types";

/**
 * A single numbered "How We Work" step.
 */
const WorkStepItem = ({ step }: WorkStepItemProps): JSX.Element => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-4">
      <div
        className="w-[48px] h-[48px] rounded-full border-2 flex items-center justify-center text-[16px] font-bold"
        style={{ borderColor: step.color, color: step.color }}
      >
        {step.num}
      </div>
      <div
        className="w-[48px] h-[2px]"
        style={{ backgroundColor: step.color }}
      ></div>
    </div>
    <h3 className="text-[22px] font-extrabold text-[#0A2F5A] leading-[1.2] tracking-[0.2px] mt-2">
      {step.title}
    </h3>
    <p className="text-[16px] text-[#1A1A1ACC] leading-[1.6] tracking-[-0.2px]">
      {step.desc}
    </p>
  </div>
);

export default WorkStepItem;
import type { ApproachCardItemProps } from "../../types";

/**
 * A single capability card from the "Our Approach" grid.
 */
const ApproachCardItem = ({ card }: ApproachCardItemProps): JSX.Element => (
  <div className="bg-white border border-[#C4C4C4]/20 rounded-[10px] p-[40px] flex flex-col gap-4">
    <div
      className="w-[24px] h-[24px] flex items-center justify-center"
      style={{ color: card.color }}
    >
      {card.icon}
    </div>
    <h3 className="text-[18px] font-bold text-[#0A2F5A] leading-[1.2] tracking-[-0.2px]">
      {card.title}
    </h3>
    <p className="text-[14px] text-[#1A1A1ACC] leading-[1.5] tracking-[-0.2px]">
      {card.subtitle}
    </p>
  </div>
);

export default ApproachCardItem;
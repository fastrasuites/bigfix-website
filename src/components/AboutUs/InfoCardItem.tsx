import type { InfoCardItemProps } from "../../types";

/**
 * Vision or mission card.
 */
const InfoCardItem = ({ card }: InfoCardItemProps): JSX.Element => (
  <div className="bg-[#0A2F5A] rounded-[20px] p-8 lg:p-[40px] flex flex-col gap-6 relative overflow-hidden">
    <div className="flex items-center gap-3">
      <div
        className={`w-[40px] h-[40px] rounded-[8px] ${card.iconBgClass} flex items-center justify-center ${card.accentClass}`}
      >
        {card.icon}
      </div>
      <span
        className={`${card.accentClass} font-semibold text-[16px] uppercase tracking-[-0.2px]`}
      >
        {card.title}
      </span>
    </div>
    <h3 className="text-[22px] font-extrabold text-white leading-[1.2] tracking-[0.2px]">
      {card.heading}
    </h3>
    <p className="text-[14px] text-[#DEDEDE] leading-[1.6] tracking-[0.2px]">
      {card.description}
    </p>
  </div>
);

export default InfoCardItem;
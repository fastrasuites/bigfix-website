import type { CloudFeatureCardProps } from "../../types";

/**
 * A CloudOne capability card.
 */
const CloudFeatureCard = ({ feature }: CloudFeatureCardProps): JSX.Element => (
  <div className="w-full bg-[#FFFFFF1A] border border-[#FFFFFF33] rounded-[10px] p-6 flex flex-col gap-3 backdrop-blur-sm">
    <div className="flex items-center gap-3">
      <div className="w-[12px] h-[12px] bg-[#00B4D8] rounded-full flex-shrink-0"></div>
      <h3 className="text-[18px] font-semibold text-[#F7F7F7] leading-[21.6px] tracking-[-0.2px]">
        {feature.title}
      </h3>
    </div>
    <p className="text-[14px] font-normal text-[#F7F7F7] opacity-80 leading-[24px] tracking-[-0.2px] pl-[24px]">
      {feature.desc}
    </p>
  </div>
);

export default CloudFeatureCard;
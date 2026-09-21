import OutlineIcon from "../common/OutlineIcon";
import { BOLT_ICON_PATH, CHECK_ICON_PATH } from "../../constants/icons";
import type { ModuleFeatureCardProps } from "../../types";

/**
 * A single deep-dive feature card with a bulleted list of points.
 */
const ModuleFeatureCard = ({
  feature,
}: ModuleFeatureCardProps): JSX.Element => (
  <div className="bg-[#F7F7F7] rounded-[16px] p-6 lg:p-[32px] flex flex-col gap-6">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-[4px] bg-[#00B4D826] flex items-center justify-center text-[#00B4D8] flex-shrink-0">
        <OutlineIcon path={BOLT_ICON_PATH} />
      </div>
      <h3 className="text-[18px] font-bold text-[#0A2F5A] leading-[1.2] tracking-[-0.2px]">
        {feature.title}
      </h3>
    </div>

    <div className="flex flex-col gap-5">
      {feature.items.map((item) => (
        <div key={item.subtitle} className="flex gap-3 items-start">
          <OutlineIcon
            path={CHECK_ICON_PATH}
            className="w-5 h-5 text-[#00B4D8] flex-shrink-0 mt-0.5"
            strokeWidth={2.5}
          />
          <div className="flex flex-col gap-1">
            <h4 className="text-[16px] font-semibold text-[#0A2F5A] leading-[1.3] tracking-[-0.2px]">
              {item.subtitle}
            </h4>
            <p className="text-[14px] text-[#1A1A1ACC] leading-[1.7] tracking-[-0.2px]">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ModuleFeatureCard;
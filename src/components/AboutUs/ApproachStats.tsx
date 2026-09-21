import { Fragment } from "react";
import type { ApproachStatsProps } from "../../types";

/**
 * Stats row displayed underneath the "Our Approach" cards.
 */
const ApproachStats = ({ stats }: ApproachStatsProps): JSX.Element => (
  <div className="w-full bg-[#F7F7F7] rounded-[10px] p-[32px] flex justify-around items-center mt-2">
    {stats.map((stat, index) => (
      <Fragment key={stat.label}>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[32px] font-bold text-[#0A2F5A] leading-[1]">
            {stat.value}
          </span>
          <span className="text-[14px] text-[#1A1A1ACC] font-medium">
            {stat.label}
          </span>
        </div>
        {index < stats.length - 1 && (
          <div className="w-[1px] h-[40px] bg-[#C4C4C4]/30"></div>
        )}
      </Fragment>
    ))}
  </div>
);

export default ApproachStats;
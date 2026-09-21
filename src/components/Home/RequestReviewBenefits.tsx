import OutlineIcon from "../common/OutlineIcon";
import type { RequestReviewBenefitsProps } from "../../types";

/**
 * Checklist of service guarantees shown next to the request form.
 */
const RequestReviewBenefits = ({
  benefits,
}: RequestReviewBenefitsProps): JSX.Element => (
  <div className="flex flex-col gap-4 mt-4">
    {benefits.map((benefit) => (
      <div key={benefit.text} className="flex items-center gap-3">
        <div
          className={`w-6 h-6 flex items-center justify-center ${benefit.colorClass} flex-shrink-0`}
        >
          <OutlineIcon path={benefit.iconPath} />
        </div>
        <span className="text-[16px] font-medium text-[#1A1A1ACC] leading-[21.6px] tracking-[-0.2px]">
          {benefit.text}
        </span>
      </div>
    ))}
  </div>
);

export default RequestReviewBenefits;
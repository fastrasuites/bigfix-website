import type { RequestReviewInfoProps } from "../../types";
import RequestReviewBenefits from "./RequestReviewBenefits";

/**
 * Left column of the review section: eyebrow, heading, intro copy and the
 * benefit checklist.
 */
const RequestReviewInfo = ({
  benefits,
}: RequestReviewInfoProps): JSX.Element => (
  <div className="flex-1 max-w-[559px] flex flex-col gap-6">
    <span className="text-[#E37016] font-semibold text-[16px] leading-[24px] tracking-[-0.2px] uppercase">
      Why Modular Works
    </span>
    <h2 className="text-[32px] lg:text-[40px] font-bold leading-[1.2] lg:leading-[100%] tracking-[0.2px]">
      <span className="text-[#0A2F5A]">Let's Find the Right</span>
      <br className="hidden md:block" />
      <span className="text-[#00B4D8]">Solution for Your Business</span>
    </h2>
    <p className="text-[16px] lg:text-[18px] text-[#1A1A1ACC] leading-[1.7] lg:leading-[30px] tracking-[0.2px]">
      Tell us what you're looking for and our team will help you identify the
      right BigFix solution.
    </p>

    <RequestReviewBenefits benefits={benefits} />
  </div>
);

export default RequestReviewInfo;
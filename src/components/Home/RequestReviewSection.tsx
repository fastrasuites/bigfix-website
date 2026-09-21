import { REQUEST_REVIEW_SECTION_ID } from "../../constants/links";
import type { RequestReviewSectionProps } from "../../types";
import RequestReviewForm from "./RequestReviewForm";
import RequestReviewInfo from "./RequestReviewInfo";

/**
 * Contact section that pairs the value proposition with the review request
 * form.
 */
const RequestReviewSection = ({
  benefits,
}: RequestReviewSectionProps): JSX.Element => (
  <section
    id={REQUEST_REVIEW_SECTION_ID}
    className="w-full bg-[#F9F9F9] py-16 lg:py-[120px] px-4 md:px-8 lg:px-[140px]"
  >
    <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-[100px]">
      <RequestReviewInfo benefits={benefits} />
      <RequestReviewForm />
    </div>
  </section>
);

export default RequestReviewSection;
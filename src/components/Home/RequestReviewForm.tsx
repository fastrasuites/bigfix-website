import SelectField from "../common/SelectField";
import TextField from "../common/TextField";
import type { SelectOption } from "../../types";

const PRODUCT_OPTIONS: SelectOption[] = [
  { value: "fastra", label: "FastraSuite" },
  { value: "enterprise", label: "EnterpriseOne" },
  { value: "optima", label: "OptimaOne" },
];

const TIMELINE_OPTIONS: SelectOption[] = [
  { value: "immediate", label: "Immediately" },
  { value: "1-3", label: "1-3 Months" },
  { value: "3-6", label: "3-6 Months" },
  { value: "6+", label: "6+ Months" },
];

/**
 * Right column of the review section: the request form card.
 */
const RequestReviewForm = (): JSX.Element => (
  <div className="w-full lg:w-[542px] flex-shrink-0">
    <div className="bg-white rounded-[32px] p-6 lg:p-[40px_32px] shadow-2xl flex flex-col gap-[26px]">
      <h3 className="text-[18px] font-bold text-[#0A2F5A] leading-[21.6px] tracking-[-0.2px]">
        Request a Systems Architecture Review
      </h3>

      <form className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Full Name*" placeholder="Sarah Alen" />
          <TextField
            label="Corporate Email *"
            type="email"
            placeholder="Sarah Alen"
          />
        </div>

        <TextField
          label="Company Name *"
          placeholder="Meridian Capital Holdings"
        />
        <SelectField
          label="Primary Product of Interest *"
          placeholder="What are you interested in?"
          options={PRODUCT_OPTIONS}
        />
        <TextField
          label="Primary Operation *"
          placeholder="Tell us briefly what you need"
        />
        <SelectField
          label="Estimated Project Timeline *"
          placeholder="When are you looking to get started?"
          options={TIMELINE_OPTIONS}
        />

        <button
          type="button"
          className="w-full bg-[#0A2F5A] text-white rounded-[8px] py-4 font-bold text-[16px] hover:bg-[#0A2F5A]/90 transition-colors mt-2"
        >
          Talk to Our Team
        </button>
        <p className="text-[12px] text-[#A8A8A8] text-center mt-1">
          No spam. Your data is never shared with third parties.
        </p>
      </form>
    </div>
  </div>
);

export default RequestReviewForm;
import { FormEvent, useState } from "react";
import SelectField from "../common/SelectField";
import TextField from "../common/TextField";
import { submitForm } from "../../utils/api";
import { useFormTracking } from "../../hooks/useTracker";
import type { SelectOption } from "../../types";

const PRODUCT_OPTIONS: SelectOption[] = [
  { value: "fastra", label: "FastraSuite" },
  { value: "enterprise", label: "EnterpriseOne" },
  { value: "optima", label: "OptimaOne" },
];

const INDUSTRY_OPTIONS: SelectOption[] = [
  { value: "financial", label: "Financial Services" },
  { value: "banking", label: "Banking" },
  { value: "investment", label: "Investment Management" },
  { value: "erp", label: "Corporate ERP" },
  { value: "technology", label: "Technology" },
  { value: "construction", label: "Construction" },
  { value: "other", label: "Other" },
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
const RequestReviewForm = (): JSX.Element => {
const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    product: "",
    industry: "",
    operation: "",
    timeline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { trackSubmission } = useFormTracking();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Valid email is required";
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (!formData.product) newErrors.product = "Please select a product";
    if (!formData.industry) newErrors.industry = "Please select an industry";
    if (!formData.operation.trim()) newErrors.operation = "Operation is required";
    if (!formData.timeline) newErrors.timeline = "Please select a timeline";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrors({});

    const result = await submitForm("home_review", formData);
    setSubmitStatus(result.success ? "success" : "error");
    setIsSubmitting(false);

    if (result.success) {
      // Track submission for identity linking
      trackSubmission({
        submission_id: result.id || 0,
        email: formData.email,
        phone: formData.phone || undefined,
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        product: "",
        industry: "",
        operation: "",
        timeline: "",
      });
    }
  };

  return (
    <div className="w-full lg:w-[542px] flex-shrink-0">
      <div className="bg-white rounded-[32px] p-6 lg:p-[40px_32px] shadow-2xl flex flex-col gap-[26px]">
        <h3 className="text-[18px] font-bold text-[#0A2F5A] leading-[21.6px] tracking-[-0.2px]">
          Request a Systems Architecture Review
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Full Name*"
              placeholder="Sarah Alen"
              value={formData.name}
              onChange={(value) => handleChange("name", value)}
              error={errors.name}
            />
            <TextField
              label="Corporate Email *"
              type="email"
              placeholder="sarah@company.com"
              value={formData.email}
              onChange={(value) => handleChange("email", value)}
              error={errors.email}
            />
          </div>

<TextField
            label="Company Name *"
            placeholder="Meridian Capital Holdings"
            value={formData.company}
            onChange={(value) => handleChange("company", value)}
            error={errors.company}
          />
          <SelectField
            label="Primary Product of Interest *"
            placeholder="What are you interested in?"
            options={PRODUCT_OPTIONS}
            value={formData.product}
            onChange={(value) => handleChange("product", value)}
            error={errors.product}
          />
          <SelectField
            label="Industry *"
            placeholder="What industry are you in?"
            options={INDUSTRY_OPTIONS}
            value={formData.industry}
            onChange={(value) => handleChange("industry", value)}
            error={errors.industry}
          />
          <TextField
            label="Primary Operation *"
            placeholder="Tell us briefly what you need"
            value={formData.operation}
            onChange={(value) => handleChange("operation", value)}
            error={errors.operation}
          />
          <SelectField
            label="Estimated Project Timeline *"
            placeholder="When are you looking to get started?"
            options={TIMELINE_OPTIONS}
            value={formData.timeline}
            onChange={(value) => handleChange("timeline", value)}
            error={errors.timeline}
          />

          {submitStatus === "success" && (
            <p className="text-[#00B4D8] text-sm font-medium">
              Your request has been received. A BigFix architect will contact
              you soon.
            </p>
          )}

          {submitStatus === "error" && (
            <p className="text-red-500 text-sm font-medium">
              Something went wrong. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0A2F5A] text-white rounded-[8px] py-4 font-bold text-[16px] hover:bg-[#0A2F5A]/90 transition-colors mt-2 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Talk to Our Team"}
          </button>
          <p className="text-[12px] text-[#A8A8A8] text-center mt-1">
            No spam. Your data is never shared with third parties.
          </p>
        </form>
      </div>
    </div>
  );
};

export default RequestReviewForm;

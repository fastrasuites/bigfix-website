import type { TextFieldProps } from "../../types";

/**
 * Labelled text/email input used by the contact forms.
 */
const TextField = ({
  label,
  placeholder,
  type = "text",
}: TextFieldProps): JSX.Element => (
  <div className="flex flex-col gap-1">
    <label className="text-[13px] font-semibold text-[#0A2F5A] leading-[100%] tracking-[-0.2px]">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full border border-[#A8A8A8] rounded-[8px] px-4 py-3 text-[14px] text-[#0A2F5A] placeholder-[#A8A8A8] focus:outline-none focus:border-[#00B4D8] transition-colors"
    />
  </div>
);

export default TextField;
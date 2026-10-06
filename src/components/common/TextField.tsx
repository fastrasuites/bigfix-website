import type { TextFieldProps } from "../../types";

/**
 * Labelled text/email input used by the contact forms.
 */
const TextField = ({
  label,
  placeholder,
  type = "text",
  value = "",
  onChange,
}: TextFieldProps): JSX.Element => {
  const id = `textfield-${label.replace(/\s+/g, "-")}`;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-[13px] font-semibold text-[#0A2F5A] leading-[100%] tracking-[-0.2px]"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[#A8A8A8] rounded-[8px] px-4 py-3 text-[14px] text-[#0A2F5A] placeholder-[#A8A8A8] focus:outline-none focus:border-[#00B4D8] transition-colors"
      />
    </div>
  );
};

export default TextField;

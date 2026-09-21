import type { SelectFieldProps } from "../../types";

/**
 * Labelled select with the custom chevron indicator.
 */
const SelectField = ({
  label,
  placeholder,
  options,
}: SelectFieldProps): JSX.Element => (
  <div className="flex flex-col gap-1">
    <label className="text-[13px] font-semibold text-[#0A2F5A] leading-[100%] tracking-[-0.2px]">
      {label}
    </label>
    <div className="relative">
      <select
        defaultValue=""
        className="w-full border border-[#A8A8A8] rounded-[8px] px-4 py-3 text-[14px] text-[#A8A8A8] focus:outline-none focus:border-[#00B4D8] transition-colors appearance-none bg-white"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#A8A8A8]">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </div>
);

export default SelectField;
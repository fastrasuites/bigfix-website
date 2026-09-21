/**
 * An option rendered inside a `SelectField`.
 */
export interface SelectOption {
  value: string;
  label: string;
}

export interface TextFieldProps {
  label: string;
  placeholder: string;
  type?: "text" | "email";
}

export interface SelectFieldProps {
  label: string;
  /** Placeholder copy rendered as the disabled first option. */
  placeholder: string;
  options: SelectOption[];
}
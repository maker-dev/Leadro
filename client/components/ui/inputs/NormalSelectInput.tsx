import React from "react";
import clsx from "clsx";
import { FieldError } from "react-hook-form";

export type NormalSelectInputOption = {
  value: string;
  label: string;
};

export type NormalSelectInputProps =
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    id?: string;
    name?: string;
    options: NormalSelectInputOption[];
    error?: FieldError;
  };

const NormalSelectInput: React.FC<NormalSelectInputProps> = ({
  label,
  id,
  name,
  options,
  error,
  className = "",
  required = false,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id || name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id || name}
        name={name}
        required={required}
        className={clsx(
          "rounded px-4 py-2 h-11 bg-white text-gray-700 border focus:ring-2 focus:border-blue-500 focus:ring-blue-500",
          error ? "border-red-500" : "border-gray-300",
          className
        )}
        aria-required={required}
        aria-invalid={!!error}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span
        className={clsx(
          "text-xs min-h-[20px]",
          error ? "text-red-500 visible" : "invisible"
        )}
      >
        {error?.message || "placeholder"}
      </span>
    </div>
  );
};

export default NormalSelectInput;

import React from "react";
import clsx from "clsx";
import { FieldError } from "react-hook-form";

export type NormalTextInputProps =
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: FieldError;
  };

const NormalTextInput: React.FC<NormalTextInputProps> = ({
  label,
  id,
  name,
  type = "text",
  required = false,
  className = "",
  error,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id || name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id || name}
        name={name}
        type={type}
        required={required}
        className={clsx(
          "w-full border rounded px-4 py-2 h-11 focus:ring-2 text-base focus:border-blue-500 focus:ring-blue-500",
          error ? "border-red-500" : "border-gray-300",
          className
        )}
        aria-required={required}
        aria-invalid={!!error}
        {...props}
      />
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

export default NormalTextInput;

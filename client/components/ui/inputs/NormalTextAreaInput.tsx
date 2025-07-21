import React from "react";
import clsx from "clsx";
import { FieldError } from "react-hook-form";

export type NormalTextAreaInputProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    id?: string;
    name?: string;
    error?: FieldError;
  };

const NormalTextAreaInput: React.FC<NormalTextAreaInputProps> = ({
  label,
  id,
  name,
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
      <textarea
        id={id || name}
        name={name}
        required={required}
        className={clsx(
          "rounded px-4 py-2 min-h-[80px] border focus:ring-2 text-base focus:border-black/60 focus:ring-black/60 outline-none transition w-full",
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

export default NormalTextAreaInput;

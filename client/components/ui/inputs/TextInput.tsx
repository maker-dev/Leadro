import React from "react";
import clsx from "clsx";
import { FieldError } from "react-hook-form";

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: FieldError;
};

const TextInput: React.FC<TextInputProps> = ({
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
    <label className="block w-full" htmlFor={id || name}>
      <span className="block mb-1 text-base font-bold text-black">{label}</span>
      <input
        id={id || name}
        name={name}
        type={type}
        required={required}
        className={clsx(
          "block w-full rounded-2xl border bg-white text-gray-700 placeholder-gray-400 placeholder:font-bold shadow-sm focus:border-blue-500 focus:ring-blue-500 px-5 py-3 text-base",
          className,
          error ? "border-red-500" : "border-gray-300"
        )}
        aria-required={required}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <span className="text-red-500 text-sm mt-1">{error.message}</span>
      )}
    </label>
  );
};

export default TextInput;

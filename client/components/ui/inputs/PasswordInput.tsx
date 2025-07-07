import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import clsx from "clsx";
import { FieldError } from "react-hook-form";

export type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: FieldError;
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  id,
  name,
  required = false,
  className = "",
  error,
  ...props
}) => {
  const [show, setShow] = useState(false);

  const handleToggle = () => setShow((prev) => !prev);

  return (
    <div className="w-full">
      <label
        htmlFor={id || name}
        className="block text-base font-bold text-black mb-1"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id || name}
          name={name}
          type={show ? "text" : "password"}
          required={required}
          className={clsx(
            "block w-full rounded-2xl border bg-white text-gray-700 placeholder-gray-400 placeholder:font-bold shadow-sm focus:border-blue-500 focus:ring-blue-500 px-5 py-3 text-base pr-12",
            className,
            error ? "border-red-500" : "border-gray-300"
          )}
          aria-required={required}
          aria-invalid={!!error}
          {...props}
        />
        <button
          type="button"
          tabIndex={0}
          aria-label={show ? "Hide password" : "Show password"}
          onClick={handleToggle}
          onMouseDown={(e) => e.preventDefault()}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          {show ? <FiEyeOff size={22} /> : <FiEye size={22} />}
        </button>
      </div>

      {/* Reserved space for error */}
      <span
        className={clsx(
          "block mt-1 text-sm h-[20px]",
          error ? "text-red-500 visible" : "invisible"
        )}
      >
        {error?.message || "placeholder"}
      </span>
    </div>
  );
};

export default PasswordInput;

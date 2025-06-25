import React from "react";
import clsx from "clsx";

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const TextInput: React.FC<TextInputProps> = ({
  label,
  id,
  name,
  type = "text",
  required = false,
  className = "",
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
          "block w-full rounded-2xl border border-gray-300 bg-white text-gray-700 placeholder-gray-400 placeholder:font-bold shadow-sm focus:border-blue-500 focus:ring-blue-500 px-5 py-3 text-base",
          className
        )}
        aria-required={required}
        {...props}
      />
    </label>
  );
};

export default TextInput;

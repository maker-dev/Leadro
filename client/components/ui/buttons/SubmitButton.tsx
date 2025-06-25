import React from "react";
import clsx from "clsx";
import { FaSpinner } from "react-icons/fa";

type SubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children: React.ReactNode;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
  loading = false,
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      type="submit"
      className={clsx(
        "w-full rounded-2xl py-3 mt-6 text-lg font-semibold text-white shadow transition",
        "bg-[#31B5B2] hover:bg-[#269e9b]",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#31B5B2]",
        "disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer",
        className
      )}
      disabled={loading || props.disabled}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <FaSpinner className="animate-spin" />
          Submitting...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default SubmitButton;

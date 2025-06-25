import React from "react";

type SubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children: React.ReactNode;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
  loading = false,
  children,
  ...props
}) => {
  return (
    <button
      type="submit"
      className="w-full bg-[#31B5B2] hover:bg-[#269e9b] text-white font-semibold py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-[#31B5B2] focus:ring-offset-2 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      disabled={loading || props.disabled}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block animate-pulse">Submitting...</span>
      ) : (
        children
      )}
    </button>
  );
};

export default SubmitButton;

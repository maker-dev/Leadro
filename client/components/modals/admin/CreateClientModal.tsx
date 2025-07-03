import { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "@/components/ui/inputs/TextInput";
import PasswordInput from "@/components/ui/inputs/PasswordInput";
import { formSchema } from "@/app/register/schema";
import { FormValues } from "@/app/register/types";

type AddClientProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
};

const CreateClientModal = ({ isOpen, onClose, onSubmit }: AddClientProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  // Focus trap and Esc to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'input, button, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstInput = modalRef.current.querySelector("input");
      firstInput && (firstInput as HTMLElement).focus();
    }
    if (!isOpen) reset();
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm backdrop-saturate-150 transition-all">
      <div
        ref={modalRef}
        className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-md p-0 relative animate-fadeInScale"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-client-title"
      >
        <div className="rounded-t-2xl bg-[#269e9b] px-6 py-4">
          <h2
            id="add-client-title"
            className="text-lg font-bold text-white tracking-wide"
          >
            Add Client
          </h2>
        </div>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 px-6 py-6"
          noValidate
        >
          <TextInput
            label="Full Name"
            placeholder="Nanyonga Rahmah"
            {...register("name")}
            error={errors.name}
          />
          <TextInput
            label="Email"
            type="email"
            placeholder="ugaka1204@gmail.com"
            {...register("email")}
            error={errors.email}
          />
          <PasswordInput
            label="Password"
            placeholder="Password"
            {...register("password")}
            error={errors.password}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
            error={errors.confirmPassword}
          />
          <div className="border-t border-gray-100 pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-[#31B5B2] text-white font-semibold shadow hover:bg-[#269e9b] focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            >
              Add Client
            </button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .animate-fadeInScale {
          animation: fadeInScale 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default CreateClientModal;

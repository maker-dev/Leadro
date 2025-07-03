import { useRef, useEffect, useState } from "react";

type AddClientProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => void;
};

const CreateClientModal = ({ isOpen, onClose, onSubmit }: AddClientProps) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const modalRef = useRef<HTMLDivElement>(null);

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
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
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
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white shadow-sm transition"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white shadow-sm transition"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white shadow-sm transition"
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white shadow-sm transition"
              required
              autoComplete="new-password"
            />
          </div>
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
              className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
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

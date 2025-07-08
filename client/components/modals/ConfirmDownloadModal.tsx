import React, { useEffect, useRef } from "react";
import { FaDownload, FaTimes } from "react-icons/fa";

interface ConfirmDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

const ConfirmDownloadModal: React.FC<ConfirmDownloadModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Download Leads",
  description = "Are you sure you want to download the selected leads?",
  confirmLabel = "Download",
  cancelLabel = "Cancel",
  loading = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Trap focus inside modal
  useEffect(() => {
    if (!isOpen) return;
    const focusableEls = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableEls?.[0];
    const lastEl = focusableEls?.[focusableEls.length - 1];
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !focusableEls) return;
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl?.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl?.focus();
        }
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleTab);
    document.addEventListener("keydown", handleEsc);
    // Focus close button on open
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleTab);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div
        ref={modalRef}
        className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-0 animate-scaleIn focus:outline-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-download-modal-title"
        aria-describedby="confirm-download-modal-desc"
        tabIndex={-1}
      >
        {/* Close button */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-1 transition"
        >
          <FaTimes size={18} />
        </button>
        {/* Icon */}
        <div className="flex flex-col items-center pt-8">
          <span className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-2">
            <FaDownload className="text-blue-500" size={32} />
          </span>
        </div>
        {/* Title */}
        <div className="px-8 pt-2 pb-0 text-center">
          <h2
            id="confirm-download-modal-title"
            className="text-xl font-bold text-gray-900 tracking-wide mb-2"
          >
            {title}
          </h2>
        </div>
        {/* Description */}
        <div className="px-8 pb-6 text-center">
          <p
            id="confirm-download-modal-desc"
            className="text-gray-700 mb-6 text-base"
          >
            {description}
          </p>
          <div className="flex flex-col sm:flex-row-reverse gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition font-medium"
              disabled={loading}
              tabIndex={0}
              aria-label="Cancel download"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition flex items-center justify-center gap-2"
              disabled={loading}
              tabIndex={0}
              aria-label="Confirm download"
            >
              {loading ? "Processing..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .animate-scaleIn {
          animation: scaleIn 0.22s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes scaleIn {
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

export default ConfirmDownloadModal;

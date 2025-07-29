import React, { useState } from "react";
import Link from "next/link";
import { FiPhone, FiMail, FiEdit2, FiTrash2 } from "react-icons/fi";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { deleteLead } from "@/services/LeadService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type LeadDetailsProps = {
  lead: {
    id: string;
    name?: string;
    email: string;
    phone?: string;
    source?: string;
    status: "new" | "contacted" | "converted" | "lost";
    created_at: string;
    extraFields?: Record<string, string>;
    message?: string;
  };
};

const statusStyles: Record<string, string> = {
  new: "bg-blue-50 text-blue-500",
  contacted: "bg-yellow-50 text-yellow-600",
  converted: "bg-green-50 text-green-600",
  lost: "bg-red-50 text-red-600",
};

const LeadDetails: React.FC<LeadDetailsProps> = ({ lead }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  const handleDeleteClick = () => setIsDeleteModalOpen(true);
  const handleConfirmDelete = async () => {
    if (!lead.id) return;
    try {
      await deleteLead({ id: lead.id });
      router.push("/client/leads");
      toast.success("Lead deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete lead");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };
  const handleCancelDelete = () => setIsDeleteModalOpen(false);

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 max-w-5xl mx-auto overflow-hidden">
      {/* Responsive Action Buttons Row */}
      <div className="flex flex-wrap sm:flex-nowrap justify-center items-center sm:justify-end gap-3 px-4 md:px-8 pt-6 w-full sm:w-auto ">
        {lead.phone && (
          <a
            href={`tel:${lead.phone}`}
            className="flex items-center gap-2 px-5 py-2 rounded-md bg-black text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition"
            aria-label="Call"
          >
            <FiPhone className="w-5 h-5" />{" "}
            <span className="hidden sm:inline">Call</span>
          </a>
        )}
        {lead.email && (
          <a
            href={`mailto:${lead.email}`}
            className="flex items-center gap-2 px-5 py-2 rounded-md bg-black text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition"
            aria-label="Email"
          >
            <FiMail className="w-5 h-5" />{" "}
            <span className="hidden sm:inline">Email</span>
          </a>
        )}
        <Link href={`/client/leads/update/${lead.id}`}>
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2 rounded-md border border-gray-400 text-gray-900 font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
            aria-label="Edit"
          >
            <FiEdit2 className="w-5 h-5" />{" "}
            <span className="hidden sm:inline">Edit</span>
          </button>
        </Link>
        <button
          type="button"
          className="flex items-center gap-2 px-5 py-2 rounded-md border border-red-400 text-red-600 font-medium bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 transition"
          aria-label="Delete"
          onClick={handleDeleteClick}
        >
          <FiTrash2 className="w-5 h-5" />{" "}
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
      <div className="px-4 md:px-6 pt-8 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {lead.name || <span className="italic text-gray-400">No Name</span>}
        </h1>
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
            statusStyles[lead.status]
          }`}
        >
          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
        </span>
      </div>
      <hr className="mb-0 border-gray-300" />
      <div className="px-4 md:px-6 pb-4 pt-4">
        <div className="divide-y divide-gray-100">
          <DetailRow label="Name" value={lead.name} />
          <DetailRow label="Email" value={lead.email} />
          <DetailRow label="Phone" value={lead.phone} />
          <DetailRow
            label="Status"
            value={lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
          />
          <DetailRow label="Source" value={lead.source} />
          <DetailRow label="Message" value={lead.message} />
          <DetailRow label="Created" value={lead.created_at} />
          {/* Render extra fields if any */}
          {lead.extraFields &&
            Object.entries(lead.extraFields).map(([key, value]) => (
              <DetailRow key={key} label={key} value={value} />
            ))}
        </div>
      </div>
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Lead"
        description="Are you sure you want to delete this lead? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center py-3 min-h-[40px]">
    <span className="sm:w-40 shrink-0 text-gray-500 font-medium capitalize">
      {label}
    </span>
    <span className="mt-1 sm:mt-0 sm:ml-6 text-gray-900 hyphens-auto max-w-lg">
      {value || <span className="italic text-gray-400">—</span>}
    </span>
  </div>
);

export default LeadDetails;

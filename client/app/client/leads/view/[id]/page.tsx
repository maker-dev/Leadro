"use client";
import { useParams, useRouter } from "next/navigation";
import LeadDetails from "@/components/ui/cards/LeadDetails";
import { useEffect, useState } from "react";
import { usePageContext } from "@/context/PageTitleContext";
import { getLead, deleteLead, Lead } from "@/services/LeadService";
import formatDate from "@/utils/formateDate";
import { toast } from "sonner";

const validStatuses = ["new", "contacted", "converted", "lost"] as const;
const getValidStatus = (
  status: any
): "new" | "contacted" | "converted" | "lost" =>
  validStatuses.includes(status) ? status : "new";

const ViewLeadPage = () => {
  const { setLabel, setTitle } = usePageContext();
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLabel("Leads");
    setTitle("View Lead");
  }, [setLabel, setTitle]);

  useEffect(() => {
    const fetchLead = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getLead({ id: id as string });
        setLead(response.data);
      } catch (err: any) {
        setError("Lead not found.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchLead();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 text-lg mt-10">Loading...</div>
    );
  }

  if (error || !lead) {
    return (
      <div className="text-center text-gray-500 text-lg mt-10">
        {error || "Lead not found."}
      </div>
    );
  }

  const handleDelete = async (leadId: string) => {
    try {
      await deleteLead({ id: leadId });
      router.push("/client/leads");
      toast.success("Lead deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete lead");
      throw error; // Re-throw to let the component handle the loading state
    }
  };

  return (
    <LeadDetails
      lead={{
        id: lead._id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        status: getValidStatus(lead.status),
        created_at: formatDate(lead.createdAt),
        extraFields: lead.extraFields,
        message: lead.message,
      }}
      permissions={lead.permissions || []}
      onDelete={handleDelete}
    />
  );
};

export default ViewLeadPage;

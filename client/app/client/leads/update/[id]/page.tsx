"use client";
import { usePageContext } from "@/context/PageTitleContext";
import UpdateLeadForm from "./updateLeadForm";
import { useEffect } from "react";
import { useParams } from "next/navigation";

const UpdateLeadPage = () => {
  const { setLabel, setTitle } = usePageContext();
  const params = useParams();

  useEffect(() => {
    setLabel("Leads");
    setTitle("Update Lead");
  }, [setLabel, setTitle]);

  // Extract leadId safely from params
  const leadId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : undefined;

  if (!leadId) {
    return <div>Lead ID is missing or invalid.</div>;
  }

  return <UpdateLeadForm leadId={leadId} />;
};

export default UpdateLeadPage;

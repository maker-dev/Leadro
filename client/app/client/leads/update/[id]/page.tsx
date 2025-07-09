"use client";
import { usePageContext } from "@/context/PageTitleContext";
import UpdateLeadForm from "./updateLeadForm";
import { useEffect } from "react";

const UpdateLeadPage = () => {
  const { setLabel, setTitle } = usePageContext();

  useEffect(() => {
    setLabel("Leads");
    setTitle("Update Lead");
  }, [setLabel, setTitle]);
  return <UpdateLeadForm />;
};

export default UpdateLeadPage;

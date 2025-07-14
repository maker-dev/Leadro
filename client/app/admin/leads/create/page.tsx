"use client";
import { usePageContext } from "@/context/PageTitleContext";
import { useEffect } from "react";
import CreateLeadForm from "./CreateLeadForm";

const CreateLeadPage = () => {
  const { setLabel, setTitle } = usePageContext();

  useEffect(() => {
    setLabel("Leads");
    setTitle("Create Lead");
  }, [setLabel, setTitle]);
  return <CreateLeadForm />;
};

export default CreateLeadPage;

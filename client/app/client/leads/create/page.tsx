"use client";
import { usePageContext } from "@/context/PageTitleContext";
import CreateLeadForm from "./CreateLeadForm";
import { useEffect } from "react";

const CreateLeadPage = () => {
  const { setLabel, setTitle } = usePageContext();

  useEffect(() => {
    setLabel("Leads");
    setTitle("Create Lead");
  }, [setLabel, setTitle]);
  return <CreateLeadForm />;
};

export default CreateLeadPage;

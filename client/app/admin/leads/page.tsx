"use client";
import { usePageContext } from "@/context/PageTitleContext";
import { useEffect } from "react";

function LeadsPage() {
  const { setLabel, setTitle } = usePageContext();

  useEffect(() => {
    setLabel("Leads");
    setTitle("Leads");
  }, [setLabel, setTitle]);
  return <div>leads page</div>;
}

export default LeadsPage;

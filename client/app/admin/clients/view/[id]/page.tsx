"use client";

import { usePageContext } from "@/context/PageTitleContext";
import { useEffect } from "react";
import { useParams } from "next/navigation";

function ViewClientPage() {
  const { setLabel, setTitle } = usePageContext();
  const { id } = useParams(); // get dynamic route param

  useEffect(() => {
    setLabel("Clients");
    setTitle("View Client");
  }, [setLabel, setTitle]);

  return (
    <div>
      <h1>Client ID: {id}</h1>
      <p>Client details will be displayed here.</p>
    </div>
  );
}

export default ViewClientPage;

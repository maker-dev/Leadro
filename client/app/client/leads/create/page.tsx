"use client";
import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";
import { useState } from "react";
import CreateLeadForm from "./CreateLeadForm";

const CreateLeadPage = () => {
  const [isLeftBarOpen, setIsLeftBarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SideBar
        activeLabel="Leads"
        isOpen={isLeftBarOpen}
        onClose={() => setIsLeftBarOpen(!isLeftBarOpen)}
        role="client"
      />

      {/* Main area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header
          title="Create Lead"
          username="mikari alias"
          onMenuClick={() => setIsLeftBarOpen(!isLeftBarOpen)}
        />

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50">
          <CreateLeadForm />
        </main>
      </div>
    </div>
  );
};

export default CreateLeadPage;

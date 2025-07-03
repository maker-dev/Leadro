"use client";
import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";
import { useState } from "react";
import LeadTable from "@/components/ui/tables/client/LeadTable";

const Leads = () => {
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
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <Header
          title="Leads"
          username="mikari alias"
          onMenuClick={() => setIsLeftBarOpen(!isLeftBarOpen)}
        />

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50">
          <LeadTable />
        </main>
      </div>
    </div>
  );
};

export default Leads;

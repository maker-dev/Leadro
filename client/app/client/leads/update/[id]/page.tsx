"use client";
import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";
import { useState } from "react";
import UpdateLeadForm from "./updateLeadForm";

type Props = {
  params: { id: string };
};

const UpdateLeadPage = ({ params }: Props) => {
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
          title="Update Lead"
          username="mikari alias"
          onMenuClick={() => setIsLeftBarOpen(!isLeftBarOpen)}
        />

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50">
          <UpdateLeadForm />
        </main>
      </div>
    </div>
  );
};

export default UpdateLeadPage;

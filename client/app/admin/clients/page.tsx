"use client";
import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";
import { useState } from "react";
import ClientTable from "@/components/ui/tables/admin/ClientsTable";
import CreateClientModal from "@/components/modals/admin/CreateClientModal";
import { FormValues } from "@/app/register/types";

function ClientsPage() {
  const [isLeftBarOpen, setIsLeftBarOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);

  const handleAddClient = (formData: FormValues) => {
    // Handle form data (API call, etc.)
    console.log(formData);
    setIsAddClientOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SideBar
        activeLabel="Clients"
        isOpen={isLeftBarOpen}
        onClose={() => setIsLeftBarOpen(!isLeftBarOpen)}
        role="admin"
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <Header
          title="Clients"
          username="mikari alias"
          onMenuClick={() => setIsLeftBarOpen(!isLeftBarOpen)}
        />

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50">
          <ClientTable
            isAddClientOpen={isAddClientOpen}
            setIsAddClientOpen={setIsAddClientOpen}
          />
          <CreateClientModal
            isOpen={isAddClientOpen}
            onClose={() => setIsAddClientOpen(false)}
            onSubmit={handleAddClient}
          />
        </main>
      </div>
    </div>
  );
}

export default ClientsPage;

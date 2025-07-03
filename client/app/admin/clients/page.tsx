"use client";
import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";
import { useState } from "react";
import ClientTable from "@/components/ui/tables/admin/ClientsTable";
import CreateFormModal, { FieldConfig } from "@/components/modals/FormModal";
import { formSchema } from "@/app/register/schema";
import { FormValues } from "@/app/register/types";

const clientFields: FieldConfig[] = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Nanyonga Rahmah",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "ugaka1204@gmail.com",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Password",
    required: true,
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm Password",
    required: true,
  },
];

const initialClientValues: FormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

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
          <CreateFormModal
            isOpen={isAddClientOpen}
            onClose={() => setIsAddClientOpen(false)}
            onSubmit={handleAddClient}
            title="Add Client"
            fields={clientFields}
            initialValues={initialClientValues}
            validationSchema={formSchema}
            submitLabel="Add Client"
            cancelLabel="Cancel"
          />
        </main>
      </div>
    </div>
  );
}

export default ClientsPage;

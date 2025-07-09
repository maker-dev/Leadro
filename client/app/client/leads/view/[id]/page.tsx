"use client";
import { usePathname } from "next/navigation";
import LeadDetails from "@/components/ui/cards/LeadDetails";
import { useEffect } from "react";
import { usePageContext } from "@/context/PageTitleContext";

// Fake data type
const fakeLeads = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    source: "Website",
    status: "new",
    createdAt: "2023-01-01",
    extraFields: {
      address: "rue 24",
    },
  },
  {
    id: "2",
    name: "",
    email: "jane@example.com",
    phone: "",
    source: "Referral",
    status: "contacted",
    createdAt: "2023-01-02",
  },
  {
    id: "3",
    name: "Alice Smith",
    email: "alice@example.com",
    phone: "9876543210",
    source: "Ad Campaign",
    status: "converted",
    createdAt: "2023-01-03",
  },
  {
    id: "4",
    name: "Bob Lee",
    email: "bob@example.com",
    phone: "",
    source: "",
    status: "lost",
    createdAt: "2023-01-04",
  },
  {
    id: "5",
    name: "",
    email: "eve@example.com",
    phone: "5551234567",
    source: "Website",
    status: "new",
    createdAt: "2023-01-05",
  },
  {
    id: "6",
    name: "Charlie Brown",
    email: "charlie@example.com",
    phone: "",
    source: "Event",
    status: "contacted",
    createdAt: "2023-01-06",
  },
  {
    id: "7",
    name: "",
    email: "dave@example.com",
    phone: "",
    source: "",
    status: "converted",
    createdAt: "2023-01-07",
  },
  {
    id: "8",
    name: "Emily White",
    email: "emily@example.com",
    phone: "4445556666",
    source: "Referral",
    status: "lost",
    createdAt: "2023-01-08",
  },
];

const CreateLeadPage = () => {
  const { setLabel, setTitle } = usePageContext();

  useEffect(() => {
    setLabel("Leads");
    setTitle("View Lead");
  }, [setLabel, setTitle]);
  const pathname = usePathname(); // e.g., /leads/update/123
  const segments = pathname.split("/");
  const lastParam = segments[segments.length - 1];

  const lead = fakeLeads.find((l) => l.id === lastParam);

  // Helper to ensure status is a valid enum value
  const validStatuses = ["new", "contacted", "converted", "lost"] as const;
  const getValidStatus = (
    status: any
  ): "new" | "contacted" | "converted" | "lost" =>
    validStatuses.includes(status) ? status : "new";

  return (
    <>
      {lead ? (
        <LeadDetails
          lead={{
            id: lead.id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            source: lead.source,
            status: getValidStatus(lead.status),
            created_at: lead.createdAt,
            extraFields: lead.extraFields,
          }}
        />
      ) : (
        <div className="text-center text-gray-500 text-lg mt-10">
          Lead not found.
        </div>
      )}
    </>
  );
};

export default CreateLeadPage;

"use client";
import StatusCard from "@/components/ui/cards/StatusCard";
import { usePageContext } from "@/context/PageTitleContext";
import { useEffect } from "react";
import {
  FaUsers,
  FaAddressBook,
  FaBolt,
  FaKey,
  FaBan,
  FaLayerGroup,
} from "react-icons/fa";

function DaschboardPage() {
  const { setLabel, setTitle } = usePageContext();

  useEffect(() => {
    setLabel("Overview");
    setTitle("Overview");
  }, [setLabel, setTitle]);
  return (
    <>
      {/* Status Cards for admin dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <StatusCard
          label="Total Clients"
          value={"12"}
          icon={<FaUsers />}
          color="gray"
        />
        <StatusCard
          label="Total Leads"
          value={"45"}
          icon={<FaAddressBook />}
          color="green"
        />
        <StatusCard
          label="APIs Usage Today"
          value={"320"}
          icon={<FaBolt />}
          color="yellow"
        />
        <StatusCard
          label="Total API Keys"
          value={"10"}
          icon={<FaLayerGroup />}
          color="orange"
        />
        <StatusCard
          label="Active API Keys"
          value={"7"}
          icon={<FaKey />}
          color="blue"
        />
        <StatusCard
          label="Revoked API Keys"
          value={"3"}
          icon={<FaBan />}
          color="red"
        />
      </div>
    </>
  );
}

export default DaschboardPage;

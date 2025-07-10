"use client";
import { useEffect } from "react";
import { usePageContext } from "@/context/PageTitleContext";
import ProfileInformation from "@/components/ui/cards/settings/ProfileInformation";

function SettingsPage() {
  const { setLabel, setTitle } = usePageContext();

  useEffect(() => {
    setLabel("Settings");
    setTitle("Settings");
  }, [setLabel, setTitle]);

  const handleProfileSubmit = (data: { name: string }) => {
    // For now, just log the data
    console.log("Profile submitted:", data);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <ProfileInformation
        role="Client"
        initialValues={{ name: "John Doe", email: "john.doe@example.com" }}
        onSubmit={handleProfileSubmit}
      />
    </div>
  );
}

export default SettingsPage;

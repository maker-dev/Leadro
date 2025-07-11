"use client";
import { useEffect, useState } from "react";
import { usePageContext } from "@/context/PageTitleContext";
import ProfileInformation from "@/components/ui/cards/settings/ProfileInformation";
import ChangePassword from "@/components/ui/cards/settings/ChangePassword";
import AccountManagement from "@/components/ui/cards/settings/AccountManagement";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";

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

  const handleChangePasswordSubmit = (data: any) => {
    // For now, just log the data
    console.log("Password changed:", data);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleConfirmDelete = () => {
    // Actual delete logic here
    console.log("Account deleted");
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <ProfileInformation
        role="Admin"
        initialValues={{ name: "John Doe", email: "john.doe@example.com" }}
        onSubmit={handleProfileSubmit}
      />
      <ChangePassword onSubmit={handleChangePasswordSubmit} />
      <AccountManagement onDelete={handleDeleteAccount} />
      {showDeleteModal && (
        <ConfirmDeleteModal
          onConfirm={handleConfirmDelete}
          onClose={handleCancelDelete}
          isOpen={true}
          title="Delete Account"
          description="Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost."
        />
      )}
    </div>
  );
}

export default SettingsPage;

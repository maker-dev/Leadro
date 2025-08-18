"use client";
import { useEffect, useState } from "react";
import { usePageContext } from "@/context/PageTitleContext";
import ProfileInformation from "@/components/ui/cards/settings/ProfileInformation";
import ChangePassword from "@/components/ui/cards/settings/ChangePassword";
import AccountManagement from "@/components/ui/cards/settings/AccountManagement";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { useUser } from "@/context/UserContext";
import { deleteAccount, updateName } from "@/services/ProfileService";
import { toast } from "sonner";
import UpdateProfileInfoType from "@/components/ui/cards/settings/types/UpdtProfileInfoType";
import ChangePasswordType from "@/components/ui/cards/settings/types/ChangePasswordType";
import { UseFormSetError } from "react-hook-form";
import { changePassword } from "@/services/AuthService";
import { useAuth } from "@/context/AuthContext";

function SettingsPage() {
  const { setLabel, setTitle } = usePageContext();
  const { user, setUser } = useUser();
  const { logout } = useAuth();
  useEffect(() => {
    setLabel("Settings");
    setTitle("Settings");
  }, [setLabel, setTitle]);

  const handleProfileSubmit = async (
    data: UpdateProfileInfoType,
    setError: UseFormSetError<UpdateProfileInfoType>
  ) => {
    try {
      const res = await updateName(data);
      setUser({
        _id: user?._id || "",
        name: res.data.name || "",
        email: user?.email || "",
        role: user?.role || "client",
      });
      toast.success("Name updated successfully");
    } catch (error: any) {
      const errors = error?.response?.data?.errors;
      if (Array.isArray(errors)) {
        errors.forEach((err: any) => {
          if (err.field && err.message) {
            setError(err.field as keyof UpdateProfileInfoType, {
              type: "server",
              message: err.message,
            });
          } else if (err.message) {
            toast.error(err.message);
          }
        });
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Name update failed. Please try again.");
      }
    }
  };

  const handleChangePasswordSubmit = async (
    data: ChangePasswordType,
    setError: UseFormSetError<ChangePasswordType>
  ) => {
    try {
      await changePassword(data);
      toast.success("Password updated successfully");
    } catch (error: any) {
      const errors = error?.response?.data?.errors;
      if (Array.isArray(errors)) {
        errors.forEach((err: any) => {
          if (err.field && err.message) {
            setError(err.field as keyof ChangePasswordType, {
              type: "server",
              message: err.message,
            });
          } else if (err.message) {
            toast.error(err.message);
          }
        });
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Password update failed. Please try again.");
      }
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      await logout();
      toast.success("Account deleted successfully");
    } catch (error: any) {
      toast.error("Account deletion failed. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <ProfileInformation
        role="Client"
        initialValues={{ name: user?.name || "", email: user?.email || "" }}
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
          loading={isDeleting}
        />
      )}
    </div>
  );
}

export default SettingsPage;

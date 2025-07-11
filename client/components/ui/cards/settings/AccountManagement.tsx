import React from "react";
import { FiTrash2 } from "react-icons/fi";

interface AccountManagementProps {
  onDelete?: () => void;
}

const AccountManagement: React.FC<AccountManagementProps> = ({
  onDelete = () => {},
}) => {
  return (
    <div className="p-8 bg-white rounded-xl border border-red-200 shadow">
      <div className="flex items-center mb-2">
        <FiTrash2
          className="w-6 h-6 mr-2 text-red-500"
          aria-label="Account Management"
        />
        <h2 className="text-2xl font-bold text-red-500">Account Management</h2>
      </div>
      <p className="text-gray-500 mb-8">
        Permanently delete your account and all associated data.
      </p>
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-red-500 font-semibold text-lg mb-2">
          Danger Zone
        </div>
        <div className="text-gray-500 mb-6">
          Once you delete your account, there is no going back. Please be
          certain.
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-md font-semibold shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
          aria-label="Delete Account"
        >
          <FiTrash2 className="w-5 h-5" aria-hidden="true" />
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default AccountManagement;

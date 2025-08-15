"use client";

import { usePageContext } from "@/context/PageTitleContext";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiUser } from "react-icons/fi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { FiBarChart2 } from "react-icons/fi";
import {
  FiKey,
  FiUsers,
  FiPlus,
  FiEye,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import formatDate from "@/utils/formateDate";
import getInitials from "@/utils/getInitials";
import BaseCard from "@/components/ui/cards/BaseCard";
import { getClientViewData } from "@/services/AdminService";
import { toast } from "sonner";

function ViewClientPage() {
  const { setLabel, setTitle } = usePageContext();
  const { id } = useParams();
  const router = useRouter();
  
  // State for client data
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLabel("Clients");
    setTitle("View Client");
  }, [setLabel, setTitle]);

  // Fetch client data when component mounts
  useEffect(() => {
    const fetchClientData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await getClientViewData(id as string);
        setClient(response.data);
      } catch (error: any) {
        console.error("Error fetching client data:", error);
        setError(error?.response?.data?.message || "Failed to load client data");
        toast.error("Failed to load client data");
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" aria-label="Loading client data" tabIndex={0}>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-semibold text-gray-700">Loading client data...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !client) {
    return (
      <div className="flex justify-center items-center h-64" aria-label="Error loading client data" tabIndex={0}>
        <div className="text-center">
          <span className="text-lg font-semibold text-red-500 mb-2 block">
            {error || "Client not found"}
          </span>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Basic Client Information Card */}
      <BaseCard
        logo={<FiUser className="w-6 h-6" aria-hidden="true" />}
        title="Basic Client Information"
        description=""
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          <div>
            <div className="mb-4">
              <div className="text-gray-500 text-sm mb-1">Name</div>
              <div className="text-lg font-semibold">{client.name}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Email</div>
              <div className="text-lg">{client.email}</div>
            </div>
          </div>
          <div className="flex flex-col justify-center md:items-end">
            <div className="text-gray-500 text-sm mb-1">Created At</div>
            <div className="text-lg">{formatDate(client.createdAt)}</div>
          </div>
        </div>
      </BaseCard>

      {/* Quick Actions Card */}
      <div
        className="bg-white border border-gray-200 rounded-xl shadow p-8"
        aria-label="Quick Actions"
        tabIndex={0}
      >
        <div className="text-2xl font-bold mb-1">Quick Actions</div>
        <div className="text-gray-500 mb-6">Common actions for this client</div>
                 <div className="flex flex-col md:flex-row gap-4">
           <button
             onClick={() => router.push('/admin/leads/create')}
             className="flex items-center justify-center gap-2 bg-black text-white font-semibold rounded-lg px-6 py-3 w-full md:w-1/2 text-base focus:outline-none focus:ring hover:bg-gray-900 cursor-pointer"
             aria-label="Add Lead for this Client"
             tabIndex={0}
           >
             <FiPlus className="w-5 h-5" />
             Add Lead for this Client
           </button>
           <button
             onClick={() => router.push('/admin/leads')}
             className="flex items-center justify-center gap-2 bg-white text-black font-semibold rounded-lg px-6 py-3 w-full md:w-1/2 text-base border border-gray-200 focus:outline-none focus:ring hover:bg-gray-50 cursor-pointer"
             aria-label="View All Leads"
             tabIndex={0}
           >
             <FiEye className="w-5 h-5" />
             View All Leads
           </button>
         </div>
      </div>

      {/* Lead Summary Card */}
      <BaseCard
        logo={<FiBarChart2 className="w-6 h-6" aria-hidden="true" />}
        title="Lead Summary"
        description=""
      >
        {client.leadSummary.totalLeads === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[180px] text-center">
            <span className="text-5xl mb-4" aria-hidden="true">
              🗒️
            </span>
            <div className="text-lg font-semibold mb-1">No leads yet</div>
            <div className="text-gray-500">
              This user hasn't added any leads yet.
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            {/* Left: Summary Info */}
            <div className="flex-1 min-w-[220px]">
              <div className="text-gray-500 font-semibold mb-1">
                Total Leads
              </div>
              <div className="text-3xl sm:text-4xl font-bold mb-6">
                {client.leadSummary.totalLeads}
              </div>
              <div className="text-gray-500 font-semibold mb-2">
                Leads by Status
              </div>
              <div className="flex flex-col gap-2 mb-6">
                {/* Status Row */}
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full bg-blue-500 inline-block"
                    aria-label="New"
                  />
                  <span className="text-base">New</span>
                  <span className="ml-auto bg-blue-500 text-white text-xs font-semibold rounded-full px-3 py-1">
                    {client.leadSummary.leadsByStatus.New}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full bg-yellow-400 inline-block"
                    aria-label="Contacted"
                  />
                  <span className="text-base">Contacted</span>
                  <span className="ml-auto bg-yellow-400 text-white text-xs font-semibold rounded-full px-3 py-1">
                    {client.leadSummary.leadsByStatus.Contacted}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full bg-green-500 inline-block"
                    aria-label="Converted"
                  />
                  <span className="text-base">Converted</span>
                  <span className="ml-auto bg-green-500 text-white text-xs font-semibold rounded-full px-3 py-1">
                    {client.leadSummary.leadsByStatus.Converted}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full bg-red-500 inline-block"
                    aria-label="Lost"
                  />
                  <span className="text-base">Lost</span>
                  <span className="ml-auto bg-red-500 text-white text-xs font-semibold rounded-full px-3 py-1">
                    {client.leadSummary.leadsByStatus.Lost}
                  </span>
                </div>
              </div>
              <div className="text-gray-500 font-semibold mb-1">
                Last Lead Added
              </div>
              <div className="text-lg">
                {client.leadSummary.lastLeadAdded
                  ? new Date(client.leadSummary.lastLeadAdded).toLocaleString(
                      "en-US"
                    )
                  : "-"}
              </div>
            </div>
            {/* Right: Donut Chart */}
            <div className="flex-1 flex justify-center items-center min-w-[220px]">
              <ResponsiveContainer width={220} height={220}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "New",
                        value: client.leadSummary.leadsByStatus.New,
                      },
                      {
                        name: "Contacted",
                        value: client.leadSummary.leadsByStatus.Contacted,
                      },
                      {
                        name: "Converted",
                        value: client.leadSummary.leadsByStatus.Converted,
                      },
                      {
                        name: "Lost",
                        value: client.leadSummary.leadsByStatus.Lost,
                      },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    <Cell key="new" fill="#3B82F6" />
                    <Cell key="contacted" fill="#FBBF24" />
                    <Cell key="converted" fill="#10B981" />
                    <Cell key="lost" fill="#EF4444" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </BaseCard>

      {/* API Key Information Card */}
      <BaseCard
        logo={<FiKey className="w-6 h-6" aria-hidden="true" />}
        title="API Keys Information"
        description=""
      >
        {client.apiKeys && client.apiKeys.totalKeys > 0 ? (
          <div className="flex flex-col gap-6">
            {/* Top Row: Total Keys & Status Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
              {/* Total Keys */}
              <div className="flex flex-col items-start justify-center mb-2 sm:mb-0">
                <span className="text-gray-500 font-semibold mb-1">
                  Total Keys
                </span>
                <span className="text-3xl font-bold tracking-tight">
                  {client.apiKeys.totalKeys}
                </span>
              </div>
              {/* Status Badges */}
              <div className="flex flex-row items-center gap-2 flex-wrap">
                {/* Active Badge */}
                <span
                  className="flex items-center gap-1 bg-black text-white text-sm font-semibold rounded-full px-4 py-1"
                  aria-label="Active API Keys"
                  tabIndex={0}
                >
                  <FiCheckCircle
                    className="w-4 h-4 text-white"
                    aria-hidden="true"
                  />
                  {client.apiKeys.activeKeys} Active
                </span>
                {/* Revoked Badge */}
                <span
                  className="flex items-center gap-1 bg-red-500 text-white text-sm font-semibold rounded-full px-4 py-1"
                  aria-label="Revoked API Keys"
                  tabIndex={0}
                >
                  <FiXCircle
                    className="w-4 h-4 text-white"
                    aria-hidden="true"
                  />
                  {client.apiKeys.revokedKeys} Revoked
                </span>
              </div>
            </div>
            {/* Last Used Key */}
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 font-semibold">Last Used Key</span>
              <span className="text-lg">
                {client.apiKeys.lastUsedKey
                  ? new Date(client.apiKeys.lastUsedKey).toLocaleString("en-US")
                  : "-"}
              </span>
            </div>
            <hr className="my-2 border-gray-200" />
                         <div className="flex justify-start">
               <button
                 onClick={() => router.push(`/admin/api-keys/view/${client.id}`)}
                 className="flex items-center gap-2 border rounded-lg px-4 py-2 font-medium hover:bg-gray-50 focus:outline-none focus:ring cursor-pointer"
                 aria-label="Manage API Keys"
                 tabIndex={0}
               >
                 <FiKey className="w-5 h-5" />
                 Manage API Keys
               </button>
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[120px] text-center">
            <span className="text-4xl mb-3" aria-hidden="true">
              🔑
            </span>
            <div className="text-lg font-semibold mb-1">
              No API key available
            </div>
          </div>
        )}
      </BaseCard>

      {/* Client Access Card */}
      <BaseCard
        logo={<FiUsers className="w-6 h-6" aria-hidden="true" />}
        title="Client Access"
        description="Users who have permission to access this client's data"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-base">
            Users with Access ({client.clientAccess.length})
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {client.clientAccess.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              No users have access yet.
            </div>
          ) : (
            client.clientAccess.map((user: any, idx: number) => (
              <div
                key={user.email}
                className="flex items-center gap-4 bg-gray-50 rounded-xl px-5 py-4 shadow-sm"
              >
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-lg mr-2"
                  aria-label={`Initials for ${user.name}`}
                >
                  {getInitials(user.name)}
                </div>
                <div>
                  <div className="font-semibold text-base">{user.name}</div>
                  <div className="text-gray-500 text-sm">{user.email}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </BaseCard>
    </div>
  );
}

export default ViewClientPage;

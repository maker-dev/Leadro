"use client";

import { usePageContext } from "@/context/PageTitleContext";
import { useEffect } from "react";
import { useParams } from "next/navigation";
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

// 1. Update mock data to support multiple API keys per client
const fakeClients = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    createdAt: "2024-01-15T10:00:00Z",
    leadSummary: {
      totalLeads: 47,
      leadsByStatus: {
        New: 12,
        Contacted: 18,
        Converted: 8,
        Lost: 9,
      },
      lastLeadAdded: "2024-12-08T14:30:00Z",
    },
    apiKeys: [
      {
        key: "ABCD1234SECRETKEY1",
        status: "Active",
        lastUsed: "2024-12-10T09:00:00Z",
      },
      {
        key: "ABCD1234SECRETKEY2",
        status: "Active",
        lastUsed: "2024-12-09T08:00:00Z",
      },
      {
        key: "ABCD1234SECRETKEY3",
        status: "Revoked",
        lastUsed: "2024-11-01T10:00:00Z",
      },
      {
        key: "ABCD1234SECRETKEY4",
        status: "Revoked",
        lastUsed: "2024-10-01T10:00:00Z",
      },
      {
        key: "ABCD1234SECRETKEY5",
        status: "Active",
        lastUsed: "2024-12-08T07:00:00Z",
      },
      {
        key: "ABCD1234SECRETKEY6",
        status: "Active",
        lastUsed: "2024-12-07T06:00:00Z",
      },
      {
        key: "ABCD1234SECRETKEY7",
        status: "Active",
        lastUsed: "2024-12-06T05:00:00Z",
      },
      {
        key: "ABCD1234SECRETKEY8",
        status: "Revoked",
        lastUsed: "2024-09-01T10:00:00Z",
      },
      {
        key: "ABCD1234SECRETKEY9",
        status: "Active",
        lastUsed: "2024-12-05T04:00:00Z",
      },
      {
        key: "ABCD1234SECRETKEY10",
        status: "Active",
        lastUsed: "2024-12-04T03:00:00Z",
      },
      {
        key: "ABCD1234SECRETKEY11",
        status: "Revoked",
        lastUsed: "2024-08-01T10:00:00Z",
      },
    ],
    clientAccess: [
      { name: "Sarah Johnson", email: "sarah.johnson@company.com" },
      { name: "Mike Davis", email: "mike.davis@company.com" },
      { name: "Lisa Chen", email: "lisa.chen@company.com" },
      { name: "Robert Wilson", email: "robert.wilson@company.com" },
    ],
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    createdAt: "2024-02-10T14:30:00Z",
    leadSummary: {
      totalLeads: 30,
      leadsByStatus: {
        New: 5,
        Contacted: 10,
        Converted: 10,
        Lost: 5,
      },
      lastLeadAdded: "2024-11-20T10:00:00Z",
    },
    apiKeyInfo: {
      apiKey: "XYZ9876SECRETKEY2",
      status: "Revoked",
      expirationDate: "2024-08-01T00:00:00Z",
    },
    clientAccess: [
      { name: "Emily Clark", email: "emily.clark@company.com" },
      { name: "Tom Lee", email: "tom.lee@company.com" },
    ],
  },
  {
    id: "3",
    name: "New User",
    email: "new.user@example.com",
    createdAt: "2024-04-01T09:00:00Z",
    leadSummary: {
      totalLeads: 0,
      leadsByStatus: {
        New: 0,
        Contacted: 0,
        Converted: 0,
        Lost: 0,
      },
      lastLeadAdded: null,
    },
    // No API key info — represents a brand new user
    clientAccess: [],
  },
  {
    id: "4",
    name: "Musashi",
    email: "musashi2@example.com",
    createdAt: "2024-05-12T16:20:00Z",
    leadSummary: {
      totalLeads: 2,
      leadsByStatus: {
        New: 2,
        Contacted: 0,
        Converted: 0,
        Lost: 0,
      },
      lastLeadAdded: "2024-11-25T11:00:00Z",
    },
    apiKeyInfo: {
      apiKey: "MUSA2024SECRETKEY3",
      status: "Active",
      expirationDate: "2025-05-01T00:00:00Z",
    },
    clientAccess: [
      { name: "Akira Tanaka", email: "akira.tanaka@company.com" },
      { name: "Yuki Sato", email: "yuki.sato@company.com" },
    ],
  },
  {
    id: "5",
    name: "Amina Farouk",
    email: "amina.farouk@example.com",
    createdAt: "2024-03-22T12:00:00Z",
    leadSummary: {
      totalLeads: 19,
      leadsByStatus: {
        New: 4,
        Contacted: 7,
        Converted: 5,
        Lost: 3,
      },
      lastLeadAdded: "2024-11-30T15:45:00Z",
    },
    apiKeyInfo: {
      apiKey: "AMINAKEY2024ZXY",
      status: "Expired",
      expirationDate: "2024-10-01T00:00:00Z",
    },
    clientAccess: [
      { name: "Omar Khaled", email: "omar.khaled@company.com" },
      { name: "Fatima Zahra", email: "fatima.zahra@company.com" },
      { name: "Nour Hassan", email: "nour.hassan@company.com" },
    ],
  },
];

function ViewClientPage() {
  const { setLabel, setTitle } = usePageContext();
  const { id } = useParams();
  const client = fakeClients.find((c) => c.id === id);

  useEffect(() => {
    setLabel("Clients");
    setTitle("View Client");
  }, [setLabel, setTitle]);

  if (!client) {
    return (
      <div
        className="flex justify-center items-center h-64"
        aria-label="Client not found"
        tabIndex={0}
      >
        <span className="text-lg font-semibold text-gray-500">
          Client not found.
        </span>
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
            className="flex items-center justify-center gap-2 bg-black text-white font-semibold rounded-lg px-6 py-3 w-full md:w-1/2 text-base focus:outline-none focus:ring hover:bg-gray-900 cursor-pointer"
            aria-label="Add Lead for this Client"
            tabIndex={0}
          >
            <FiPlus className="w-5 h-5" />
            Add Lead for this Client
          </button>
          <button
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
        {client.apiKeys && client.apiKeys.length > 0 ? (
          <div className="flex flex-col gap-6">
            {/* Top Row: Total Keys & Status Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
              {/* Total Keys */}
              <div className="flex flex-col items-start justify-center mb-2 sm:mb-0">
                <span className="text-gray-500 font-semibold mb-1">
                  Total Keys
                </span>
                <span className="text-3xl font-bold tracking-tight">
                  {client.apiKeys.length}
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
                  {client.apiKeys.filter((k) => k.status === "Active").length}{" "}
                  Active
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
                  {client.apiKeys.filter((k) => k.status === "Revoked").length}{" "}
                  Revoked
                </span>
              </div>
            </div>
            {/* Last Used Key */}
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 font-semibold">Last Used Key</span>
              <span className="text-lg">
                {(() => {
                  const lastUsed = client.apiKeys.reduce<
                    | { key: string; status: string; lastUsed: string }
                    | undefined
                  >((latest, k) => {
                    if (!latest) return k;
                    return new Date(k.lastUsed) > new Date(latest.lastUsed)
                      ? k
                      : latest;
                  }, undefined);
                  return lastUsed
                    ? new Date(lastUsed.lastUsed).toLocaleString("en-US")
                    : "-";
                })()}
              </span>
            </div>
            <hr className="my-2 border-gray-200" />
            <div className="flex justify-start">
              <button
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
            client.clientAccess.map((user, idx) => (
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

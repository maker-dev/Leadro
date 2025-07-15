"use client";
import { useEffect, useState } from "react";
import { usePageContext } from "@/context/PageTitleContext";
import StatisticsCard from "@/components/ui/cards/StatisticsCard";
import BaseCard from "@/components/ui/cards/BaseCard";
import {
  FaKey,
  FaCheckCircle,
  FaTimesCircle,
  FaChartBar,
  FaClock,
} from "react-icons/fa";
import { FiCopy, FiCheck, FiRotateCw, FiTrash2 } from "react-icons/fi";

const ViewKeysPage = () => {
  const { setLabel, setTitle } = usePageContext();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    setLabel("Api Keys");
    setTitle("Manage Api Keys");
  }, [setLabel, setTitle]);

  const mockApiKeys = [
    {
      label: "API Key 1",
      key: "sk-mockkey-t92j8f3k2l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z0",
      status: "Revoked",
      usage: 814,
      lastUsed: "Jun 27, 2025, 09:39 AM",
      created: "Jun 9, 2025, 06:36 PM",
      updated: "Jul 15, 2025, 03:00 PM",
      statusColor: "bg-red-400",
      actions: ["activate", "delete"],
    },
    {
      label: "API Key 2",
      key: "sk-mockkey-e8y0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2",
      status: "Active",
      usage: 256,
      lastUsed: "Never",
      created: "Jul 5, 2025, 03:04 AM",
      updated: "Jul 15, 2025, 03:00 PM",
      statusColor: "bg-black",
      actions: ["revoke", "delete"],
    },
    {
      label: "API Key 3",
      key: "sk-mockkey-ooqb1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1",
      status: "Active",
      usage: 390,
      lastUsed: "Jul 8, 2025, 08:19 PM",
      created: "Jul 7, 2025, 07:27 AM",
      updated: "Jul 15, 2025, 03:00 PM",
      statusColor: "bg-black",
      actions: ["revoke", "delete"],
    },
  ];

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1200);
  };

  return (
    <div className=" mx-auto space-y-8">
      {/* Statistics Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        <StatisticsCard
          title="Total API Keys"
          value={10}
          description="All keys for this client"
          icon={<FaKey />}
          ariaLabel="Total API Keys"
        />
        <StatisticsCard
          title="Active Keys"
          value={7}
          description="Currently active keys"
          icon={<FaCheckCircle />}
          ariaLabel="Active Keys"
        />
        <StatisticsCard
          title="Revoked Keys"
          value={3}
          description="Keys that have been revoked"
          icon={<FaTimesCircle />}
          ariaLabel="Revoked Keys"
        />
        <StatisticsCard
          title="Total Usage"
          value={1245}
          description="Total API calls made"
          icon={<FaChartBar />}
          ariaLabel="Total Usage"
        />
        <StatisticsCard
          title="Last Key Created"
          value="Jul 9, 2025"
          description="Date of the most recent key"
          icon={<FaClock />}
          ariaLabel="Last Key Created"
        />
      </div>
      {/* Managing api keys Card */}
      <BaseCard
        logo={<FaKey className="w-6 h-6" aria-label="API Key Table" />}
        title="Client API Keys"
        description="Manage API keys for the selected client."
      >
        <div className="overflow-x-auto">
          <table
            className="min-w-full text-left"
            aria-label="Client API Keys Table"
          >
            <thead>
              <tr className="text-gray-500 text-sm border-b border-gray-300">
                <th className="py-2 px-2 font-semibold">Label</th>
                <th className="py-2 px-2 font-semibold">Key</th>
                <th className="py-2 px-2 font-semibold">Status</th>
                <th className="py-2 px-2 font-semibold">Usage</th>
                <th className="py-2 px-2 font-semibold">Last Used</th>
                <th className="py-2 px-2 font-semibold">Created</th>
                <th className="py-2 px-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockApiKeys.map((apiKey, idx) => (
                <tr
                  key={apiKey.key}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="py-3 px-2 font-medium text-gray-900">
                    {apiKey.label}
                  </td>
                  <td className="py-3 px-2 flex items-center gap-2">
                    <span>{apiKey.key.slice(0, 14)}…</span>
                    <button
                      className="text-gray-400 hover:text-gray-700"
                      aria-label="Copy Key"
                      tabIndex={0}
                      onClick={() => handleCopy(apiKey.key)}
                    >
                      {copiedKey === apiKey.key ? (
                        <FiCheck className="inline-block text-green-600" />
                      ) : (
                        <FiCopy className="inline-block" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`inline-flex items-center px-4 py-1 rounded-full ${apiKey.statusColor} text-white text-xs font-semibold gap-2`}
                    >
                      {apiKey.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">{apiKey.usage}</td>
                  <td className="py-3 px-2">{apiKey.lastUsed}</td>
                  <td className="py-3 px-2">{apiKey.created}</td>
                  <td className="py-3 px-2 flex gap-2">
                    {apiKey.actions.includes("activate") && (
                      <button
                        className="flex items-center gap-2 border border-gray-200 rounded px-4 py-2 font-semibold bg-white hover:bg-gray-50"
                        tabIndex={0}
                        aria-label="Activate"
                      >
                        <FiRotateCw className="w-4 h-4" /> Activate
                      </button>
                    )}
                    {apiKey.actions.includes("revoke") && (
                      <button
                        className="flex items-center gap-2 border border-gray-200 rounded px-4 py-2 font-semibold bg-white hover:bg-gray-50"
                        tabIndex={0}
                        aria-label="Revoke"
                      >
                        <FiRotateCw className="w-4 h-4" /> Revoke
                      </button>
                    )}
                    {apiKey.actions.includes("delete") && (
                      <button
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2 font-semibold"
                        tabIndex={0}
                        aria-label="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BaseCard>
    </div>
  );
};

export default ViewKeysPage;

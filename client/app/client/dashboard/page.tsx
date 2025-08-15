"use client";
import StatusCard from "@/components/ui/cards/StatusCard";
import { usePageContext } from "@/context/PageTitleContext";
import { useEffect } from "react";
import {
  FaAddressBook,
  FaShareAlt,
  FaCalendarDay,
  FaKey,
  FaUserPlus,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import LeadTooltip from "@/components/tooltip/LeadToolTip";

// Mock data for the last 7 days
const leadsData = [
  {
    day: "Mon",
    leads: 111,
    new: 50,
    contacted: 35,
    converted: 20,
    lost: 6,
  },
  {
    day: "Tue",
    leads: 18,
    new: 8,
    contacted: 5,
    converted: 4,
    lost: 1,
  },
  {
    day: "Wed",
    leads: 9,
    new: 4,
    contacted: 3,
    converted: 1,
    lost: 1,
  },
  {
    day: "Thu",
    leads: 22,
    new: 10,
    contacted: 7,
    converted: 3,
    lost: 2,
  },
  {
    day: "Fri",
    leads: 15,
    new: 6,
    contacted: 5,
    converted: 3,
    lost: 1,
  },
  {
    day: "Sat",
    leads: 17,
    new: 7,
    contacted: 6,
    converted: 3,
    lost: 1,
  },
  {
    day: "Sun",
    leads: 20,
    new: 9,
    contacted: 6,
    converted: 4,
    lost: 1,
  },
];

// Mock stats
const stats = [
  { label: "All", value: 45, color: "text-blue-600" },
  { label: "New", value: 20, color: "text-blue-400" },
  { label: "Contacted", value: 15, color: "text-yellow-500" },
  { label: "Converted", value: 7, color: "text-green-600" },
  { label: "Lost", value: 3, color: "text-red-500" },
];

function DaschboardPage() {
  const { setLabel, setTitle } = usePageContext();
  useEffect(() => {
    setLabel("Overview");
    setTitle("Overview");
  }, [setLabel, setTitle]);

  return (
    <div className="w-full mx-auto space-y-8">
      {/* Status Cards Grid (on top) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatusCard
          label="Total Leads"
          value={"100"}
          icon={<FaAddressBook />}
          color="blue"
        />
        <StatusCard
          label="Leads Shared With Me"
          value={"8"}
          icon={<FaShareAlt />}
          color="orange"
        />
        <StatusCard
          label="Leads Entered Today"
          value={"4"}
          icon={<FaCalendarDay />}
          color="green"
        />
        <StatusCard
          label="Last API Key Created"
          value={"11-02-2003"}
          icon={<FaKey />}
          color="gray"
        />
        <StatusCard
          label="Last Lead Created"
          value={"10-20-2002"}
          icon={<FaUserPlus />}
          color="gray"
        />
      </div>
      {/* Leads Overview Card (below) */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-8">
        {/* Left: Chart */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-1 mb-4">
            <h2 className="text-xl font-bold text-gray-900">Leads Overview</h2>
            <span className="text-xs text-gray-400">
              as of {new Date().toLocaleDateString()}{" "}
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={leadsData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                className="text-xs text-gray-400"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-xs text-gray-400"
                tickCount={6}
              />
              <Tooltip content={<LeadTooltip />} />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 5, stroke: "#2563eb", strokeWidth: 2, fill: "#fff" }}
                activeDot={{ r: 7 }}
                name="All Leads"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Right: Stats */}
        <div className="flex flex-col justify-center min-w-[160px] gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center py-2">
              <span className={`text-xs text-gray-400 mb-1`}>{stat.label}</span>
              <span className={`text-2xl font-bold ${stat.color}`}>
                {stat.value.toString().padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DaschboardPage;

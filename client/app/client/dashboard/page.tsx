"use client";
import StatusCard from "@/components/ui/cards/StatusCard";
import { usePageContext } from "@/context/PageTitleContext";
import { useEffect, useState } from "react";
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
import { getDashboardData, ClientDashboardData, getLeadActivity, LeadActivityData } from "@/services/ClientService";

function DaschboardPage() {
  const { setLabel, setTitle } = usePageContext();
  
  // ===================== Dashboard Data State =====================
  const [dashboardData, setDashboardData] = useState<ClientDashboardData | null>(null);
  const [leadActivity, setLeadActivity] = useState<LeadActivityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLabel("Overview");
    setTitle("Overview");
    
    // Fetch dashboard data and lead activity
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both dashboard data and lead activity in parallel
        const [dashboardResponse, leadActivityResponse] = await Promise.all([
          getDashboardData(),
          getLeadActivity()
        ]);
        
        if (dashboardResponse.success) {
          setDashboardData(dashboardResponse.data);
        }
        
        if (leadActivityResponse.success) {
          setLeadActivity(leadActivityResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setLabel, setTitle]);

  // Helper function to format dates
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth() returns 0-11
      const day = date.getDate();
      return `${year}-${month}-${day}`;
    } catch {
      return "—";
    }
  };

  // Calculate stats from lead activity data
  const stats = leadActivity.length > 0 ? [
    { 
      label: "All", 
      value: leadActivity.reduce((sum, day) => sum + day.leads, 0), 
      color: "text-blue-600" 
    },
    { 
      label: "New", 
      value: leadActivity.reduce((sum, day) => sum + day.new, 0), 
      color: "text-blue-400" 
    },
    { 
      label: "Contacted", 
      value: leadActivity.reduce((sum, day) => sum + day.contacted, 0), 
      color: "text-yellow-500" 
    },
    { 
      label: "Converted", 
      value: leadActivity.reduce((sum, day) => sum + day.converted, 0), 
      color: "text-green-600" 
    },
    { 
      label: "Lost", 
      value: leadActivity.reduce((sum, day) => sum + day.lost, 0), 
      color: "text-red-500" 
    },
  ] : [
    { label: "All", value: 0, color: "text-blue-600" },
    { label: "New", value: 0, color: "text-blue-400" },
    { label: "Contacted", value: 0, color: "text-yellow-500" },
    { label: "Converted", value: 0, color: "text-green-600" },
    { label: "Lost", value: 0, color: "text-red-500" },
  ];

  return (
    <div className="w-full mx-auto space-y-8">
      {/* Status Cards Grid (on top) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatusCard
          label="Total Leads"
          value={loading ? "..." : (dashboardData?.totalLeads?.toString() || "0")}
          icon={<FaAddressBook />}
          color="blue"
        />
        <StatusCard
          label="Leads Shared With Me"
          value={loading ? "..." : (dashboardData?.leadsSharedWithMe?.toString() || "0")}
          icon={<FaShareAlt />}
          color="orange"
        />
        <StatusCard
          label="Leads Entered Today"
          value={loading ? "..." : (dashboardData?.leadsEnteredToday?.toString() || "0")}
          icon={<FaCalendarDay />}
          color="green"
        />
        <StatusCard
          label="Last API Key Created"
          value={loading ? "..." : formatDate(dashboardData?.lastApiKeyCreated || null)}
          icon={<FaKey />}
          color="gray"
        />
        <StatusCard
          label="Last Lead Created"
          value={loading ? "..." : formatDate(dashboardData?.lastLeadCreated || null)}
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
              data={loading ? [] : leadActivity}
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
                {loading ? "..." : stat.value.toString().padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DaschboardPage;

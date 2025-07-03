"use client";
import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";
import { useState } from "react";
import StatusCard from "@/components/ui/cards/StatusCard";
import { FaPlay, FaPause, FaStop, FaCheck, FaFlag } from "react-icons/fa";

function DaschboardPage() {
  const [isLeftBarOpen, setIsLeftBarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SideBar
        activeLabel="Overview"
        isOpen={isLeftBarOpen}
        onClose={() => setIsLeftBarOpen(!isLeftBarOpen)}
        role="client"
      />

      {/* Main area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header
          title="Overview"
          username="mikari alias"
          onMenuClick={() => setIsLeftBarOpen(!isLeftBarOpen)}
        />

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50">
          {/* Your dashboard content goes here */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatusCard
              label="Active"
              count={60}
              icon={<FaPlay />}
              color="blue"
            />
            <StatusCard
              label="Paused"
              count={16}
              icon={<FaPause />}
              color="yellow"
            />
            <StatusCard
              label="Stopped"
              count={64}
              icon={<FaStop />}
              color="red"
            />
            <StatusCard
              label="Completed"
              count={64}
              icon={<FaCheck />}
              color="green"
            />
            <StatusCard
              label="Flagged"
              count={18}
              icon={<FaFlag />}
              color="orange"
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DaschboardPage;

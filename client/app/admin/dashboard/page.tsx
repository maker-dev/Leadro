"use client";
import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";
import React, { useState } from "react";

function DaschboardPage() {
  const [isLeftBarOpen, setIsLeftBarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SideBar
        activeLabel="Overview"
        isOpen={isLeftBarOpen}
        onClose={() => setIsLeftBarOpen(!isLeftBarOpen)}
        role="admin"
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
        </main>
      </div>
    </div>
  );
}

export default DaschboardPage;

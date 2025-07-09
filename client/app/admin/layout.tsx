"use client";
import { ReactNode } from "react";
import SideBar from "@/components/layout/SideBar";
import Header from "@/components/layout/Header";
import { useState } from "react";
import {
  PageContextProvider,
  usePageContext,
} from "@/context/PageTitleContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <PageContextProvider>
      <LayoutContent>{children}</LayoutContent>
    </PageContextProvider>
  );
}

function LayoutContent({ children }: { children: ReactNode }) {
  const [isLeftBarOpen, setIsLeftBarOpen] = useState(false);
  const { title, label } = usePageContext();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SideBar
        activeLabel={label}
        isOpen={isLeftBarOpen}
        onClose={() => setIsLeftBarOpen(!isLeftBarOpen)}
        role="admin"
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <Header
          title={title}
          username="mikari alias"
          onMenuClick={() => setIsLeftBarOpen(!isLeftBarOpen)}
        />

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}

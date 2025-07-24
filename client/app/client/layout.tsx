"use client";
import { ReactNode } from "react";
import SideBar from "@/components/layout/SideBar";
import Header from "@/components/layout/Header";
import { useState } from "react";
import {
  PageContextProvider,
  usePageContext,
} from "@/context/PageTitleContext";
import AuthGuard from "@/components/guards/AuthGuard";
import { useUser } from "@/context/UserContext";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard allowedRoles={["client"]}>
      <PageContextProvider>
        <LayoutContent>{children}</LayoutContent>
      </PageContextProvider>
    </AuthGuard>
  );
}

function LayoutContent({ children }: { children: ReactNode }) {
  const [isLeftBarOpen, setIsLeftBarOpen] = useState(false);
  const { title, label } = usePageContext();
  const { user } = useUser();
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SideBar
        activeLabel={label}
        isOpen={isLeftBarOpen}
        onClose={() => setIsLeftBarOpen(!isLeftBarOpen)}
        role="client"
      />
      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 h-screen">
        {/* Header */}
        <Header
          title={title}
          username={user?.name || ""}
          onMenuClick={() => setIsLeftBarOpen(!isLeftBarOpen)}
        />

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

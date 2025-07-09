"use client";
import { ReactNode, useEffect } from "react";
import SideBar from "@/components/layout/SideBar";
import Header from "@/components/layout/Header";
import { usePathname } from "next/navigation";
import { useState } from "react";

// const adminNavItems = [
//   {
//     label: "Overview",
//     title: "Overview",
//     path: "/admin/dashboard",
//   },
//   {
//     label: "Clients",
//     title: "Clients",
//     path: "/admin/clients",
//   },
//   {
//     label: "Leads",
//     title: "Leads",
//     path: "/admin/leads",
//   },
//   {
//     label: "Api Keys",
//     title: "Api Keys",
//     path: "/admin/api-keys",
//   },
//   {
//     label: "Settings",
//     title: "Settings",
//     path: "/admin/settings",
//   },
// ];

const adminNavItems = [
  {
    label: "Overview",
    title: "Overview",
    pattern: /^\/admin\/dashboard$/,
  },
  {
    label: "Clients",
    title: "Clients",
    pattern: /^\/admin\/clients$/,
  },
  {
    label: "Leads",
    title: "Leads",
    pattern: /^\/admin\/leads$/,
  },
  {
    label: "Api Keys",
    title: "Api Keys",
    pattern: /^\/admin\/api-keys$/,
  },
  {
    label: "Settings",
    title: "Settings",
    pattern: /^\/admin\/settings$/,
  },
];

type NavItem = {
  label: string;
  title: string;
  pattern: RegExp;
};

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname(); // e.g. "/client/leads/view"
  const [isLeftBarOpen, setIsLeftBarOpen] = useState(false);
  const [navItem, setNavItem] = useState<NavItem | null>(null);

  useEffect(() => {
    if (!pathname) return;
    const found = adminNavItems.find((item) => item.pattern.test(pathname));
    setNavItem(found ?? null);
  }, [pathname]);

  const activeLabel = navItem?.label || "";
  const title = navItem?.title || "";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SideBar
        activeLabel={activeLabel}
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

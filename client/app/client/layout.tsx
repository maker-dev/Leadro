"use client";
import { ReactNode, useEffect } from "react";
import SideBar from "@/components/layout/SideBar";
import Header from "@/components/layout/Header";
import { usePathname } from "next/navigation";
import { useState } from "react";

// const clientNavItems = [
//   {
//     label: "Overview",
//     title: "Overview",
//     path: "/client/dashboard",
//   },
//   {
//     label: "Leads",
//     title: "Leads",
//     path: "/client/leads",
//   },
//   {
//     label: "Leads",
//     title: "Create Lead",
//     path: "/client/leads/create",
//   },
//   {
//     label: "Leads",
//     title: "Update Lead",
//     path: "/client/leads/update/",
//   },
//   {
//     label: "Leads",
//     title: "View Lead",
//     path: "/client/leads/view/",
//   },
//   {
//     label: "Access Management",
//     title: "Access Management",
//     path: "/client/access-management",
//   },
//   {
//     label: "Api Key",
//     title: "Api Key",
//     path: "/client/api-key",
//   },
//   {
//     label: "Settings",
//     title: "Settings",
//     path: "/client/settings",
//   },
// ];
const clientNavItems = [
  {
    label: "Overview",
    title: "Overview",
    pattern: /^\/client\/dashboard$/,
  },
  {
    label: "Leads",
    title: "Create Lead",
    pattern: /^\/client\/leads\/create$/,
  },
  {
    label: "Leads",
    title: "Update Lead",
    pattern: /^\/client\/leads\/update\/[^/]+$/,
  },
  {
    label: "Leads",
    title: "View Lead",
    pattern: /^\/client\/leads\/view\/[^/]+$/,
  },
  {
    label: "Leads",
    title: "Leads",
    pattern: /^\/client\/leads$/,
  },
  {
    label: "Access Management",
    title: "Access Management",
    pattern: /^\/client\/access-management$/,
  },
  {
    label: "Api Key",
    title: "Api Key",
    pattern: /^\/client\/api-key$/,
  },
  {
    label: "Settings",
    title: "Settings",
    pattern: /^\/client\/settings$/,
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
    const found = clientNavItems.find((item) => item.pattern.test(pathname));
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
        role="client"
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

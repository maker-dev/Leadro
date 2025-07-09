import React from "react";
import Link from "next/link";
import {
  IoIosHome,
  IoIosPeople,
  IoIosListBox,
  IoIosKey,
  IoIosSettings,
  IoIosLock,
} from "react-icons/io";

const adminNavItems = [
  {
    label: "Overview",
    icon: <IoIosHome className="w-5 h-5 text-white" />,
    href: "/admin/dashboard",
  },
  {
    label: "Clients",
    icon: <IoIosPeople className="w-5 h-5 text-white" />,
    href: "/admin/clients",
  },
  {
    label: "Leads",
    icon: <IoIosListBox className="w-5 h-5 text-white" />,
    href: "/admin/Leads",
  },
  {
    label: "Access Management",
    icon: <IoIosLock className="w-5 h-5 text-white" />,
    href: "/admin/access-management",
  },
  {
    label: "Api Keys",
    icon: <IoIosKey className="w-5 h-5 text-white" />,
    href: "/admin/api-keys",
  },
  {
    label: "Settings",
    icon: <IoIosSettings className="w-5 h-5 text-white" />,
    href: "/admin/settings",
  },
];

const clientNavItems = [
  {
    label: "Overview",
    icon: <IoIosHome className="w-5 h-5 text-white" />,
    href: "/client/dashboard",
  },
  {
    label: "Leads",
    icon: <IoIosListBox className="w-5 h-5 text-white" />,
    href: "/client/leads",
  },
  {
    label: "Access Management",
    icon: <IoIosLock className="w-5 h-5 text-white" />,
    href: "/client/access-management",
  },
  {
    label: "Api Key",
    icon: <IoIosKey className="w-5 h-5 text-white" />,
    href: "/client/api-key",
  },
  {
    label: "Settings",
    icon: <IoIosSettings className="w-5 h-5 text-white" />,
    href: "/client/settings",
  },
];

interface SideBarProps {
  activeLabel: string;
  isOpen: boolean;
  onClose?: () => void;
  role: "admin" | "client";
}

const SideBar: React.FC<SideBarProps> = ({
  activeLabel,
  isOpen,
  onClose,
  role,
}) => {
  const navItems = role === "admin" ? adminNavItems : clientNavItems;

  return (
    <>
      {/* ✅ CHANGE: Overlay for mobile */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-gradient-to-t from-[#2563EB] to-[#269e9b] text-white shadow-lg min-h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transform transition-transform duration-300 lg:translate-x-0 lg:static`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-6 mb-10 mt-10">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="16" cy="16" r="16" fill="#fff" />
            <path
              d="M16 8l4 8h-8l4-8zm0 10a2 2 0 100 4 2 2 0 000-4z"
              fill="#269e9b"
            />
          </svg>
          <span className="text-xl font-bold tracking-wide">
            Identify Leads
          </span>
        </div>
        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => (
            <React.Fragment key={item.label}>
              {/* Divider before Settings */}
              {item.label === "Settings" && (
                <div className="my-4 border-t-2 border-white/12" />
              )}
              <Link
                href={item.href}
                onClick={onClose}
                tabIndex={0}
                aria-label={item.label}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-white/70 transition-colors cursor-pointer text-base
                ${
                  activeLabel === item.label
                    ? "bg-white/20"
                    : "hover:bg-white/10"
                }`}
              >
                <span className="w-6 h-6 flex items-center justify-center">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            </React.Fragment>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default SideBar;

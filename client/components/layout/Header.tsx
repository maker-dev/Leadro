import React from "react";
import {
  IoSearch,
  IoNotificationsOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";

interface SideBarProps {
  title: string;
  username: string;
  onMenuClick?: () => void;
}

const Header: React.FC<SideBarProps> = ({ title, username, onMenuClick }) => (
  <header className="w-full bg-white flex items-center justify-between px-4 py-4 sm:px-6 sm:py-6 shadow-md border-b border-gray-200">
    {/* Left: Burger Icon (mobile) + Page Title */}
    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
      {/* Burger Icon: only visible below lg */}
      <button
        type="button"
        tabIndex={0}
        aria-label="Open sidebar menu"
        className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200 lg:hidden"
        onClick={onMenuClick}
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate max-w-[120px] sm:max-w-xs flex-shrink">
        {title}
      </h1>
    </div>

    {/* Right: Actions & User */}
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Search Button */}
      <button
        tabIndex={0}
        aria-label="Search"
        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        <IoSearch className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
      </button>

      {/* Notification Button */}
      <button
        tabIndex={0}
        aria-label="Notifications"
        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        <IoNotificationsOutline className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
      </button>
      {/* Vertical Divider: only on lg+ */}
      <span
        className="hidden lg:block h-8 w-px bg-gray-200 mx-2"
        aria-hidden="true"
      />
      {/* User Info */}
      <div className="flex items-center gap-1 sm:gap-2">
        <span className="text-xs sm:text-sm capitalize font-medium text-gray-900 hidden lg:inline">
          {username}
        </span>
        <span
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 border border-gray-200"
          aria-label={username}
        >
          <IoPersonCircleOutline className="w-6 h-6 sm:w-7 sm:h-7" />
        </span>
      </div>
    </div>
  </header>
);

export default Header;

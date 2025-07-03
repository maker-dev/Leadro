interface StatusCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  color?: "blue" | "yellow" | "red" | "green" | "orange";
}

const StatusCard: React.FC<StatusCardProps> = ({
  label,
  count,
  icon,
  color = "blue",
}) => {
  const colorClasses = {
    blue: {
      text: "text-blue-600",
      bg: "bg-blue-100",
      line: "bg-blue-600",
      iconBg: "bg-blue-100",
    },
    yellow: {
      text: "text-yellow-500",
      bg: "bg-yellow-100",
      line: "bg-yellow-500",
      iconBg: "bg-yellow-100",
    },
    red: {
      text: "text-red-500",
      bg: "bg-red-100",
      line: "bg-red-500",
      iconBg: "bg-red-100",
    },
    green: {
      text: "text-green-600",
      bg: "bg-green-100",
      line: "bg-green-600",
      iconBg: "bg-green-100",
    },
    orange: {
      text: "text-orange-500",
      bg: "bg-orange-100",
      line: "bg-orange-500",
      iconBg: "bg-orange-100",
    },
  };

  const colorSet = colorClasses[color] || {
    text: "text-gray-600",
    bg: "bg-gray-100",
    line: "bg-gray-400",
    iconBg: "bg-gray-100",
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-5 min-w-[140px] flex flex-col gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200"
      tabIndex={0}
      aria-label={`${label}: ${count}`}
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <span className={`h-1 w-8 rounded-full ${colorSet.line}`} />
      </div>
      <div className="flex items-center gap-3 mt-2">
        <div
          className={`w-9 h-9 flex items-center justify-center rounded-full ${colorSet.iconBg}`}
        >
          <span className={`${colorSet.text}`}>{icon}</span>
        </div>
        <span className={`text-3xl font-bold ${colorSet.text}`}>{count}</span>
      </div>
    </div>
  );
};

export default StatusCard;

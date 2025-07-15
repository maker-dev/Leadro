import React, { ReactNode } from "react";

export type StatisticsCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  ariaLabel?: string;
};

const StatisticsCard = ({
  title,
  value,
  description,
  icon,
  ariaLabel = "Statistics Card",
}: StatisticsCardProps) => {
  return (
    <section
      className="rounded-xl bg-white p-4 shadow-sm flex flex-col gap-1 min-w-[160px]"
      role="region"
      aria-label={ariaLabel}
    >
      <div className="flex items-start justify-between mb-1">
        <span className="font-medium text-base text-gray-900">{title}</span>
        <span aria-hidden="true" className="text-gray-400 text-lg">
          {icon}
        </span>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-0.5">{value}</div>
      <div className="text-sm text-gray-500">{description}</div>
    </section>
  );
};

export default StatisticsCard;

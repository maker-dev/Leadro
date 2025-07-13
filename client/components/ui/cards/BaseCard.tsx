import React from "react";

type BaseCardProps = {
  logo: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
};

const BaseCard: React.FC<BaseCardProps> = ({
  logo,
  title,
  description,
  children,
}) => {
  return (
    <div className="p-8 bg-white rounded-xl border border-gray-200 shadow">
      <div className="flex items-center mb-2">
        <div className="mr-2">{logo}</div>
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
      </div>
      <p className="text-gray-500 mb-8">{description}</p>
      {children}
    </div>
  );
};

export default BaseCard;

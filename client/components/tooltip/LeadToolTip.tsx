const LeadTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-blue-100 shadow-lg rounded-xl px-4 py-3 min-w-[160px]">
        <div className="font-bold text-blue-700 text-sm mb-2">{label}</div>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-600" />
          <span className="text-xs text-gray-500">Total Leads</span>
          <span className="ml-auto text-base font-extrabold text-blue-700">
            {data.leads}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-xs text-gray-500">New</span>
          <span className="ml-auto text-xs font-bold text-blue-500">
            {data.new}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400" />
          <span className="text-xs text-gray-500">Contacted</span>
          <span className="ml-auto text-xs font-bold text-yellow-500">
            {data.contacted}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-gray-500">Converted</span>
          <span className="ml-auto text-xs font-bold text-green-600">
            {data.converted}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
          <span className="text-xs text-gray-500">Lost</span>
          <span className="ml-auto text-xs font-bold text-red-500">
            {data.lost}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default LeadTooltip;

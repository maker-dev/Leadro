"use client";
import StatusCard from "@/components/ui/cards/StatusCard";
import { usePageContext } from "@/context/PageTitleContext";
import { useEffect } from "react";
import { FaPlay, FaPause, FaStop, FaCheck, FaFlag } from "react-icons/fa";

function DaschboardPage() {
  const { setLabel, setTitle } = usePageContext();
  useEffect(() => {
    setLabel("Overview");
    setTitle("Overview");
  }, [setLabel, setTitle]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <StatusCard label="Active" count={60} icon={<FaPlay />} color="blue" />
      <StatusCard label="Paused" count={16} icon={<FaPause />} color="yellow" />
      <StatusCard label="Stopped" count={64} icon={<FaStop />} color="red" />
      <StatusCard
        label="Completed"
        count={64}
        icon={<FaCheck />}
        color="green"
      />
      <StatusCard label="Flagged" count={18} icon={<FaFlag />} color="orange" />
    </div>
  );
}

export default DaschboardPage;

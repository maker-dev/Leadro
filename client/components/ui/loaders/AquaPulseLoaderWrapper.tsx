import dynamic from "next/dynamic";
import { GridLoader } from "react-spinners";

const AquaPulseLoader = dynamic(() => import("./AquaPulseLoader"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <GridLoader color="#31b5b2" size={15} />
      <span className="mt-4 text-[#31b5b2] text-lg font-semibold">
        Loading...
      </span>
    </div>
  ),
});

export default AquaPulseLoader;

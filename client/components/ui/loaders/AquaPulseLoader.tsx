// components/AquaPulseLoader.tsx
"use client";

import { GridLoader } from "react-spinners";

export default function AquaPulseLoader() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <GridLoader color="#31b5b2" size={15} />
      <span className="mt-4 text-[#31b5b2] text-lg font-semibold">
        Loading...
      </span>
    </div>
  );
}

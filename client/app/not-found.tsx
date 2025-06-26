import Image from "next/image";
import NotFoundImage from "@/assets/images/not-found.svg";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center max-w-md w-full">
        <div className="w-60 h-60 relative mb-6">
          <Image
            src={NotFoundImage}
            alt="Page not found"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          404 - Page Not Found
        </h1>
        <p className="text-gray-500 mb-6 text-center">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 rounded-2xl bg-[#31B5B2] text-white font-semibold hover:bg-[#269e9b] transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

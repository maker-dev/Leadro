import Image from "next/image";
import accountLogin from "@/assets/images/account-login.png";
import Link from "next/link";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-2">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left: Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center overflow-y-auto max-h-[800px]">
          <div className="w-full max-w-md mx-auto">
            <div className="flex justify-end text-sm text-gray-500 mb-6 mt-2">
              Don&apos;t have account?{" "}
              <Link
                href={"/register"}
                className="ml-1 font-semibold text-black hover:underline"
              >
                Register
              </Link>
            </div>
            <h1 className="text-2xl font-medium text-center mb-1 mt-2 tracking-wide">
              Welcome
            </h1>
            <p className="text-center text-gray-500 mb-6">
              Best tool for business management
            </p>
            <LoginForm />
          </div>
        </div>
        {/* Right: Image */}
        <div className="hidden md:block md:w-1/2 relative h-[800px]">
          <Image
            src={accountLogin}
            alt="Login visual"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 0vw"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

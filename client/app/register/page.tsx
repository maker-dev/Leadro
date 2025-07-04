import Image from "next/image";
import registerImage from "@/assets/images/account-registration.png";
import Link from "next/link";
import RegisterForm from "./RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left: Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center overflow-y-auto max-h-[800px]">
          <div className="w-full max-w-md mx-auto">
            <div className="flex justify-end text-sm text-gray-500 mb-6 mt-2">
              Already Have an account?{" "}
              <Link
                href={"/login"}
                className="ml-1 font-semibold text-black hover:underline"
              >
                Login
              </Link>
            </div>
            <h1 className="text-3xl font-medium text-center mb-1 mt-14 tracking-wide">
              Welcome
            </h1>
            <p className="text-center text-gray-500 mb-6">
              Best tool for business management
            </p>
            <RegisterForm />
            <p className="text-xs text-gray-400 text-center mt-4">
              By clicking on sign up, you agree to Leadro's{" "}
              <a href="#" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
        {/* Right: Image */}
        <div className="hidden md:block md:w-1/2 relative h-[800px]">
          <Image
            src={registerImage}
            alt="Register visual"
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

export default RegisterPage;

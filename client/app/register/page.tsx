"use client";

import SubmitButton from "@/components/ui/buttons/SubmitButton";

const RegisterPage = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
        Create your Leadro account
      </h1>
      <form
        className="bg-white rounded-xl shadow p-6 flex flex-col gap-4"
        aria-label="Registration form"
      >
        <label className="block" htmlFor="name">
          <span className="text-sm font-medium text-gray-700">Name</span>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
            aria-required="true"
            aria-label="Full name"
          />
        </label>
        <label className="block" htmlFor="email">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
            aria-required="true"
            aria-label="Email address"
          />
        </label>
        <label className="block" htmlFor="password">
          <span className="text-sm font-medium text-gray-700">Password</span>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
            aria-required="true"
            aria-label="Password"
          />
        </label>
        <label className="block" htmlFor="confirmPassword">
          <span className="text-sm font-medium text-gray-700">
            Confirm Password
          </span>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-2"
            aria-required="true"
            aria-label="Confirm password"
          />
        </label>
        <SubmitButton>Register</SubmitButton>
      </form>
    </div>
  );
};

export default RegisterPage;

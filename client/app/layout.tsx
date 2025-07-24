import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { twMerge } from "tailwind-merge";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import RedirectIfAuthenticated from "@/components/redirect/RedirectIfAuthenticated";
import { UserProvider } from "@/context/UserContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Leadro",
  description:
    "Leadro is a multi-tenant CRM platform that allows clients to manage leads through a secure dashboard and collect lead data via a public API. Designed for simplicity, scalability, and real-time lead tracking.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body
        suppressHydrationWarning
        className={twMerge(
          inter.variable,
          jetbrainsMono.variable,
          "antialiased scroll-smooth"
        )}
      >
        <UserProvider>
          <AuthProvider>
            {children}
            <RedirectIfAuthenticated />
          </AuthProvider>
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono, Open_Sans } from "next/font/google";

import "./globals.css";

import { AppProvider } from "@/providers";
import AppBootstrap from "@/components/shared/AppBootstrap";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  ),

  title: {
    default: "DotSkills Panel",
    template: "%s | DotSkills Panel",
  },

  description:
    "DotSkills Panel is a modern Agency CRM & Business Management System for managing projects, teams, clients, tasks, HR, finance, and operations.",

  applicationName: "DotSkills Panel",

  keywords: [
    "DotSkills",
    "CRM",
    "Agency CRM",
    "Business Management",
    "Project Management",
    "Task Management",
    "Client Management",
    "HR Management",
    "Dashboard",
  ],

  authors: [
    {
      name: "DotSkills",
    },
  ],

  creator: "DotSkills",

  publisher: "DotSkills",

  robots: {
    index: false,
    follow: false,
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  openGraph: {
    title: "DotSkills Panel",

    description: "Modern Agency CRM & Business Management Platform.",

    url: process.env.NEXT_PUBLIC_APP_URL,

    siteName: "DotSkills Panel",

    locale: "en_US",

    type: "website",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        ${openSans.variable}
      `}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <AppProvider>
          <UserProvider >

            <AppBootstrap> <Toaster richColors position="top-right" />
              <ThemeProvider>
                <TooltipProvider>{children}</TooltipProvider>
              </ThemeProvider></AppBootstrap>
          </UserProvider>
        </AppProvider>
      </body>
    </html>
  );
}

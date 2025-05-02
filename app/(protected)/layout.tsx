import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "../globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "X_BUDGET",
  description: "Self budgeting application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <div className="flex flex-col">
            <Navbar />
            <div className="flex h-[90vh]">
              <Sidebar />
              {children}
            </div>
          </div>
          <Toaster />
        </body>
      </html>
    </SessionWrapper>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileMenu } from "@/components/layout/MobileMenu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Content Intelligence OS",
  description: "AI SaaS for Content × Ads × Measurement Intelligence",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background flex">
          <Sidebar />
          <div className="flex-1 md:ml-64">
            <MobileMenu />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}


import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Legal AI - Assistance & Prediction",
  description: "AI-Powered Legal Assistance Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="pt-24 min-h-screen px-4 md:px-8 max-w-7xl mx-auto">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

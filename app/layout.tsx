import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Friendtech Buy/Sell",
  description: "Quickly buy and sell clubs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* center everything in body */}
      <body
        className={`${inter.className} bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center`}
      >
        {children}
      </body>
    </html>
  );
}

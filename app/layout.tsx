import type { Metadata } from "next";

import "./globals.css";

import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "WasteAway",
  description:
    "Turn food waste into community value with WasteAway.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
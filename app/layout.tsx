import type { Metadata } from "next";
import "./globals.css";

import { Space_Mono } from "next/font/google";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Burrito Map",
  description: "A Map of Every Burrito I've Ever Eaten",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={spaceMono.className + ` antialiased`}>{children}</body>
    </html>
  );
}

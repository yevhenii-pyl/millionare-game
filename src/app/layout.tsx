import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/globals.css";
import "@/styles/variables.css";

export const metadata: Metadata = {
  title: "Who wants to become a Millionaire?",
  description: "Awesome quiz game",
};

const interLatin = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={interLatin.className}>
      <body>{children}</body>
    </html>
  );
}

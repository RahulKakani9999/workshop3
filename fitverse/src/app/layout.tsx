import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitVerse — Your Wellness Universe",
  description:
    "A 3D immersive wellness dashboard. Track fitness, mental health, and medication reminders in a living universe that evolves with you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#030014] text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}

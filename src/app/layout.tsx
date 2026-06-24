import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/context/ProgressContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AppShell from "@/components/AppShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DSA Revision Hub — Big-tech interview prep",
  description:
    "Beginner-friendly DSA study companion for big-tech interviews. Pattern explanations, dry-runs, runnable code, and step-through animations for 150 classic problems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ThemeProvider>
          <ProgressProvider>
            <AppShell>{children}</AppShell>
          </ProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

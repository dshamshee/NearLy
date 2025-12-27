import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SessionWrapper from "@/providers/sessionWrapper";
import { Toaster } from "sonner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NearLy - Local Services on Demand",
  description: `Stop searching and start fixing. NearLy instantly connects you with trusted, local professionals right when you need them. Whether it's a plumbing emergency, an electrical fix, or general labor, help is just around the corner.
We bring the speed and convenience of ride-sharing to home services. Just open the app, drop a pin, and find skilled workers in your immediate vicinity ready to tackle the job.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionWrapper>
          {children}
          <Toaster />
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}

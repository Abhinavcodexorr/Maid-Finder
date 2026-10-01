import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Help Zone — Find Trusted Professionals for Every Job",
  description:
    "Discover trusted professionals for cleaning, cooking, plumbing, maintenance, childcare and more. Browse profiles for free, unlock contact details with a membership plan.",
  openGraph: {
    title: "Help Zone — Find Trusted Professionals for Every Job",
    description: "Discover trusted professionals for cleaning, cooking, plumbing, maintenance, childcare and more.",
    type: "website",
  },
};

import { ScrollProgressBar } from "@/components/ui/scroll-reveal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <ScrollProgressBar />
        <AuthProvider>
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
          <MobileNav />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

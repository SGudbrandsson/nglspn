import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import { AuthProvider } from "@/contexts/auth";
import { MaintenanceProvider } from "@/contexts/maintenance";
import { Navigation } from "@/components/Navigation";
import { PlausibleTracker } from "@/components/PlausibleTracker";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "naglasúpan",
  description: "All great things start small",
  icons: {
    icon: [
      { url: "/icons/favicon/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/icons/favicon/apple-touch-icon.png" }],
  },
  openGraph: {
    title: "naglasúpan",
    description: "All great things start small",
    images: [
      {
        url: "/icons/app/logo.png",
        alt: "naglasúpan",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "naglasúpan",
    description: "All great things start small",
    images: ["/icons/app/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <PlausibleTracker />
        <MaintenanceProvider>
          <AuthProvider>
            <Suspense>
              <Navigation />
            </Suspense>
            {children}
          </AuthProvider>
        </MaintenanceProvider>
      </body>
    </html>
  );
}

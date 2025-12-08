import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import LayoutClient from '../components/layouts/LayoutClient';
import ChatbotWidget from '../features/chatbot/components/ChatbotWidget';
import { Toaster } from '@/components/ui/sonner';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const momoTrustDisplay = localFont({
  src: "../../public/assets/font/MomoTrustDisplay-Regular.ttf",
  variable: "--font-primary",
  display: "swap",
  weight: "400",
  style: "normal"
});



export const metadata: Metadata = {
  title: "Pento",
  description: "The Smart Household Food Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/font/MomoTrustDisplay-Regular.ttf" as="font" type="font/ttf" />
        <link rel="preload" href="/vecteezy_fantasy-landscape-and-falling-snow_1625855.webm" as="video" type="video/webm" />
        <link rel="icon" type="image/png" href="/logo2.PNG" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${momoTrustDisplay.variable} antialiased`}>
        <LayoutClient>{children}</LayoutClient>
        <ChatbotWidget />
        <Toaster />
      </body>
    </html>
  );
}



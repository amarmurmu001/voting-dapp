"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import dynamic from 'next/dynamic';

// Dynamically import WalletProvider to prevent hydration errors
const SolanaWalletProvider = dynamic(
  () => import("./providers/WalletProvider"),
  { ssr: false }
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Solana Voting DApp</title>
        <meta name="description" content="A decentralized voting application built on Solana blockchain" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <SolanaWalletProvider>
          <div className="flex-1">
            {children}
          </div>
          <footer className="bg-[#0A0F1C] border-t border-none py-1.5 text-center text-sm text-gray-400 pt-16">
            <span className="flex items-center justify-center gap-1">
              <span>✨ Designed and created by</span>
              <a 
                href="https://twitter.com/amarmurmu001" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:text-white transition-colors duration-200"
              >
                @amarmurmu001
              </a>
              <span>✏️</span>
            </span>
          </footer>
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
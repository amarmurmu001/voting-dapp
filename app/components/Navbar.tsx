"use client"
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import WalletMultiButton with ssr disabled
const WalletMultiButtonDynamic = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white/5 backdrop-blur-lg rounded-[50] border border-white/10">
          <div className="container relative mx-auto px-6 py-4">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <Link 
                href="/"
                className="text-2xl font-bold text-white hover:opacity-90 transition-all duration-300 relative group"
              >
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Solana Voting
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link
                  href="/"
                  className={`relative group text-sm font-medium transition-all duration-300 ${
                    isActive('/')
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span>Home</span>
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full ${isActive('/') ? 'w-full' : ''}`}></span>
                </Link>
                <Link
                  href="/proposals"
                  className={`relative group text-sm font-medium transition-all duration-300 ${
                    isActive('/proposals')
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span>Proposals</span>
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full ${isActive('/proposals') ? 'w-full' : ''}`}></span>
                </Link>
                <a
                  href="https://github.com/amarmurmu001/voting-dapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group text-sm font-medium text-gray-400 hover:text-white transition-all duration-300"
                >
                  <span>GitHub</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <span className="px-3 py-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 rounded-full border border-emerald-400/20">
                    Devnet
                  </span>
                </div>
                <WalletMultiButtonDynamic className="!bg-blue-600 hover:!opacity-90 !transition-all !duration-300 !rounded-xl !py-2 !px-4 !text-sm !font-medium" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 
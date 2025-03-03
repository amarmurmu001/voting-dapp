"use client";
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { Navbar } from '../components/Navbar';
import { motion } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();
  const wallet = useWallet();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] ">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-b from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <Navbar />
      
      <main className="relative pt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="initial"
            animate="animate"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeIn} className="space-y-6">
              <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/5 text-gray-300 text-sm">
                🚀 Decentralized Governance Platform
              </span>
              <h1 className="text-7xl font-bold leading-tight">
                <span className="text-white">Your Voice,</span><br />
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Your Vote
                </span>
              </h1>
              <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
                Create and participate in transparent, secure voting proposals powered by Solana blockchain technology.
              </p>
              <div className="flex items-center justify-center gap-4 pt-4">
                {wallet.publicKey ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/proposals')}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl font-medium text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
                  >
                    View Proposals
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/proposals')}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl font-medium text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
                  >
                    Get Started
                  </motion.button>
                )}
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://github.com/yourusername/voting-dapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-medium text-white hover:bg-white/10 transition-all duration-300"
                >
                  View Source
                </motion.a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-20 relative max-w-3xl mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-semibold text-white">Featured Proposals</h3>
                  <span className="px-3 py-1 text-xs font-medium text-blue-400 bg-blue-400/10 rounded-full border border-blue-400/20">
                    Live Now
                  </span>
                </div>
                <div className="space-y-6">
                  <div className="group bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-white group-hover:text-purple-400 transition-colors duration-300">
                        Community Governance Update
                      </h4>
                      <span className="px-2 py-1 text-xs bg-emerald-400/10 text-emerald-400 rounded-full">
                        Active
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-4 text-left">Vote on the new community guidelines and governance structure...</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-1 rounded-full bg-gray-700">
                          <div className="w-3/4 h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
        </div>
                        <span className="text-gray-400">75%</span>
        </div>
                      <span className="text-gray-400">24h left</span>
            </div>
          </div>
          
                  <div className="group bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-white group-hover:text-purple-400 transition-colors duration-300">
                        Treasury Allocation
                      </h4>
                      <span className="px-2 py-1 text-xs bg-emerald-400/10 text-emerald-400 rounded-full">
                        Active
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-4 text-left">Decide on the distribution of community funds for Q2 2024...</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-1 rounded-full bg-gray-700">
                          <div className="w-1/2 h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        </div>
                        <span className="text-gray-400">50%</span>
                      </div>
                      <span className="text-gray-400">2d left</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-32 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              <div className="group bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                <div className="w-12 h-12 mb-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300 text-center">
                  Secure Voting
                </h3>
                <p className="text-gray-400 leading-relaxed text-center">
                  Blockchain-based voting ensures complete transparency and immutability of all votes.
                </p>
              </div>

              <div className="group bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                <div className="w-12 h-12 mb-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300 text-center">
                  Community Driven
                </h3>
                <p className="text-gray-400 leading-relaxed text-center">
                  Create and participate in proposals that shape the future of decentralized governance.
                </p>
              </div>

              <div className="group bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                <div className="w-12 h-12 mb-6 rounded-2xl bg-gradient-to-r from-pink-500/10 to-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300 text-center">
                  Easy to Use
                </h3>
                <p className="text-gray-400 leading-relaxed text-center">
                  Intuitive interface for creating and voting on proposals with your Solana wallet.
                </p>
          </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
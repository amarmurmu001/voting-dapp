import { Navbar } from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                Decentralized Voting Platform on Solana
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Create proposals, cast votes, and participate in decentralized decision-making powered by the Solana blockchain.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/proposals" 
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all text-center"
                >
                  View Proposals
                </a>
                <a 
                  href="/docs" 
                  className="px-8 py-4 bg-gray-800 rounded-lg font-medium hover:bg-gray-700 transition-all text-center"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl filter blur-3xl"></div>
              <div className="relative bg-gray-800 rounded-3xl p-8 border border-gray-700">
                <div className="space-y-6">
                  {/* Sample Proposal Card */}
                  <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-200">Community Governance</h3>
                      <span className="px-3 py-1 text-sm rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                        Active
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      Proposal to implement community-driven governance mechanisms...
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Yes Votes</p>
                        <p className="text-green-400 font-medium">156</p>
                      </div>
                      <div>
                        <p className="text-gray-400">No Votes</p>
                        <p className="text-red-400 font-medium">23</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Features List */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-300">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Secure blockchain voting</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Real-time vote tracking</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Community-driven decisions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-800/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure & Transparent</h3>
              <p className="text-gray-400">
                Built on Solana blockchain, ensuring transparent and tamper-proof voting records.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-gray-400">
                Leverage Solana's high-speed network for instant vote confirmation.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Community Driven</h3>
              <p className="text-gray-400">
                Empower your community with decentralized decision-making tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                VotingDApp
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 VotingDApp. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 
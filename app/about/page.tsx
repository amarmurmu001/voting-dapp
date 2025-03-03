import { Navbar } from '../components/Navbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            About VotingDApp
          </h1>
          
          <div className="space-y-8">
            <section className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-400 leading-relaxed">
                VotingDApp aims to revolutionize community decision-making by leveraging the power of blockchain technology. 
                Built on the Solana network, we provide a secure, transparent, and efficient platform for creating and 
                managing decentralized voting processes.
              </p>
            </section>

            <section className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">Why Blockchain Voting?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Security</h3>
                    <p className="text-gray-400">
                      Blockchain technology ensures that votes are immutable and tamper-proof, 
                      providing a secure foundation for democratic decision-making.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Transparency</h3>
                    <p className="text-gray-400">
                      All votes are recorded on the public blockchain, allowing anyone to verify 
                      the results while maintaining voter privacy.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Efficiency</h3>
                    <p className="text-gray-400">
                      Solana's high-speed network enables instant vote confirmation and real-time 
                      result tracking, making the voting process seamless and efficient.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  VotingDApp uses smart contracts deployed on the Solana blockchain to manage the 
                  entire voting process. Each proposal is stored as a unique account on the blockchain, 
                  containing all relevant information such as the proposal details, voting period, 
                  and current results.
                </p>
                <p>
                  When a user casts a vote, the transaction is processed by the Solana network and 
                  recorded permanently on the blockchain. The smart contract ensures that each user 
                  can only vote once per proposal and that votes are only accepted during the 
                  active voting period.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 
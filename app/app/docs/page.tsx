import { Navbar } from '../../components/Navbar';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Documentation
          </h1>
          
          <div className="space-y-8">
            <section className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  To start using VotingDApp, you'll need:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>A Solana wallet (like Phantom or Solflare)</li>
                  <li>Some SOL tokens for transaction fees</li>
                  <li>Connection to Solana devnet network</li>
                </ul>
              </div>
            </section>

            <section className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">Creating a Proposal</h2>
              <div className="space-y-4">
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-medium mb-2 text-blue-400">Step 1: Connect Your Wallet</h3>
                  <p className="text-gray-400">
                    Click the "Connect Wallet" button in the top right corner and select your Solana wallet.
                  </p>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-medium mb-2 text-blue-400">Step 2: Navigate to Proposals</h3>
                  <p className="text-gray-400">
                    Click on "Proposals" in the navigation menu to access the proposal creation form.
                  </p>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-medium mb-2 text-blue-400">Step 3: Fill the Form</h3>
                  <p className="text-gray-400">
                    Enter your proposal's title, description, and duration. Make sure to provide clear 
                    and detailed information about what you're proposing.
                  </p>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-medium mb-2 text-blue-400">Step 4: Submit</h3>
                  <p className="text-gray-400">
                    Click "Create Proposal" and approve the transaction in your wallet. Your proposal 
                    will be created once the transaction is confirmed.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">Voting on Proposals</h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  To vote on a proposal:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Click on any active proposal to view its details</li>
                  <li>Review the proposal information carefully</li>
                  <li>Click either "Vote Yes" or "Vote No"</li>
                  <li>Approve the transaction in your wallet</li>
                </ol>
                <p className="mt-4">
                  Note: You can only vote once per proposal, and your vote cannot be changed once submitted.
                </p>
              </div>
            </section>

            <section className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">Technical Details</h2>
              <div className="space-y-4">
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-medium mb-2">Smart Contract</h3>
                  <p className="text-gray-400 mb-2">
                    Program ID: <code className="bg-gray-800 px-2 py-1 rounded">3ThCo6aDC3H9qmUNz8dALXLrbJbogvVCZeN3iu6Gbsee</code>
                  </p>
                  <p className="text-gray-400">
                    The smart contract is written in Rust using the Anchor framework and deployed on the 
                    Solana devnet.
                  </p>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-medium mb-2">Transaction Fees</h3>
                  <p className="text-gray-400">
                    All transactions require a small amount of SOL to cover network fees. Make sure you 
                    have enough SOL in your wallet before creating proposals or voting.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 
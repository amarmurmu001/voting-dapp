"use client";
import { useEffect, useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN, Idl } from '@project-serum/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import idl from '../../idl/voting_program.json';
import { ProposalList } from '../../components/ProposalList';
import { CreateProposalForm } from '../../components/CreateProposalForm';
import { ProposalDetails } from '../../components/ProposalDetails';
import { Proposal, ProgramState, VoterInfo } from '../types';
import { Navbar } from '../../components/Navbar';
import { motion } from 'framer-motion';

// Dynamically import WalletMultiButton with ssr disabled
const WalletMultiButtonDynamic = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

// Constants
const PROGRAM_ID = new PublicKey("3ThCo6aDC3H9qmUNz8dALXLrbJbogvVCZeN3iu6Gbsee");
const { SystemProgram } = web3;

// Types
interface ProgramAccountType {
  proposalCount: BN;
  authority: PublicKey;
}

interface ProposalAccountType {
  id: BN;
  title: string;
  description: string;
  creator: PublicKey;
  yesVotes: BN;
  noVotes: BN;
  endTime: BN;
  isActive: boolean;
  totalVoters: BN;
}

interface VoterInfoType {
  hasVoted: boolean;
  voter: PublicKey;
  vote: boolean;
}

// Create a type-safe IDL
const votingProgramIdl = {
  version: "0.1.0",
  name: "voting_program",
  instructions: idl.instructions,
  accounts: idl.idl_accounts.map(account => ({
    name: account.name,
    type: {
      kind: "struct",
      fields: account.type.fields
    }
  })),
  events: idl.events,
  errors: idl.errors,
} as Idl;

// Type guards
const isProgramState = (account: any): account is ProgramAccountType => {
  console.log("Validating program state account:", account);
  return (
    account &&
    'proposalCount' in account &&
    account.proposalCount instanceof BN &&
    'authority' in account &&
    account.authority instanceof PublicKey
  );
};

const isProposal = (account: any): account is ProposalAccountType => {
  console.log("Validating proposal account:", account);
  return (
    account &&
    'id' in account && account.id instanceof BN &&
    'title' in account && typeof account.title === 'string' &&
    'description' in account && typeof account.description === 'string' &&
    'creator' in account && account.creator instanceof PublicKey &&
    'yesVotes' in account && account.yesVotes instanceof BN &&
    'noVotes' in account && account.noVotes instanceof BN &&
    'endTime' in account && account.endTime instanceof BN &&
    'isActive' in account && typeof account.isActive === 'boolean' &&
    'totalVoters' in account && account.totalVoters instanceof BN
  );
};

const isVoterInfo = (account: any): account is VoterInfoType => {
  console.log("Validating voter info account:", account);
  return (
    account &&
    'hasVoted' in account && typeof account.hasVoted === 'boolean' &&
    'voter' in account && account.voter instanceof PublicKey &&
    'vote' in account && typeof account.vote === 'boolean'
  );
};

export default function ProposalsPage() {
  const wallet = useWallet();
  const [mounted, setMounted] = useState(false);
  const [program, setProgram] = useState<Program | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(false);
  const [programStatePDA, setProgramStatePDA] = useState<PublicKey | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Handle mounting state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize connection
  useEffect(() => {
    if (!mounted) return;
    
    try {
      const conn = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com",
        { commitment: 'confirmed', confirmTransactionInitialTimeout: 60000 }
      );
      setConnection(conn);
    } catch (err) {
      console.error("Failed to initialize connection:", err);
      setError("Failed to connect to Solana network");
    }
  }, [mounted]);

  // Initialize program
  useEffect(() => {
    if (!mounted || !wallet.publicKey || !wallet.signTransaction || !connection) return;
    
    const initializeProgram = async () => {
      try {
        setError(null);
        
        // Create provider with explicit commitment levels
        const provider = new AnchorProvider(
          connection,
          wallet as AnchorWallet,
          { 
            commitment: 'confirmed',
            preflightCommitment: 'confirmed',
            skipPreflight: false
          }
        );
        
        // Initialize program
        const program = new Program(votingProgramIdl, PROGRAM_ID, provider);
        
        // Find program state PDA
        const [pda, bump] = await PublicKey.findProgramAddress(
          [Buffer.from("program_state")],
          program.programId
        );
        
        console.log("Program state PDA:", pda.toString(), "bump:", bump);
        
        setProgram(program);
        setProgramStatePDA(pda);
        
      } catch (err) {
        console.error("Failed to initialize program:", err);
        setError("Failed to initialize program");
      }
    };

    initializeProgram();
  }, [wallet.publicKey, wallet.signTransaction, connection, mounted]);

  // Initialize program state if it doesn't exist
  const initializeProgramState = useCallback(async () => {
    if (!program || !wallet.publicKey || !programStatePDA) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log("Initializing program state...");
      console.log("Wallet public key:", wallet.publicKey.toString());
      console.log("Program ID:", program.programId.toString());
      
      // Get the PDA and bump
      const [pda, bump] = await PublicKey.findProgramAddress(
        [Buffer.from("program_state")],
        program.programId
      );
      
      console.log("Program state PDA:", pda.toString(), "bump:", bump);
      
      // Verify PDA matches
      if (pda.toString() !== programStatePDA.toString()) {
        throw new Error("PDA mismatch");
      }
      
      const tx = await program.methods
        .initialize()
        .accounts({
          program_state: pda,
          authority: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      
      console.log("Program state initialization tx:", tx);
      
      // Wait for confirmation with max retries
      const maxRetries = 5;
      let retries = 0;
      let programState = null;
      
      while (retries < maxRetries) {
        try {
          // Wait for confirmation with longer timeout
          await program.provider.connection.confirmTransaction(tx, 'confirmed');
          
          // Try to fetch the account
          programState = await program.account.programState.fetch(pda);
          console.log("Fetched program state:", programState);
          
          // Verify the account data
          const typedAccount = programState as unknown as ProgramAccountType;
          if (isProgramState(typedAccount)) {
            console.log("Program state initialized and verified successfully");
            return typedAccount;
          }
          
          console.log("Invalid program state data, retrying...");
        } catch (err) {
          console.log("Failed to fetch program state, retrying...", err);
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
        retries++;
      }
      
      throw new Error("Failed to initialize program state after multiple retries");
      
    } catch (err) {
      console.error("Failed to initialize program state:", err);
      setError("Failed to initialize program state");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [program, wallet.publicKey, programStatePDA]);

  // Fetch program state with initialization if needed
  const fetchProgramState = useCallback(async () => {
    if (!program || !programStatePDA) return null;
    
    try {
      const account = await program.account.programState.fetch(programStatePDA);
      console.log("Raw program state account:", account);
      console.log("Account keys:", Object.keys(account));
      console.log("proposalCount type:", typeof account.proposalCount);
      console.log("authority type:", typeof account.authority);
      
      const typedAccount = account as unknown as ProgramAccountType;
      if (!isProgramState(typedAccount)) {
        console.error("Program state validation failed. Account:", typedAccount);
        throw new Error("Invalid program state account data");
      }
      return typedAccount;
    } catch (err: any) {
      if (err.toString().includes("Account does not exist")) {
        console.log("Program state account does not exist, initializing...");
        const newAccount = await initializeProgramState();
        console.log("New program state account:", newAccount);
        const typedNewAccount = newAccount as unknown as ProgramAccountType;
        if (!isProgramState(typedNewAccount)) {
          console.error("New program state validation failed. Account:", typedNewAccount);
          throw new Error("Invalid program state account data after initialization");
        }
        return typedNewAccount;
      }
      throw err;
    }
  }, [program, programStatePDA, initializeProgramState]);

  // Fetch proposals
  const fetchProposals = useCallback(async () => {
    if (!program || !programStatePDA || !wallet.publicKey) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get program state
      const programState = await fetchProgramState();
      if (!programState) {
        throw new Error("Failed to get program state");
      }
      
      const proposalCount = programState.proposalCount.toNumber();
      console.log("Found", proposalCount, "proposals");
      
      const proposalAccounts = [];
      
      // Fetch all proposals
      for (let i = 0; i < proposalCount; i++) {
        try {
          const [proposalPDA] = await PublicKey.findProgramAddress(
            [Buffer.from("proposal"), new BN(i).toArrayLike(Buffer, "le", 8)],
            program.programId
          );
          
          const rawProposalData = await program.account.proposal.fetch(proposalPDA);
          console.log("Raw proposal data:", rawProposalData);
          
          const typedProposalData = rawProposalData as unknown as ProposalAccountType;
          if (!isProposal(typedProposalData)) {
            console.error(`Invalid proposal data for proposal ${i}:`, typedProposalData);
            continue;
          }
          
          // Process the proposal data
          const processedProposal: Proposal = {
            id: typedProposalData.id,
            title: typedProposalData.title,
            description: typedProposalData.description,
            creator: typedProposalData.creator,
            yesVotes: typedProposalData.yesVotes,
            noVotes: typedProposalData.noVotes,
            endTime: typedProposalData.endTime,
            isActive: typedProposalData.isActive,
            totalVoters: typedProposalData.totalVoters,
            publicKey: proposalPDA,
            endTimeFormatted: new Date(typedProposalData.endTime.toNumber() * 1000).toLocaleString()
          };
          
          proposalAccounts.push(processedProposal);
        } catch (err) {
          console.error(`Error fetching proposal ${i}:`, err);
        }
      }
      
      setProposals(proposalAccounts);
      
    } catch (err) {
      console.error("Failed to fetch proposals:", err);
      setError("Failed to fetch proposals");
    } finally {
      setLoading(false);
    }
  }, [program, programStatePDA, wallet.publicKey, fetchProgramState]);

  // Fetch proposals when program is initialized
  useEffect(() => {
    if (!program || !programStatePDA || !wallet.publicKey) return;
    fetchProposals();
  }, [program, programStatePDA, wallet.publicKey, fetchProposals]);

  // Create proposal
  const createProposal = async (title: string, description: string, durationInDays: number) => {
    if (!program || !wallet.publicKey || !programStatePDA) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // First, ensure program state is initialized
      let programState = null;
      try {
        programState = await program.account.programState.fetch(programStatePDA);
      } catch (err) {
        console.log("Program state not found, initializing...");
        await initializeProgramState();
        programState = await program.account.programState.fetch(programStatePDA);
      }
      
      if (!programState) {
        throw new Error("Failed to get program state");
      }
      
      const now = Math.floor(Date.now() / 1000);
      const endTime = new BN(now + (durationInDays * 24 * 60 * 60));
      
      const proposalId = (programState as any).proposalCount.toNumber();
      const [proposalPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("proposal"), new BN(proposalId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );
      
      console.log("Creating proposal with:", {
        programState: programStatePDA.toString(),
        proposal: proposalPDA.toString(),
        creator: wallet.publicKey.toString(),
        proposalId,
      });
      
      const tx = await program.methods
        .createProposal(title, description, endTime)
        .accounts({
          programState: programStatePDA,
          proposal: proposalPDA,
          creator: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      
      console.log("Proposal created, tx:", tx);
      
      // Wait for confirmation
      await program.provider.connection.confirmTransaction(tx, 'confirmed');
      
      // Refresh proposals
      await fetchProposals();
      
    } catch (err) {
      console.error("Failed to create proposal:", err);
      setError("Failed to create proposal: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  // Cast vote
  const castVote = async (proposalPDA: PublicKey, vote: boolean) => {
    if (!program || !wallet.publicKey) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [voterInfoPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("voter"), proposalPDA.toBuffer(), wallet.publicKey.toBuffer()],
        program.programId
      );
      
      const tx = await program.methods
        .castVote(vote)
        .accounts({
          proposal: proposalPDA,
          voterInfo: voterInfoPDA,
          voter: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc({ commitment: 'confirmed' });
      
      console.log("Vote cast, tx:", tx);
      
      // Refresh proposals
      await fetchProposals();
      
    } catch (err) {
      console.error("Failed to cast vote:", err);
      setError("Failed to cast vote");
    } finally {
      setLoading(false);
    }
  };

  // Finalize proposal
  const finalizeProposal = async (proposalPDA: PublicKey) => {
    if (!program || !wallet.publicKey) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const tx = await program.methods
        .finalizeProposal()
        .accounts({
          proposal: proposalPDA,
          authority: wallet.publicKey,
        })
        .rpc({ commitment: 'confirmed' });
      
      console.log("Proposal finalized, tx:", tx);
      
      // Refresh proposals
      await fetchProposals();
      
    } catch (err) {
      console.error("Failed to finalize proposal:", err);
      setError("Failed to finalize proposal");
    } finally {
      setLoading(false);
    }
  };

  // Check voter status
  const checkVoterStatus = async (proposalPDA: PublicKey): Promise<{ hasVoted: boolean; vote: boolean }> => {
    if (!program || !wallet.publicKey) return { hasVoted: false, vote: false };
    
    try {
      const [voterInfoPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("voter"), proposalPDA.toBuffer(), wallet.publicKey.toBuffer()],
        program.programId
      );
      
      try {
        const voterInfo = await program.account.voterInfo.fetch(voterInfoPDA);
        const typedVoterInfo = voterInfo as unknown as VoterInfoType;
        if (!isVoterInfo(typedVoterInfo)) {
          throw new Error("Invalid voter info account data");
        }
        return { hasVoted: typedVoterInfo.hasVoted, vote: typedVoterInfo.vote };
      } catch {
        return { hasVoted: false, vote: false };
      }
    } catch (err) {
      console.error("Failed to check voter status:", err);
      return { hasVoted: false, vote: false };
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-b from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
            </div>
      
      <Navbar />
      
      <main className="relative pt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
          {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
                {error}
            </div>
          )}

        {!wallet.publicKey ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-6 sm:p-8 bg-white/5 rounded-3xl border border-white/10 max-w-lg mx-auto"
              >
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Connect Wallet</h2>
                <WalletMultiButtonDynamic className="!bg-blue-600 hover:!opacity-90 !transition-all !duration-300 !rounded-xl !py-3 !px-6 !text-sm !font-medium mx-auto" />
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Create Proposal Modal */}
                {showCreateForm && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-[#0A0F1C] p-4 sm:p-6 rounded-2xl border border-white/10 w-full max-w-xl relative"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-white">New Proposal</h2>
                        <button 
                          onClick={() => setShowCreateForm(false)}
                          className="text-gray-400 hover:text-white transition-colors p-1.5"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <CreateProposalForm 
                        onSubmit={async (...args) => {
                          await createProposal(...args);
                          setShowCreateForm(false);
                        }} 
                        isLoading={loading} 
                      />
                    </motion.div>
                  </div>
                )}

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Proposals List */}
                  <div className="lg:col-span-5">
                    <div className="bg-white/5 p-3 sm:p-4 rounded-2xl border border-white/10 backdrop-blur-sm h-full">
                      <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-semibold text-white">Active Proposals</h2>
                        <button
                          onClick={() => setShowCreateForm(true)}
                          className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                          title="Create New Proposal"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      {loading && (
                        <div className="flex justify-end mb-3">
                          <span className="px-2 py-0.5 text-xs font-medium text-blue-400 bg-blue-400/10 rounded-full border border-blue-400/20 animate-pulse">
                            Loading...
                          </span>
                        </div>
                      )}
                      <div className="overflow-y-auto max-h-[calc(100vh-12rem)] scrollbar-thin scrollbar-track-[#0A0F1C] scrollbar-thumb-gradient hover:scrollbar-thumb-gradient-hover scrollbar-thumb-rounded-full scrollbar-track-rounded-full transition-all duration-200 pr-2 [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-blue-500/20 [&::-webkit-scrollbar-thumb]:via-purple-500/20 [&::-webkit-scrollbar-thumb]:to-pink-500/20 hover:[&::-webkit-scrollbar-thumb]:from-blue-500/40 hover:[&::-webkit-scrollbar-thumb]:via-purple-500/40 hover:[&::-webkit-scrollbar-thumb]:to-pink-500/40">
                        <ProposalList 
                          proposals={proposals}
                          onSelectProposal={setSelectedProposal}
                          isLoading={loading}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Proposal Details */}
                  <div className="lg:col-span-7 lg:sticky lg:top-24">
                    {selectedProposal ? (
                      <div className="bg-white/5 p-3 sm:p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <ProposalDetails
                          proposal={selectedProposal}
                          onVote={castVote}
                          onFinalize={finalizeProposal}
                          checkVoterStatus={checkVoterStatus}
                          isLoading={loading}
                          onBack={() => setSelectedProposal(null)}
                          userPubkey={wallet.publicKey}
                        />
                      </div>
                    ) : (
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm text-center">
                        <div className="text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-sm">Select a proposal to view details</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
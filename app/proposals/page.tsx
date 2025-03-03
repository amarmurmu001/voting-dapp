"use client";
import { useEffect, useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN, Idl } from '@project-serum/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import idl from '../../idl/voting_program.json';
import { ProposalList } from '../../components/ProposalList';
import { CreateProposalForm } from '../../components/CreateProposalForm';
import { ProposalDetails } from '../../components/ProposalDetails';
import { Proposal, ProgramState } from '../types';
import { Navbar } from '../../components/Navbar';

// Constants
const PROGRAM_ID = new PublicKey("3ThCo6aDC3H9qmUNz8dALXLrbJbogvVCZeN3iu6Gbsee");
const { SystemProgram } = web3;

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
          if (programState) {
            console.log("Program state initialized and verified successfully");
            return programState;
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
      
      return account;
    } catch (err: any) {
      if (err.toString().includes("Account does not exist")) {
        console.log("Program state account does not exist, initializing...");
        return await initializeProgramState();
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
          
          const proposalData = await program.account.proposal.fetch(proposalPDA);
          console.log("Raw proposal data:", proposalData);
          
          // Convert BN-like objects to actual BN instances if needed
          const processedProposal = {
            ...proposalData,
            id: BN.isBN(proposalData.id) ? proposalData.id : new BN(proposalData.id),
            yesVotes: BN.isBN(proposalData.yesVotes) ? proposalData.yesVotes : new BN(proposalData.yesVotes),
            noVotes: BN.isBN(proposalData.noVotes) ? proposalData.noVotes : new BN(proposalData.noVotes),
            endTime: BN.isBN(proposalData.endTime) ? proposalData.endTime : new BN(proposalData.endTime),
            totalVoters: BN.isBN(proposalData.totalVoters) ? proposalData.totalVoters : new BN(proposalData.totalVoters),
            creator: proposalData.creator instanceof PublicKey ? proposalData.creator : new PublicKey(proposalData.creator),
            publicKey: proposalPDA,
            endTimeFormatted: new Date(proposalData.endTime.toNumber() * 1000).toLocaleString()
          };
          
          proposalAccounts.push(processedProposal);
        } catch (err) {
          console.error(`Failed to fetch proposal ${i}:`, err);
          continue;
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
      
      const proposalId = programState.proposalCount.toNumber();
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
        return { hasVoted: voterInfo.hasVoted, vote: voterInfo.vote };
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
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-32">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                Governance Proposals
              </h1>
              <p className="text-gray-400 text-lg">
                Create and vote on proposals using Solana blockchain
              </p>
            </div>
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}
        </header>

        {!wallet.publicKey ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm border border-gray-700 shadow-xl max-w-lg mx-auto">
              <h2 className="text-2xl font-semibold mb-4 text-gray-200">Welcome to Solana Voting</h2>
              <p className="text-xl mb-6 text-gray-400">Connect your wallet to start creating and voting on proposals</p>
              <div className="flex justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-gray-800/50 p-6 rounded-2xl backdrop-blur-sm border border-gray-700 shadow-xl sticky top-24">
                <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  Create Proposal
                </h2>
                <CreateProposalForm onSubmit={createProposal} isLoading={loading} />
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 p-6 rounded-2xl backdrop-blur-sm border border-gray-700 shadow-xl">
                {selectedProposal ? (
                  <ProposalDetails 
                    proposal={selectedProposal}
                    onBack={() => setSelectedProposal(null)}
                    onVote={castVote}
                    onFinalize={finalizeProposal}
                    checkVoterStatus={checkVoterStatus}
                    userPubkey={wallet.publicKey}
                    isLoading={loading}
                  />
                ) : (
                  <ProposalList 
                    proposals={proposals} 
                    onSelectProposal={setSelectedProposal}
                    isLoading={loading}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
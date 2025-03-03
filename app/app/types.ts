import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';

export interface ProgramState {
  proposalCount: BN;
  authority: PublicKey;
}

export interface Proposal {
  id: BN;
  title: string;
  description: string;
  creator: PublicKey;
  yesVotes: BN;
  noVotes: BN;
  endTime: BN;
  isActive: boolean;
  totalVoters: BN;
  publicKey?: PublicKey;
  endTimeFormatted?: string;
}

export interface VoterInfo {
  hasVoted: boolean;
  voter: PublicKey;
  vote: boolean;
} 
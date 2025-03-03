import React, { useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { Proposal } from '../app/types';

interface ProposalDetailsProps {
  proposal: Proposal;
  onBack: () => void;
  onVote: (proposalPDA: PublicKey, vote: boolean) => Promise<void>;
  onFinalize: (proposalPDA: PublicKey) => Promise<void>;
  checkVoterStatus: (proposalPDA: PublicKey) => Promise<{ hasVoted: boolean; vote: boolean }>;
  userPubkey: PublicKey;
  isLoading: boolean;
}

export function ProposalDetails({
  proposal,
  onBack,
  onVote,
  onFinalize,
  checkVoterStatus,
  userPubkey,
  isLoading
}: ProposalDetailsProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [previousVote, setPreviousVote] = useState(false);

  useEffect(() => {
    const checkVoteStatus = async () => {
      if (proposal.publicKey) {
        const status = await checkVoterStatus(proposal.publicKey);
        setHasVoted(status.hasVoted);
        setPreviousVote(status.vote);
      }
    };
    checkVoteStatus();
  }, [proposal.publicKey, checkVoterStatus]);

  const handleVote = async (vote: boolean) => {
    if (proposal.publicKey) {
      await onVote(proposal.publicKey, vote);
    }
  };

  const handleFinalize = async () => {
    if (proposal.publicKey) {
      await onFinalize(proposal.publicKey);
    }
  };

  // Add defensive checks for proposal data
  if (!proposal || !proposal.endTime || !proposal.isActive || !proposal.creator) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const isEnded = now > proposal.endTime.toNumber();
  const canFinalize = isEnded && proposal.isActive;
  const isCreator = proposal.creator.equals(userPubkey);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-200 flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Proposals
        </button>
        
        {canFinalize && isCreator && (
          <button
            onClick={handleFinalize}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Finalizing...' : 'Finalize Proposal'}
          </button>
        )}
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            {proposal.title}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
            <span>Created by: {proposal.creator.toString().slice(0, 4)}...{proposal.creator.toString().slice(-4)}</span>
            <span>•</span>
            <span>Ends: {proposal.endTimeFormatted}</span>
          </div>
          <p className="text-gray-300 whitespace-pre-wrap">{proposal.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 p-6 bg-gray-900/30 rounded-xl border border-gray-700">
          <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <h4 className="text-sm font-medium text-green-400 mb-2">Yes Votes</h4>
            <p className="text-2xl font-bold text-green-400">{proposal.yesVotes.toString()}</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <h4 className="text-sm font-medium text-red-400 mb-2">No Votes</h4>
            <p className="text-2xl font-bold text-red-400">{proposal.noVotes.toString()}</p>
          </div>
        </div>

        {proposal.isActive && !isEnded && !hasVoted && (
          <div className="p-6 bg-gray-900/30 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Cast Your Vote</h3>
            <div className="flex gap-4">
              <button
                onClick={() => handleVote(true)}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Vote Yes
              </button>
              <button
                onClick={() => handleVote(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Vote No
              </button>
            </div>
          </div>
        )}

        {hasVoted && (
          <div className="p-6 bg-gray-900/30 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3 text-gray-300">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>
                You voted <span className="font-medium">{previousVote ? 'Yes' : 'No'}</span> on this proposal
              </p>
            </div>
          </div>
        )}

        {!proposal.isActive && (
          <div className="p-6 bg-gray-900/30 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3 text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>This proposal has ended</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import React from 'react';
import { PublicKey } from '@solana/web3.js';
import { Proposal } from '../app/types';

interface ProposalListProps {
  proposals: Proposal[];
  onSelectProposal: (proposal: Proposal) => void;
  isLoading: boolean;
}

export function ProposalList({ proposals, onSelectProposal, isLoading }: ProposalListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Proposals Yet</h3>
        <p className="text-gray-400">Create a new proposal to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {proposals.map((proposal) => {
          if (!proposal || !proposal.id || !proposal.yesVotes || !proposal.noVotes || !proposal.endTime) {
            return null;
          }
          
          return (
            <button
              key={proposal.id.toString()}
              onClick={() => onSelectProposal(proposal)}
              className="w-full p-6 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">
                  {proposal.title}
                </h3>
                <span className="px-3 py-1 text-sm rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                  {proposal.isActive ? 'Active' : 'Ended'}
                </span>
              </div>
              
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {proposal.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="text-gray-400">Yes Votes</p>
                  <p className="text-green-400 font-medium">{proposal.yesVotes.toString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400">No Votes</p>
                  <p className="text-red-400 font-medium">{proposal.noVotes.toString()}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  Ends at: {proposal.endTimeFormatted}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
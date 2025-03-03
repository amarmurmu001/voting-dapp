import React, { useState, useEffect } from 'react';

const VotingResultsVisualization = ({ proposals }) => {
  const [selectedProposal, setSelectedProposal] = useState(null);
  
  useEffect(() => {
    if (proposals && proposals.length > 0) {
      setSelectedProposal(proposals[0]);
    }
  }, [proposals]);
  
  if (!proposals || proposals.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Voting Analytics</h2>
        <p className="text-gray-500">No proposals available for visualization</p>
      </div>
    );
  }
  
  // Handler for proposal selection
  const handleSelectProposal = (proposal) => {
    setSelectedProposal(proposal);
  };
  
  // Calculate statistics for the selected proposal
  const calculateStats = () => {
    if (!selectedProposal) return null;
    
    const yesVotes = selectedProposal.yesVotes.toNumber();
    const noVotes = selectedProposal.noVotes.toNumber();
    const totalVotes = yesVotes + noVotes;
    const yesPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
    const noPercentage = totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0;
    
    return {
      yesVotes,
      noVotes,
      totalVotes,
      yesPercentage,
      noPercentage,
      outcome: yesVotes > noVotes ? 'Passed' : (noVotes > yesVotes ? 'Rejected' : 'Tie')
    };
  };
  
  const stats = calculateStats();
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Voting Analytics</h2>
      
      {/* Proposal selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Proposal
        </label>
        <select 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedProposal ? selectedProposal.id : ''}
          onChange={(e) => {
            const proposal = proposals.find(p => p.id.toString() === e.target.value);
            if (proposal) handleSelectProposal(proposal);
          }}
        >
          {proposals.map((proposal) => (
            <option key={proposal.id.toString()} value={proposal.id.toString()}>
              {proposal.title}
            </option>
          ))}
        </select>
      </div>
      
      {/* Visualization */}
      {selectedProposal && stats && (
        <div>
          {/* Donut chart */}
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-48">
              {/* Background circle */}
              <div className="absolute inset-0 rounded-full bg-gray-200"></div>
              
              {/* Yes votes segment */}
              {stats.yesPercentage > 0 && (
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `conic-gradient(transparent ${stats.yesPercentage}%, #EDF2F7 0)`,
                    transform: 'rotate(90deg)',
                    borderRadius: '100%'
                  }}
                ></div>
              )}
              
              {/* No votes segment */}
              {stats.noPercentage > 0 && (
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `conic-gradient(#EF4444 ${stats.noPercentage}%, transparent 0)`,
                    transform: 'rotate(90deg)',
                    borderRadius: '100%'
                  }}
                ></div>
              )}
              
              {/* Yes votes segment (on top) */}
              {stats.yesPercentage > 0 && (
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `conic-gradient(#10B981 ${stats.yesPercentage}%, transparent 0)`,
                    transform: 'rotate(90deg)',
                    borderRadius: '100%'
                  }}
                ></div>
              )}
              
              {/* Inner circle (hole of donut) */}
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white rounded-full flex flex-col items-center justify-center">
                <span className="font-semibold text-lg">{stats.totalVotes}</span>
                <span className="text-xs text-gray-500">Total Votes</span>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 border border-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.yesPercentage.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Yes Votes: {stats.yesVotes}</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 border border-red-100 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.noPercentage.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">No Votes: {stats.noVotes}</div>
            </div>
          </div>
          
          {/* Outcome */}
          {!selectedProposal.isActive && (
            <div className="text-center p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="text-lg font-semibold">
                Outcome: 
                <span className={stats.outcome === 'Passed' ? 'text-green-600' : (stats.outcome === 'Rejected' ? 'text-red-600' : 'text-gray-600')}>
                  {' '}{stats.outcome}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VotingResultsVisualization;
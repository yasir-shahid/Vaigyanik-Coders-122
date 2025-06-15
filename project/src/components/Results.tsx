import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Award } from 'lucide-react';
import { useVoting } from '../context/VotingContext';

const Results: React.FC = () => {
  const { activeElections, getElectionResults } = useVoting();
  const [selectedElection, setSelectedElection] = useState<string>(
    activeElections.length > 0 ? activeElections[0].id : ''
  );

  const currentElection = activeElections.find(e => e.id === selectedElection);
  const results = currentElection ? getElectionResults(currentElection.id) : null;

  if (activeElections.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Elections Available</h2>
        <p className="text-gray-600">There are currently no elections to display results for.</p>
      </div>
    );
  }

  const totalVotes = results?.reduce((sum, candidate) => sum + candidate.votes, 0) || 0;
  const winner = results?.reduce((prev, current) => 
    prev.votes > current.votes ? prev : current
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Election Results</h1>
        <p className="text-gray-600">Real-time voting results powered by blockchain</p>
      </div>

      {/* Election Selector */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Election</h2>
        <select
          value={selectedElection}
          onChange={(e) => setSelectedElection(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          {activeElections.map((election) => (
            <option key={election.id} value={election.id}>
              {election.title}
            </option>
          ))}
        </select>
      </div>

      {currentElection && results && (
        <>
          {/* Election Info */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentElection.title}</h2>
            <p className="text-gray-600 mb-4">{currentElection.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Total Votes</span>
                </div>
                <p className="text-2xl font-bold text-blue-900 mt-1">{totalVotes.toLocaleString()}</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Turnout</span>
                </div>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {((totalVotes / 1000) * 100).toFixed(1)}%
                </p>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Leading</span>
                </div>
                <p className="text-lg font-bold text-orange-900 mt-1">{winner?.name}</p>
              </div>
            </div>
          </div>

          {/* Results Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Vote Distribution</h3>
            <div className="space-y-4">
              {results
                .sort((a, b) => b.votes - a.votes)
                .map((candidate, index) => {
                  const percentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;
                  const isWinner = candidate.id === winner?.id;
                  
                  return (
                    <div key={candidate.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            isWinner ? 'bg-green-600' : 'bg-gray-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{candidate.name}</p>
                            <p className="text-sm text-gray-600">{candidate.party}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">{candidate.votes.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            isWinner ? 'bg-green-600' : 'bg-orange-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Real-time Updates */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Live Updates</span>
            </div>
            <p className="text-gray-600">
              Results are updated in real-time as votes are cast and confirmed on the blockchain. 
              All vote counts are verifiable through the audit trail.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Results;
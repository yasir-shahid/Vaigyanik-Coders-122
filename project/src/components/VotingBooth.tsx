import React, { useState } from 'react';
import { Vote, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useVoting } from '../context/VotingContext';

const VotingBooth: React.FC = () => {
  const { isConnected, account } = useWallet();
  const { activeElections, castVote, hasVoted } = useVoting();
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [selectedElection, setSelectedElection] = useState<string>('');
  const [isVoting, setIsVoting] = useState(false);
  const [voteConfirmed, setVoteConfirmed] = useState(false);

  const handleVote = async () => {
    if (!selectedElection || !selectedCandidate) return;
    
    setIsVoting(true);
    try {
      await castVote(selectedElection, selectedCandidate);
      setVoteConfirmed(true);
      setSelectedCandidate('');
      setSelectedElection('');
    } catch (error) {
      console.error('Voting failed:', error);
    } finally {
      setIsVoting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Wallet Not Connected</h2>
        <p className="text-gray-600 mb-6">Please connect your MetaMask wallet to participate in voting.</p>
      </div>
    );
  }

  if (activeElections.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Active Elections</h2>
        <p className="text-gray-600">There are currently no active elections available for voting.</p>
      </div>
    );
  }

  if (voteConfirmed) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Vote Confirmed!</h2>
        <p className="text-gray-600 mb-6">Your vote has been successfully recorded on the blockchain.</p>
        <button
          onClick={() => setVoteConfirmed(false)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
        >
          Vote in Another Election
        </button>
      </div>
    );
  }

  const currentElection = activeElections.find(e => e.id === selectedElection);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Voting Booth</h1>
        <p className="text-gray-600">Cast your vote securely on the blockchain</p>
      </div>

      {/* Election Selection */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Election</h2>
        <div className="grid gap-4">
          {activeElections.map((election) => {
            const userHasVoted = hasVoted(election.id, account!);
            return (
              <div
                key={election.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedElection === election.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${userHasVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !userHasVoted && setSelectedElection(election.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{election.title}</h3>
                    <p className="text-sm text-gray-600">{election.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Ends: {new Date(election.endTime).toLocaleDateString()}
                    </p>
                  </div>
                  {userHasVoted && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle size={20} />
                      <span className="text-sm font-medium">Already Voted</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Candidate Selection */}
      {currentElection && !hasVoted(currentElection.id, account!) && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Candidate</h2>
          <div className="grid gap-4">
            {currentElection.candidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedCandidate === candidate.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedCandidate(candidate.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-600">
                      {candidate.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{candidate.name}</h3>
                    <p className="text-sm text-gray-600">{candidate.party}</p>
                    <p className="text-xs text-gray-500">{candidate.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vote Confirmation */}
      {selectedElection && selectedCandidate && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Your Vote</h2>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Election:</p>
            <p className="font-semibold text-gray-800 mb-4">{currentElection?.title}</p>
            
            <p className="text-sm text-gray-600 mb-2">Selected Candidate:</p>
            <p className="font-semibold text-gray-800">
              {currentElection?.candidates.find(c => c.id === selectedCandidate)?.name}
            </p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>Important:</strong> Once you cast your vote, it cannot be changed. 
              Your vote will be recorded on the blockchain and is permanent.
            </p>
          </div>

          <button
            onClick={handleVote}
            disabled={isVoting}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg transition-colors duration-200 font-semibold flex items-center justify-center space-x-2"
          >
            {isVoting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Casting Vote...</span>
              </>
            ) : (
              <>
                <Vote size={20} />
                <span>Cast Vote</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default VotingBooth;
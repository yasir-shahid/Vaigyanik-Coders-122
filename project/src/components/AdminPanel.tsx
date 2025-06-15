import React, { useState } from 'react';
import { Settings, Plus, Users, BarChart3, Shield, Calendar } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useVoting } from '../context/VotingContext';

const AdminPanel: React.FC = () => {
  const { isConnected, account } = useWallet();
  const { createElection, activeElections, votingStats } = useVoting();
  const [showCreateElection, setShowCreateElection] = useState(false);
  const [electionForm, setElectionForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    candidates: [{ name: '', party: '', description: '' }]
  });

  // Mock admin check - in real implementation, this would check against smart contract
  const isAdmin = account === '0x1234567890123456789012345678901234567890'; // Mock admin address

  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createElection(electionForm);
      setShowCreateElection(false);
      setElectionForm({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        candidates: [{ name: '', party: '', description: '' }]
      });
    } catch (error) {
      console.error('Failed to create election:', error);
    }
  };

  const addCandidate = () => {
    setElectionForm({
      ...electionForm,
      candidates: [...electionForm.candidates, { name: '', party: '', description: '' }]
    });
  };

  const updateCandidate = (index: number, field: string, value: string) => {
    const updatedCandidates = electionForm.candidates.map((candidate, i) =>
      i === index ? { ...candidate, [field]: value } : candidate
    );
    setElectionForm({ ...electionForm, candidates: updatedCandidates });
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Shield className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600">Please connect your wallet to access the admin panel.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <Shield className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Unauthorized Access</h2>
        <p className="text-gray-600">You do not have administrator privileges to access this panel.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage elections and monitor system performance</p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Elections</p>
              <p className="text-2xl font-bold text-gray-900">{activeElections.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Registered Voters</p>
              <p className="text-2xl font-bold text-gray-900">{votingStats.totalVoters}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Votes</p>
              <p className="text-2xl font-bold text-gray-900">{votingStats.totalVotes}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Status</p>
              <p className="text-lg font-bold text-green-600">Active</p>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowCreateElection(true)}
            className="flex items-center space-x-3 bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg transition-colors duration-200"
          >
            <Plus size={20} />
            <span className="font-medium">Create New Election</span>
          </button>
          
          <button className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors duration-200">
            <Users size={20} />
            <span className="font-medium">Manage Voters</span>
          </button>
          
          <button className="flex items-center space-x-3 bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors duration-200">
            <BarChart3 size={20} />
            <span className="font-medium">View Analytics</span>
          </button>
        </div>
      </div>

      {/* Active Elections Management */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Elections</h2>
        {activeElections.length === 0 ? (
          <p className="text-gray-600">No active elections. Create one to get started.</p>
        ) : (
          <div className="space-y-4">
            {activeElections.map((election) => (
              <div key={election.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{election.title}</h3>
                    <p className="text-sm text-gray-600">{election.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {election.candidates.length} candidates • Ends: {new Date(election.endTime).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                      Edit
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                      End
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Election Modal */}
      {showCreateElection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Election</h2>
            
            <form onSubmit={handleCreateElection} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Election Title *
                </label>
                <input
                  type="text"
                  value={electionForm.title}
                  onChange={(e) => setElectionForm({ ...electionForm, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter election title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={electionForm.description}
                  onChange={(e) => setElectionForm({ ...electionForm, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter election description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={electionForm.startTime}
                    onChange={(e) => setElectionForm({ ...electionForm, startTime: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={electionForm.endTime}
                    onChange={(e) => setElectionForm({ ...electionForm, endTime: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Candidates *
                  </label>
                  <button
                    type="button"
                    onClick={addCandidate}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Add Candidate
                  </button>
                </div>
                
                <div className="space-y-4">
                  {electionForm.candidates.map((candidate, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Candidate Name"
                          value={candidate.name}
                          onChange={(e) => updateCandidate(index, 'name', e.target.value)}
                          required
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <input
                          type="text"
                          placeholder="Party"
                          value={candidate.party}
                          onChange={(e) => updateCandidate(index, 'party', e.target.value)}
                          required
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={candidate.description}
                          onChange={(e) => updateCandidate(index, 'description', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium"
                >
                  Create Election
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateElection(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
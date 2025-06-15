import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Candidate {
  id: string;
  name: string;
  party: string;
  description: string;
}

interface Election {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  candidates: Candidate[];
}

interface VotingStats {
  totalVoters: number;
  totalVotes: number;
  turnoutRate: number;
}

interface AuditEntry {
  transactionHash: string;
  type: 'vote' | 'registration' | 'election';
  voterAddress: string;
  timestamp: string;
  gasUsed: number;
}

interface VotingContextType {
  activeElections: Election[];
  votingStats: VotingStats;
  auditTrail: AuditEntry[];
  registerVoter: (data: any) => Promise<void>;
  castVote: (electionId: string, candidateId: string) => Promise<void>;
  createElection: (data: any) => Promise<void>;
  isRegistered: (address: string) => boolean;
  hasVoted: (electionId: string, address: string) => boolean;
  getElectionResults: (electionId: string) => Array<{ id: string; name: string; party: string; votes: number }>;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

export const useVoting = () => {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
};

interface VotingProviderProps {
  children: ReactNode;
}

export const VotingProvider: React.FC<VotingProviderProps> = ({ children }) => {
  const [registeredVoters] = useState<Set<string>>(new Set());
  const [votes] = useState<Map<string, Map<string, string>>>(new Map());
  const [activeElections, setActiveElections] = useState<Election[]>([
    {
      id: '1',
      title: 'General Election 2024',
      description: 'National parliamentary elections for the Lok Sabha',
      startTime: '2024-01-01T00:00:00',
      endTime: '2024-12-31T23:59:59',
      candidates: [
        {
          id: 'c1',
          name: 'Rajesh Kumar',
          party: 'Bharatiya Janata Party',
          description: 'Experienced leader with focus on development'
        },
        {
          id: 'c2',
          name: 'Priya Sharma',
          party: 'Indian National Congress',
          description: 'Young leader advocating for social justice'
        },
        {
          id: 'c3',
          name: 'Amit Singh',
          party: 'Aam Aadmi Party',
          description: 'Anti-corruption activist and reformer'
        }
      ]
    }
  ]);

  const [votingStats] = useState<VotingStats>({
    totalVoters: 1247,
    totalVotes: 892,
    turnoutRate: 71.5
  });

  const [auditTrail] = useState<AuditEntry[]>([
    {
      transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
      type: 'vote',
      voterAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      timestamp: '2024-01-15T10:30:00Z',
      gasUsed: 45000
    },
    {
      transactionHash: '0x2345678901bcdef12345678901bcdef123456789',
      type: 'registration',
      voterAddress: '0xbcdef1234567890abcdef1234567890abcdef123',
      timestamp: '2024-01-14T15:45:00Z',
      gasUsed: 65000
    },
    {
      transactionHash: '0x3456789012cdef123456789012cdef1234567890',
      type: 'vote',
      voterAddress: '0xcdef1234567890abcdef1234567890abcdef1234',
      timestamp: '2024-01-15T11:20:00Z',
      gasUsed: 47000
    }
  ]);

  const registerVoter = async (data: any): Promise<void> => {
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real implementation, this would interact with smart contract
    console.log('Registering voter:', data);
  };

  const castVote = async (electionId: string, candidateId: string): Promise<void> => {
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In real implementation, this would interact with smart contract
    console.log('Casting vote:', { electionId, candidateId });
  };

  const createElection = async (data: any): Promise<void> => {
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newElection: Election = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      candidates: data.candidates.map((candidate: any, index: number) => ({
        id: `c${Date.now()}_${index}`,
        name: candidate.name,
        party: candidate.party,
        description: candidate.description
      }))
    };
    
    setActiveElections(prev => [...prev, newElection]);
  };

  const isRegistered = (address: string): boolean => {
    return registeredVoters.has(address);
  };

  const hasVoted = (electionId: string, address: string): boolean => {
    return votes.get(electionId)?.has(address) || false;
  };

  const getElectionResults = (electionId: string) => {
    const election = activeElections.find(e => e.id === electionId);
    if (!election) return [];

    // Mock results - in real implementation, this would query the blockchain
    return election.candidates.map(candidate => ({
      id: candidate.id,
      name: candidate.name,
      party: candidate.party,
      votes: Math.floor(Math.random() * 300) + 50
    }));
  };

  return (
    <VotingContext.Provider
      value={{
        activeElections,
        votingStats,
        auditTrail,
        registerVoter,
        castVote,
        createElection,
        isRegistered,
        hasVoted,
        getElectionResults,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};
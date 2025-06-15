// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title DVoting
 * @dev Decentralized Voting System Smart Contract
 * @author DVote Team
 */
contract DVoting is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _electionIds;
    Counters.Counter private _voterIds;
    
    struct Voter {
        uint256 id;
        address voterAddress;
        string name;
        string email;
        string phone;
        string physicalAddress;
        string idNumber;
        bool isRegistered;
        uint256 registrationTime;
    }
    
    struct Candidate {
        uint256 id;
        string name;
        string party;
        string description;
        uint256 voteCount;
    }
    
    struct Election {
        uint256 id;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        uint256 totalVotes;
        mapping(uint256 => Candidate) candidates;
        uint256 candidateCount;
        mapping(address => bool) hasVoted;
    }
    
    // Mappings
    mapping(address => Voter) public voters;
    mapping(uint256 => Election) public elections;
    mapping(address => bool) public registeredVoters;
    mapping(uint256 => mapping(address => uint256)) public votes; // electionId => voter => candidateId
    
    // Events
    event VoterRegistered(address indexed voter, uint256 voterId, string name);
    event ElectionCreated(uint256 indexed electionId, string title, uint256 startTime, uint256 endTime);
    event VoteCast(uint256 indexed electionId, address indexed voter, uint256 candidateId);
    event ElectionEnded(uint256 indexed electionId, uint256 totalVotes);
    
    // Modifiers
    modifier onlyRegisteredVoter() {
        require(registeredVoters[msg.sender], "Voter not registered");
        _;
    }
    
    modifier validElection(uint256 _electionId) {
        require(_electionId <= _electionIds.current(), "Invalid election ID");
        require(elections[_electionId].isActive, "Election is not active");
        _;
    }
    
    modifier electionActive(uint256 _electionId) {
        Election storage election = elections[_electionId];
        require(block.timestamp >= election.startTime, "Election has not started");
        require(block.timestamp <= election.endTime, "Election has ended");
        _;
    }
    
    modifier hasNotVoted(uint256 _electionId) {
        require(!elections[_electionId].hasVoted[msg.sender], "Already voted in this election");
        _;
    }
    
    /**
     * @dev Register a new voter
     */
    function registerVoter(
        string memory _name,
        string memory _email,
        string memory _phone,
        string memory _physicalAddress,
        string memory _idNumber
    ) external {
        require(!registeredVoters[msg.sender], "Voter already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(bytes(_idNumber).length > 0, "ID number cannot be empty");
        
        _voterIds.increment();
        uint256 voterId = _voterIds.current();
        
        voters[msg.sender] = Voter({
            id: voterId,
            voterAddress: msg.sender,
            name: _name,
            email: _email,
            phone: _phone,
            physicalAddress: _physicalAddress,
            idNumber: _idNumber,
            isRegistered: true,
            registrationTime: block.timestamp
        });
        
        registeredVoters[msg.sender] = true;
        
        emit VoterRegistered(msg.sender, voterId, _name);
    }
    
    /**
     * @dev Create a new election (only owner)
     */
    function createElection(
        string memory _title,
        string memory _description,
        uint256 _startTime,
        uint256 _endTime,
        string[] memory _candidateNames,
        string[] memory _candidateParties,
        string[] memory _candidateDescriptions
    ) external onlyOwner {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_startTime > block.timestamp, "Start time must be in the future");
        require(_endTime > _startTime, "End time must be after start time");
        require(_candidateNames.length > 1, "Must have at least 2 candidates");
        require(
            _candidateNames.length == _candidateParties.length &&
            _candidateNames.length == _candidateDescriptions.length,
            "Candidate arrays length mismatch"
        );
        
        _electionIds.increment();
        uint256 electionId = _electionIds.current();
        
        Election storage newElection = elections[electionId];
        newElection.id = electionId;
        newElection.title = _title;
        newElection.description = _description;
        newElection.startTime = _startTime;
        newElection.endTime = _endTime;
        newElection.isActive = true;
        newElection.totalVotes = 0;
        newElection.candidateCount = _candidateNames.length;
        
        // Add candidates
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            newElection.candidates[i + 1] = Candidate({
                id: i + 1,
                name: _candidateNames[i],
                party: _candidateParties[i],
                description: _candidateDescriptions[i],
                voteCount: 0
            });
        }
        
        emit ElectionCreated(electionId, _title, _startTime, _endTime);
    }
    
    /**
     * @dev Cast a vote in an election
     */
    function castVote(uint256 _electionId, uint256 _candidateId) 
        external 
        onlyRegisteredVoter 
        validElection(_electionId) 
        electionActive(_electionId) 
        hasNotVoted(_electionId)
        nonReentrant 
    {
        Election storage election = elections[_electionId];
        require(_candidateId > 0 && _candidateId <= election.candidateCount, "Invalid candidate ID");
        
        // Record the vote
        election.hasVoted[msg.sender] = true;
        election.candidates[_candidateId].voteCount++;
        election.totalVotes++;
        votes[_electionId][msg.sender] = _candidateId;
        
        emit VoteCast(_electionId, msg.sender, _candidateId);
    }
    
    /**
     * @dev End an election (only owner)
     */
    function endElection(uint256 _electionId) external onlyOwner validElection(_electionId) {
        Election storage election = elections[_electionId];
        election.isActive = false;
        
        emit ElectionEnded(_electionId, election.totalVotes);
    }
    
    /**
     * @dev Get election results
     */
    function getElectionResults(uint256 _electionId) 
        external 
        view 
        returns (
            string memory title,
            uint256 totalVotes,
            uint256[] memory candidateIds,
            string[] memory candidateNames,
            string[] memory candidateParties,
            uint256[] memory voteCounts
        ) 
    {
        require(_electionId <= _electionIds.current(), "Invalid election ID");
        
        Election storage election = elections[_electionId];
        uint256 candidateCount = election.candidateCount;
        
        candidateIds = new uint256[](candidateCount);
        candidateNames = new string[](candidateCount);
        candidateParties = new string[](candidateCount);
        voteCounts = new uint256[](candidateCount);
        
        for (uint256 i = 1; i <= candidateCount; i++) {
            Candidate storage candidate = election.candidates[i];
            candidateIds[i - 1] = candidate.id;
            candidateNames[i - 1] = candidate.name;
            candidateParties[i - 1] = candidate.party;
            voteCounts[i - 1] = candidate.voteCount;
        }
        
        return (
            election.title,
            election.totalVotes,
            candidateIds,
            candidateNames,
            candidateParties,
            voteCounts
        );
    }
    
    /**
     * @dev Get voter information
     */
    function getVoterInfo(address _voterAddress) 
        external 
        view 
        returns (
            uint256 id,
            string memory name,
            string memory email,
            bool isRegistered,
            uint256 registrationTime
        ) 
    {
        Voter storage voter = voters[_voterAddress];
        return (
            voter.id,
            voter.name,
            voter.email,
            voter.isRegistered,
            voter.registrationTime
        );
    }
    
    /**
     * @dev Check if voter has voted in an election
     */
    function hasVotedInElection(uint256 _electionId, address _voter) 
        external 
        view 
        returns (bool) 
    {
        return elections[_electionId].hasVoted[_voter];
    }
    
    /**
     * @dev Get total number of elections
     */
    function getTotalElections() external view returns (uint256) {
        return _electionIds.current();
    }
    
    /**
     * @dev Get total number of registered voters
     */
    function getTotalVoters() external view returns (uint256) {
        return _voterIds.current();
    }
    
    /**
     * @dev Get election basic info
     */
    function getElectionInfo(uint256 _electionId) 
        external 
        view 
        returns (
            string memory title,
            string memory description,
            uint256 startTime,
            uint256 endTime,
            bool isActive,
            uint256 totalVotes,
            uint256 candidateCount
        ) 
    {
        require(_electionId <= _electionIds.current(), "Invalid election ID");
        
        Election storage election = elections[_electionId];
        return (
            election.title,
            election.description,
            election.startTime,
            election.endTime,
            election.isActive,
            election.totalVotes,
            election.candidateCount
        );
    }
}
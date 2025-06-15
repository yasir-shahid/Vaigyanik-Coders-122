# DVote - Decentralized Voting System with AI Chatbot

A secure, transparent, and tamper-proof voting platform built on blockchain technology, specifically designed for the Government of India's digital voting initiatives. Now featuring a multilingual AI chatbot powered by Ollama and DeepSeek-R1.

## 🚀 Features

### Core Functionality
- **Secure Voter Registration**: Blockchain-based voter registration with Aadhaar integration
- **One Person, One Vote**: MetaMask wallet integration ensures unique voting
- **Real-time Results**: Live vote counting and transparent result display
- **Complete Audit Trail**: Full transaction history on Polygon blockchain
- **Admin Panel**: Election management and system monitoring

### AI Chatbot Features
- **Multilingual Support**: Hindi (हिंदी), Tamil (தமிழ்), Telugu (తెలుగు), English, Marathi (मराठी)
- **Voice Support**: Text-to-speech in native languages
- **Voting Assistance**: Help with registration, voting process, and troubleshooting
- **Blockchain Guidance**: Explain complex blockchain concepts in simple terms
- **Context-Aware**: Understands DVote-specific queries and provides relevant help

### Advanced Features
- **Zero-Knowledge Proofs**: Anonymous voting while maintaining verifiability
- **Role-based Access**: Admin, voter, and auditor role management
- **Multi-election Support**: Simultaneous elections with different parameters
- **Gas Optimization**: Efficient smart contract design for minimal transaction costs

## 🛠 Tech Stack

### Frontend
- **React.js 18** with TypeScript
- **Tailwind CSS** for responsive design
- **Lucide React** for icons
- **React Router** for navigation

### Blockchain
- **Solidity 0.8.19** for smart contracts
- **Polygon Mumbai Testnet** for deployment
- **Hardhat** for development and testing
- **OpenZeppelin** for security standards

### AI Chatbot
- **Ollama** for local AI model hosting
- **DeepSeek-R1** for multilingual language model
- **Web Speech API** for text-to-speech
- **Axios** for API communication

### Integration
- **MetaMask** for wallet connection
- **Ethers.js** for blockchain interaction
- **Web3.js** for additional blockchain utilities

## 📁 Project Structure

```
dvote/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── Dashboard.tsx
│   │   ├── VotingBooth.tsx
│   │   ├── Results.tsx
│   │   ├── AuditTrail.tsx
│   │   ├── VoterRegistration.tsx
│   │   ├── AdminPanel.tsx
│   │   ├── WalletConnection.tsx
│   │   ├── ChatBot.tsx      # AI Chatbot component
│   │   └── OllamaSetup.tsx  # Setup instructions
│   ├── context/             # React context providers
│   │   ├── WalletContext.tsx
│   │   ├── VotingContext.tsx
│   │   └── ChatBotContext.tsx
│   └── App.tsx
├── contracts/               # Smart contracts
│   └── DVoting.sol
├── scripts/                 # Deployment scripts
│   └── deploy.js
├── hardhat.config.js        # Hardhat configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MetaMask browser extension
- Polygon Mumbai testnet MATIC tokens
- **Ollama** installed locally
- **DeepSeek-R1** model downloaded

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd dvote
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **AI Chatbot Setup**
```bash
# Install Ollama (visit https://ollama.ai for installation)
curl -fsSL https://ollama.ai/install.sh | sh

# Install DeepSeek-R1 model
ollama run deepseek-r1
```

4. **Smart Contract Deployment**
```bash
# Compile contracts
npx hardhat compile

# Deploy to Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai
```

5. **Start Development Server**
```bash
npm run dev
```

## 🤖 AI Chatbot Setup

### Step 1: Install Ollama
Visit [https://ollama.ai](https://ollama.ai) and download Ollama for your operating system, or install via command line:

```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Step 2: Install DeepSeek-R1 Model
```bash
ollama run deepseek-r1
```

This will download the DeepSeek-R1 model (approximately 8GB) and start the Ollama service.

### Step 3: Verify Installation
Test the API connection:
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "deepseek-r1",
  "prompt": "Hello, how are you?",
  "stream": false
}'
```

### Supported Languages
- **English** - Full support with technical explanations
- **Hindi (हिंदी)** - Native script support with cultural context
- **Tamil (தமிழ்)** - Tamil script with regional understanding
- **Telugu (తెలుగు)** - Telugu script with local context
- **Marathi (मराठी)** - Devanagari script with Maharashtra context

## 🔧 Smart Contract Deployment

### Mumbai Testnet Deployment
```bash
# Install dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Compile contracts
npx hardhat compile

# Deploy to Mumbai
npx hardhat run scripts/deploy.js --network mumbai

# Verify contract (optional)
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
```

### Contract Features
- **Voter Registration**: Secure on-chain voter registration
- **Election Management**: Create and manage multiple elections
- **Vote Casting**: Secure and anonymous vote recording
- **Result Calculation**: Transparent vote counting
- **Access Control**: Role-based permissions

## 🎨 Design System

### Government of India Theme
- **Colors**: Saffron (#FF9933), White (#FFFFFF), Green (#138808)
- **Typography**: Clean, accessible fonts with proper hierarchy
- **Icons**: Lucide React icons for consistency
- **Layout**: Responsive design with mobile-first approach

### Key Design Elements
- Indian flag representation in header
- Government emblem integration
- Clean, professional interface
- Accessibility compliance (WCAG 2.1)
- Multilingual UI support

## 🔐 Security Features

### Blockchain Security
- **Smart Contract Auditing**: OpenZeppelin security standards
- **Reentrancy Protection**: Built-in security measures
- **Access Control**: Role-based permissions
- **Gas Optimization**: Efficient contract design

### Frontend Security
- **Wallet Integration**: Secure MetaMask connection
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Graceful error management
- **HTTPS Enforcement**: Secure communication

### AI Security
- **Local Processing**: Ollama runs locally, no data sent to external servers
- **Privacy Protection**: User conversations are not stored permanently
- **Input Sanitization**: All user inputs are sanitized before processing

## 📊 Usage Guide

### For Voters
1. **Connect Wallet**: Install MetaMask and connect to Mumbai testnet
2. **Register**: Complete voter registration with required details
3. **Vote**: Select election and cast your vote securely
4. **Get Help**: Use the AI chatbot for assistance in your preferred language
5. **Verify**: Check your vote in the audit trail

### For Administrators
1. **Access Admin Panel**: Connect with admin wallet
2. **Create Elections**: Set up new elections with candidates
3. **Monitor**: Track voting progress and system health
4. **Manage**: End elections and publish results

### Using the AI Chatbot
1. **Click the chat icon** in the bottom-right corner
2. **Select your language** from the dropdown menu
3. **Ask questions** about voting, registration, or blockchain
4. **Use voice features** to hear responses in your language
5. **Get contextual help** specific to DVote platform

## 🌐 Deployment

### Production Deployment
```bash
# Build for production
npm run build

# Deploy to hosting platform
# (Netlify, Vercel, or custom server)
```

### Smart Contract Mainnet
```bash
# Deploy to Polygon mainnet
npx hardhat run scripts/deploy.js --network polygon
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Government of India for digital voting initiatives
- Polygon team for blockchain infrastructure
- OpenZeppelin for security standards
- Ollama team for local AI hosting
- DeepSeek for the multilingual language model
- React and Ethereum communities

## 📞 Support

For support and questions:
- Email: support@dvote.gov.in
- Documentation: [docs.dvote.gov.in](https://docs.dvote.gov.in)
- GitHub Issues: [Create an issue](https://github.com/dvote/issues)
- AI Chatbot: Use the built-in multilingual assistant

## 🔧 Troubleshooting

### Common Issues

**Ollama Connection Failed**
- Ensure Ollama is running: `ollama serve`
- Check if DeepSeek-R1 is installed: `ollama list`
- Verify port 11434 is not blocked

**Language Not Working**
- Check browser language support
- Ensure proper font rendering for Devanagari/Tamil/Telugu scripts
- Try refreshing the page after language change

**MetaMask Issues**
- Switch to Polygon Mumbai testnet
- Ensure sufficient MATIC balance
- Clear browser cache if connection fails

---

**DVote** - Empowering Democracy Through Blockchain Technology and AI 🇮🇳
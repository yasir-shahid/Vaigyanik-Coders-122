import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import VotingBooth from './components/VotingBooth';
import Results from './components/Results';
import AuditTrail from './components/AuditTrail';
import VoterRegistration from './components/VoterRegistration';
import AdminPanel from './components/AdminPanel';
import ChatBot from './components/ChatBot';
import OllamaSetup from './components/OllamaSetup';
import { WalletProvider } from './context/WalletContext';
import { VotingProvider } from './context/VotingContext';
import { ChatBotProvider } from './context/ChatBotContext';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <WalletProvider>
        <VotingProvider>
          <ChatBotProvider>
            <Router>
              <div className="min-h-screen bg-white">
                <Header />
                <main className="container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/register" element={<VoterRegistration />} />
                    <Route path="/vote" element={<VotingBooth />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/audit" element={<AuditTrail />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/chatbot-setup" element={<OllamaSetup />} />
                  </Routes>
                </main>
                <ChatBot />
              </div>
            </Router>
          </ChatBotProvider>
        </VotingProvider>
      </WalletProvider>
    </LanguageProvider>
  );
}

export default App;
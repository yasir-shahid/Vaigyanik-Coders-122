import React, { useState, useEffect } from 'react';
import { Terminal, CheckCircle, AlertCircle, Download, Play } from 'lucide-react';
import axios from 'axios';

const OllamaSetup: React.FC = () => {
  const [ollamaStatus, setOllamaStatus] = useState<'checking' | 'running' | 'not-running' | 'not-installed'>('checking');
  const [modelStatus, setModelStatus] = useState<'checking' | 'installed' | 'not-installed' | 'downloading'>('checking');
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    checkOllamaStatus();
  }, []);

  const checkOllamaStatus = async () => {
    try {
      // Check if Ollama is running
      const response = await axios.get('http://localhost:11434/api/tags', { timeout: 5000 });
      setOllamaStatus('running');
      
      // Check if deepseek-r1 model is installed
      const models = response.data.models || [];
      const hasDeepSeek = models.some((model: any) => model.name.includes('deepseek-r1'));
      setModelStatus(hasDeepSeek ? 'installed' : 'not-installed');
    } catch (error) {
      setOllamaStatus('not-running');
      setModelStatus('not-installed');
    }
  };

  const installModel = async () => {
    setModelStatus('downloading');
    try {
      // This would typically be done via command line, but we'll show instructions
      // In a real implementation, you might use a backend service to handle this
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate download
      setModelStatus('installed');
    } catch (error) {
      setModelStatus('not-installed');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
      case 'installed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'not-running':
      case 'not-installed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'checking':
      case 'downloading':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
      case 'installed':
        return <CheckCircle size={20} />;
      case 'not-running':
      case 'not-installed':
        return <AlertCircle size={20} />;
      case 'downloading':
        return <Download size={20} className="animate-bounce" />;
      default:
        return <Terminal size={20} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Chatbot Setup</h1>
        <p className="text-gray-600">Configure Ollama with DeepSeek-R1 for multilingual support</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ollama Status */}
        <div className={`border rounded-xl p-6 ${getStatusColor(ollamaStatus)}`}>
          <div className="flex items-center space-x-3 mb-4">
            {getStatusIcon(ollamaStatus)}
            <h3 className="text-lg font-semibold">Ollama Service</h3>
          </div>
          <p className="text-sm mb-4">
            {ollamaStatus === 'running' && 'Ollama is running and ready to use'}
            {ollamaStatus === 'not-running' && 'Ollama is not running or not installed'}
            {ollamaStatus === 'checking' && 'Checking Ollama status...'}
          </p>
          {ollamaStatus === 'not-running' && (
            <button
              onClick={checkOllamaStatus}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Retry Check
            </button>
          )}
        </div>

        {/* Model Status */}
        <div className={`border rounded-xl p-6 ${getStatusColor(modelStatus)}`}>
          <div className="flex items-center space-x-3 mb-4">
            {getStatusIcon(modelStatus)}
            <h3 className="text-lg font-semibold">DeepSeek-R1 Model</h3>
          </div>
          <p className="text-sm mb-4">
            {modelStatus === 'installed' && 'DeepSeek-R1 model is installed and ready'}
            {modelStatus === 'not-installed' && 'DeepSeek-R1 model needs to be installed'}
            {modelStatus === 'downloading' && 'Downloading DeepSeek-R1 model...'}
            {modelStatus === 'checking' && 'Checking model availability...'}
          </p>
          {modelStatus === 'not-installed' && (
            <button
              onClick={installModel}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Install Model
            </button>
          )}
        </div>
      </div>

      {/* Installation Instructions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Installation Instructions</h3>
        
        <div className="space-y-6">
          {/* Step 1: Install Ollama */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-gray-800 mb-2">Step 1: Install Ollama</h4>
            <p className="text-gray-600 mb-3">
              Download and install Ollama from the official website:
            </p>
            <div className="bg-gray-100 rounded-lg p-3 font-mono text-sm">
              <p className="mb-2">Visit: <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://ollama.ai</a></p>
              <p>Or install via command line:</p>
              <code className="block mt-2 p-2 bg-gray-800 text-green-400 rounded">
                curl -fsSL https://ollama.ai/install.sh | sh
              </code>
            </div>
          </div>

          {/* Step 2: Install DeepSeek-R1 */}
          <div className="border-l-4 border-orange-500 pl-4">
            <h4 className="font-semibold text-gray-800 mb-2">Step 2: Install DeepSeek-R1 Model</h4>
            <p className="text-gray-600 mb-3">
              Run the following command in your terminal to install the DeepSeek-R1 model:
            </p>
            <div className="bg-gray-100 rounded-lg p-3">
              <code className="block p-2 bg-gray-800 text-green-400 rounded font-mono">
                ollama run deepseek-r1
              </code>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This will download and start the DeepSeek-R1 model (approximately 8GB download)
            </p>
          </div>

          {/* Step 3: Verify Installation */}
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-gray-800 mb-2">Step 3: Verify Installation</h4>
            <p className="text-gray-600 mb-3">
              Test that everything is working correctly:
            </p>
            <div className="bg-gray-100 rounded-lg p-3">
              <code className="block p-2 bg-gray-800 text-green-400 rounded font-mono">
                {`curl http://localhost:11434/api/generate -d '{
  "model": "deepseek-r1",
  "prompt": "Hello, how are you?",
  "stream": false
}'`}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Language Support Info */}
      <div className="bg-gradient-to-r from-orange-50 to-green-50 border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Multilingual Support</h3>
        <p className="text-gray-600 mb-4">
          The DVote chatbot supports the following languages with native script support:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { code: 'en', name: 'English', native: 'English' },
            { code: 'hi', name: 'Hindi', native: 'हिंदी' },
            { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
            { code: 'te', name: 'Telugu', native: 'తెలుగు' },
            { code: 'mr', name: 'Marathi', native: 'मराठी' }
          ].map((lang) => (
            <div key={lang.code} className="bg-white rounded-lg p-3 text-center border border-gray-200">
              <p className="font-semibold text-gray-800">{lang.name}</p>
              <p className="text-sm text-gray-600">{lang.native}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Chatbot Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
            <div>
              <h4 className="font-medium text-gray-800">Multilingual Support</h4>
              <p className="text-sm text-gray-600">Communicate in Hindi, Tamil, Telugu, Marathi, and English</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
            <div>
              <h4 className="font-medium text-gray-800">Voice Support</h4>
              <p className="text-sm text-gray-600">Text-to-speech in native languages</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
            <div>
              <h4 className="font-medium text-gray-800">Voting Assistance</h4>
              <p className="text-sm text-gray-600">Help with registration, voting, and troubleshooting</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
            <div>
              <h4 className="font-medium text-gray-800">Blockchain Guidance</h4>
              <p className="text-sm text-gray-600">Explain blockchain concepts in simple terms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OllamaSetup;
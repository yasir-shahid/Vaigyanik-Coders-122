import React, { useState } from 'react';
import { UserPlus, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useVoting } from '../context/VotingContext';

const VoterRegistration: React.FC = () => {
  const { isConnected, account } = useWallet();
  const { registerVoter, isRegistered } = useVoting();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    idNumber: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !account) return;

    setIsRegistering(true);
    try {
      await registerVoter(formData);
      setRegistrationComplete(true);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== '');
  const userIsRegistered = isConnected && account && isRegistered(account);

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Wallet Not Connected</h2>
        <p className="text-gray-600 mb-6">Please connect your MetaMask wallet to register as a voter.</p>
      </div>
    );
  }

  if (userIsRegistered) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Already Registered</h2>
        <p className="text-gray-600 mb-6">You are already registered as a voter with this wallet address.</p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-green-800 font-medium">Wallet: {account?.slice(0, 6)}...{account?.slice(-4)}</p>
        </div>
      </div>
    );
  }

  if (registrationComplete) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
        <p className="text-gray-600 mb-6">You have been successfully registered as a voter on the blockchain.</p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto mb-6">
          <p className="text-green-800 font-medium">Your voter registration is now active</p>
        </div>
        <button
          onClick={() => window.location.href = '/vote'}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
        >
          Go to Voting Booth
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Voter Registration</h1>
        <p className="text-gray-600">Register to participate in decentralized voting</p>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Shield className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Secure Registration</h3>
            <p className="text-blue-700 text-sm">
              Your registration will be recorded on the blockchain and linked to your wallet address. 
              This ensures one person, one vote while maintaining privacy and security.
            </p>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Aadhaar Number *
              </label>
              <input
                type="text"
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter your Aadhaar number"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter your complete address"
            />
          </div>

          {/* Wallet Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Connected Wallet</h4>
            <p className="text-sm text-gray-600 mb-1">Your registration will be linked to:</p>
            <code className="text-sm bg-white px-2 py-1 rounded border">
              {account}
            </code>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              By registering, you agree that your information will be stored on the blockchain 
              for voting verification purposes. This registration is permanent and cannot be modified.
            </p>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isRegistering}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg transition-colors duration-200 font-semibold flex items-center justify-center space-x-2"
          >
            {isRegistering ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Registering...</span>
              </>
            ) : (
              <>
                <UserPlus size={20} />
                <span>Register as Voter</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VoterRegistration;
import React from 'react';
import { Wallet, AlertCircle } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useLanguage } from '../context/LanguageContext';

const WalletConnection: React.FC = () => {
  const { isConnected, account, connectWallet, disconnectWallet, error } = useWallet();
  const { t } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          <Wallet size={18} />
          <span>{t('header.connectWallet')}</span>
        </button>
      ) : (
        <button
          onClick={disconnectWallet}
          className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          <Wallet size={18} />
          <span>{t('header.disconnect')}</span>
        </button>
      )}
      
      {error && (
        <div className="flex items-center space-x-1 text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;
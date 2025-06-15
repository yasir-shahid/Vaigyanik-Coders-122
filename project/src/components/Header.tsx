import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Vote, Shield, BarChart3, FileText, Settings, UserPlus, Bot } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useLanguage } from '../context/LanguageContext';
import WalletConnection from './WalletConnection';
import LanguageSelector from './LanguageSelector';

const Header: React.FC = () => {
  const location = useLocation();
  const { isConnected, account } = useWallet();
  const { t } = useLanguage();

  const navItems = [
    { path: '/', label: t('header.dashboard'), icon: BarChart3 },
    { path: '/register', label: t('header.register'), icon: UserPlus },
    { path: '/vote', label: t('header.vote'), icon: Vote },
    { path: '/results', label: t('header.results'), icon: BarChart3 },
    { path: '/audit', label: t('header.audit'), icon: FileText },
    { path: '/admin', label: t('header.admin'), icon: Settings },
    { path: '/chatbot-setup', label: t('header.aiSetup'), icon: Bot },
  ];

  return (
    <header className="bg-white border-b-4 border-orange-500 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Left side - Indian Flag and Logo */}
          <div className="flex items-center space-x-4">
            {/* Indian Flag */}
            <div className="flex flex-col w-8 h-12 border border-gray-300 rounded-sm overflow-hidden">
              <div className="h-1/3 bg-orange-500"></div>
              <div className="h-1/3 bg-white flex items-center justify-center">
                <div className="w-3 h-3 border border-blue-800 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 border border-blue-800 rounded-full"></div>
                </div>
              </div>
              <div className="h-1/3 bg-green-600"></div>
            </div>
            
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <img 
                src="/favpng_f4c9416bdc11c8d4578ef9d3ded13a13.png" 
                alt="Government of India Emblem" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{t('header.title')}</h1>
                <p className="text-sm text-gray-600">{t('header.subtitle')}</p>
              </div>
            </div>
          </div>

          {/* Center - Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-orange-100 text-orange-700 border border-orange-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side - Language Selector and Wallet Connection */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <WalletConnection />
            {isConnected && (
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                <Shield size={16} className="text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
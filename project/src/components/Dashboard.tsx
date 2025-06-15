import React from 'react';
import { Link } from 'react-router-dom';
import { Vote, Users, BarChart3, Shield, Clock, CheckCircle } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useVoting } from '../context/VotingContext';
import { useLanguage } from '../context/LanguageContext';

const Dashboard: React.FC = () => {
  const { isConnected } = useWallet();
  const { votingStats, activeElections } = useVoting();
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: t('dashboard.secureTransparent'),
      description: t('dashboard.secureDescription'),
      color: 'text-green-600 bg-green-50 border-green-200'
    },
    {
      icon: Vote,
      title: t('dashboard.onePersonOneVote'),
      description: t('dashboard.onePersonDescription'),
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      icon: BarChart3,
      title: t('dashboard.realTimeResults'),
      description: t('dashboard.realTimeDescription'),
      color: 'text-orange-600 bg-orange-50 border-orange-200'
    },
    {
      icon: Clock,
      title: t('dashboard.auditTrailFeature'),
      description: t('dashboard.auditDescription'),
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    }
  ];

  const quickActions = [
    { to: '/register', label: t('dashboard.registerToVote'), icon: Users, color: 'bg-blue-600 hover:bg-blue-700' },
    { to: '/vote', label: t('dashboard.castVote'), icon: Vote, color: 'bg-orange-600 hover:bg-orange-700' },
    { to: '/results', label: t('dashboard.viewResults'), icon: BarChart3, color: 'bg-green-600 hover:bg-green-700' },
    { to: '/audit', label: t('dashboard.auditTrail'), icon: CheckCircle, color: 'bg-purple-600 hover:bg-purple-700' }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-orange-50 to-green-50 rounded-2xl border border-gray-200">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {t('dashboard.welcome')}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          {t('dashboard.description')}
        </p>
        
        {!isConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-yellow-800 font-medium">
              {t('dashboard.connectWallet')}
            </p>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('dashboard.totalVoters')}</p>
              <p className="text-2xl font-bold text-gray-900">{votingStats.totalVoters.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('dashboard.votesCast')}</p>
              <p className="text-2xl font-bold text-gray-900">{votingStats.totalVotes.toLocaleString()}</p>
            </div>
            <Vote className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('dashboard.activeElections')}</p>
              <p className="text-2xl font-bold text-gray-900">{activeElections.length}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('dashboard.turnoutRate')}</p>
              <p className="text-2xl font-bold text-gray-900">{votingStats.turnoutRate}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.to}
              to={action.to}
              className={`${action.color} text-white p-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg`}
            >
              <div className="flex items-center space-x-3">
                <Icon size={24} />
                <span className="font-semibold">{action.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className={`inline-flex p-3 rounded-lg border ${feature.color} mb-4`}>
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Active Elections */}
      {activeElections.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('dashboard.activeElections')}</h2>
          <div className="space-y-4">
            {activeElections.map((election) => (
              <div key={election.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{election.title}</h3>
                    <p className="text-sm text-gray-600">{election.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Ends: {new Date(election.endTime).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    to="/vote"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                  >
                    {t('dashboard.voteNow')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import { Search, Filter, TrendingUp } from 'lucide-react';
import MatchCard from '../components/MatchCard';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  status: 'upcoming' | 'live' | 'finished';
  odds: {
    home: number;
    draw?: number;
    away: number;
  };
  isPopular?: boolean;
}

const mockMatches: Match[] = [
  {
    id: '1',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    league: 'Premier League',
    time: '18:30',
    status: 'upcoming',
    odds: { home: 2.45, draw: 3.20, away: 2.90 },
    isPopular: true
  },
  {
    id: '2',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    league: 'La Liga',
    time: 'LIVE 67\'',
    status: 'live',
    odds: { home: 1.85, draw: 3.50, away: 4.20 },
    isPopular: true
  },
  {
    id: '3',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    league: 'Bundesliga',
    time: '20:00',
    status: 'upcoming',
    odds: { home: 1.70, draw: 3.80, away: 4.50 }
  },
  {
    id: '4',
    homeTeam: 'Chelsea',
    awayTeam: 'Arsenal',
    league: 'Premier League',
    time: '16:30',
    status: 'upcoming',
    odds: { home: 2.10, draw: 3.30, away: 3.40 }
  },
  {
    id: '5',
    homeTeam: 'PSG',
    awayTeam: 'Marseille',
    league: 'Ligue 1',
    time: 'LIVE 23\'',
    status: 'live',
    odds: { home: 1.55, draw: 4.20, away: 5.80 }
  },
  {
    id: '6',
    homeTeam: 'Juventus',
    awayTeam: 'AC Milan',
    league: 'Serie A',
    time: '21:45',
    status: 'upcoming',
    odds: { home: 2.25, draw: 3.10, away: 3.20 }
  }
];

const Home: React.FC = () => {
  const [selectedBets, setSelectedBets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('All');

  const leagues = ['All', 'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1'];

  const handleSelectBet = (bet: any) => {
    setSelectedBets(prev => {
      const existingIndex = prev.findIndex(
        b => b.matchId === bet.matchId && b.type === bet.type
      );
      
      if (existingIndex > -1) {
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        const filteredBets = prev.filter(b => b.matchId !== bet.matchId);
        return [...filteredBets, bet];
      }
    });
  };

  const filteredMatches = mockMatches.filter(match => {
    const matchesSearch = searchTerm === '' || 
      match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.league.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLeague = selectedLeague === 'All' || match.league === selectedLeague;
    
    return matchesSearch && matchesLeague;
  });

  const liveMatches = filteredMatches.filter(match => match.status === 'live');
  const upcomingMatches = filteredMatches.filter(match => match.status === 'upcoming');

  return (
    <div className="min-h-screen bg-betika-dark">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-betika-dark to-betika-darkHover border-b border-betika-gray">
        <div className="p-6">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-white mb-2">Sports Betting</h1>
            <p className="text-gray-300 mb-6">Place your bets on the best odds in the market</p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-betika-gray rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-betika-yellow">{mockMatches.length}</div>
                <div className="text-sm text-gray-300">Live Markets</div>
              </div>
              <div className="bg-betika-gray rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-betika-green">{liveMatches.length}</div>
                <div className="text-sm text-gray-300">Live Now</div>
              </div>
              <div className="bg-betika-gray rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">2.5x</div>
                <div className="text-sm text-gray-300">Avg Odds</div>
              </div>
              <div className="bg-betika-gray rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-betika-yellow">₦50K</div>
                <div className="text-sm text-gray-300">Max Win</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="p-6 border-b border-betika-gray">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams, leagues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-betika-gray border border-betika-lightGray rounded-lg text-white placeholder-gray-400 focus:border-betika-yellow focus:outline-none"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="px-4 py-3 bg-betika-gray border border-betika-lightGray rounded-lg text-white focus:border-betika-yellow focus:outline-none"
            >
              {leagues.map(league => (
                <option key={league} value={league}>{league}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold text-white">Live Matches</h2>
              <TrendingUp size={20} className="text-red-500" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {liveMatches.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onSelectBet={handleSelectBet}
                  selectedBets={selectedBets}
                />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Matches */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Upcoming Matches</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingMatches.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                onSelectBet={handleSelectBet}
                selectedBets={selectedBets}
              />
            ))}
          </div>
        </div>

        {filteredMatches.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No matches found</div>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

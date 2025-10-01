
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, TrendingUp, Loader2, RefreshCw } from 'lucide-react';
import MatchCard from '../components/MatchCard';
import { useMatches } from '../hooks/useMatches';
import { useSyncSports, useFetchOdds } from '../hooks/useSyncOdds';
import { useQueryClient } from '@tanstack/react-query';

const Home: React.FC = () => {
  const [selectedBets, setSelectedBets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('All');

  const { data: matches = [], isLoading, error } = useMatches();
  const syncSports = useSyncSports();
  const fetchOdds = useFetchOdds();
  const queryClient = useQueryClient();

  // Auto-sync on first load
  useEffect(() => {
    const hasRun = sessionStorage.getItem('odds-synced');
    if (!hasRun) {
      syncSports.mutate(undefined, {
        onSuccess: () => {
          fetchOdds.mutate(undefined, {
            onSuccess: () => {
              sessionStorage.setItem('odds-synced', 'true');
              queryClient.invalidateQueries({ queryKey: ['matches'] });
            }
          });
        }
      });
    }
  }, []);

  const handleRefresh = () => {
    fetchOdds.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['matches'] });
      }
    });
  };

  const leagues = useMemo(() => {
    const uniqueLeagues = new Set(matches.map(m => m.league));
    return ['All', ...Array.from(uniqueLeagues).sort()];
  }, [matches]);

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

  const filteredMatches = matches.filter(match => {
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
            <h1 className="text-3xl font-bold text-white mb-2">BETWISE</h1>
            <p className="text-gray-300 mb-6">Smart betting with the best odds from multiple bookmakers</p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-betika-gray rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-betika-yellow">{matches.length}</div>
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
            <button
              onClick={handleRefresh}
              disabled={fetchOdds.isPending}
              className="p-3 bg-betika-yellow hover:bg-betika-yellowHover text-betika-dark rounded-lg transition-colors disabled:opacity-50"
              title="Refresh odds"
            >
              <RefreshCw size={20} className={fetchOdds.isPending ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-betika-yellow" />
            <span className="ml-3 text-white">Loading matches...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="text-red-400 text-lg">Error loading matches</div>
            <p className="text-gray-400 mt-2">Please try again later</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

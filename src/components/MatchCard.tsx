
import React from 'react';
import { Clock, Star } from 'lucide-react';

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

interface MatchCardProps {
  match: Match;
  onSelectBet: (bet: any) => void;
  selectedBets: any[];
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onSelectBet, selectedBets }) => {
  const isBetSelected = (type: string) => {
    return selectedBets.some(bet => bet.matchId === match.id && bet.type === type);
  };

  const handleBetClick = (type: string, odds: number) => {
    const bet = {
      matchId: match.id,
      type,
      odds,
      match: `${match.homeTeam} vs ${match.awayTeam}`,
      selection: type === 'home' ? match.homeTeam : type === 'away' ? match.awayTeam : 'Draw'
    };
    onSelectBet(bet);
  };

  return (
    <div className="bg-betika-gray rounded-lg border border-betika-lightGray hover:border-betika-yellow/30 transition-colors">
      <div className="p-4">
        {/* Match Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">{match.league}</span>
            {match.isPopular && (
              <Star size={14} className="text-betika-yellow fill-current" />
            )}
          </div>
          <div className={`
            flex items-center space-x-1 text-xs px-2 py-1 rounded-full
            ${match.status === 'live' 
              ? 'bg-red-500 text-white animate-pulse-yellow' 
              : 'bg-betika-lightGray text-gray-300'
            }
          `}>
            <Clock size={12} />
            <span>{match.time}</span>
          </div>
        </div>

        {/* Team Names */}
        <div className="mb-4">
          <div className="text-white font-medium">{match.homeTeam}</div>
          <div className="text-gray-300 text-sm">vs</div>
          <div className="text-white font-medium">{match.awayTeam}</div>
        </div>

        {/* Betting Odds */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleBetClick('home', match.odds.home)}
            className={`
              py-3 px-2 rounded-lg text-center transition-all duration-200
              ${isBetSelected('home')
                ? 'bg-betika-yellow text-betika-dark font-bold'
                : 'bg-betika-lightGray hover:bg-betika-yellow hover:text-betika-dark text-white'
              }
            `}
          >
            <div className="text-xs text-current opacity-75 mb-1">1</div>
            <div className="font-bold">{match.odds.home.toFixed(2)}</div>
          </button>
          
          {match.odds.draw && (
            <button
              onClick={() => handleBetClick('draw', match.odds.draw!)}
              className={`
                py-3 px-2 rounded-lg text-center transition-all duration-200
                ${isBetSelected('draw')
                  ? 'bg-betika-yellow text-betika-dark font-bold'
                  : 'bg-betika-lightGray hover:bg-betika-yellow hover:text-betika-dark text-white'
                }
              `}
            >
              <div className="text-xs text-current opacity-75 mb-1">X</div>
              <div className="font-bold">{match.odds.draw.toFixed(2)}</div>
            </button>
          )}
          
          <button
            onClick={() => handleBetClick('away', match.odds.away)}
            className={`
              py-3 px-2 rounded-lg text-center transition-all duration-200
              ${isBetSelected('away')
                ? 'bg-betika-yellow text-betika-dark font-bold'
                : 'bg-betika-lightGray hover:bg-betika-yellow hover:text-betika-dark text-white'
              }
            `}
          >
            <div className="text-xs text-current opacity-75 mb-1">2</div>
            <div className="font-bold">{match.odds.away.toFixed(2)}</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;

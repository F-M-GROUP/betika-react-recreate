
import React, { useState } from 'react';
import { X, ShoppingCart, Trash2, Calculator } from 'lucide-react';

interface BetSlipProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface Bet {
  matchId: string;
  type: string;
  odds: number;
  match: string;
  selection: string;
}

// Mock context for demo - in real app this would come from a state management solution
const mockBets: Bet[] = [];

const BetSlip: React.FC<BetSlipProps> = ({ isOpen, onToggle }) => {
  const [bets, setBets] = useState<Bet[]>(mockBets);
  const [stake, setStake] = useState<string>('');

  const removeBet = (matchId: string, type: string) => {
    setBets(prev => prev.filter(bet => !(bet.matchId === matchId && bet.type === type)));
  };

  const clearAllBets = () => {
    setBets([]);
    setStake('');
  };

  const totalOdds = bets.reduce((acc, bet) => acc * bet.odds, 1);
  const potentialWin = stake ? (parseFloat(stake) * totalOdds).toFixed(2) : '0.00';

  return (
    <>
      {/* Mobile Bet Slip Toggle Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-betika-yellow text-betika-dark p-3 rounded-full shadow-lg"
      >
        <ShoppingCart size={24} />
        {bets.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {bets.length}
          </span>
        )}
      </button>

      {/* Bet Slip Panel */}
      <aside
        className={`
          fixed lg:static right-0 top-16 lg:top-0 bottom-0 w-80 bg-betika-gray border-l border-betika-lightGray z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-betika-lightGray">
            <div className="flex items-center space-x-2">
              <ShoppingCart size={20} className="text-betika-yellow" />
              <h3 className="font-semibold text-white">Bet Slip</h3>
              <span className="bg-betika-yellow text-betika-dark text-xs px-2 py-1 rounded-full">
                {bets.length}
              </span>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-1 hover:bg-betika-lightGray rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Bets List */}
          <div className="flex-1 overflow-y-auto">
            {bets.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <Calculator size={48} className="mx-auto mb-4 opacity-50" />
                <p>Your bet slip is empty</p>
                <p className="text-sm mt-2">Click on odds to add bets</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {bets.map((bet, index) => (
                  <div key={`${bet.matchId}-${bet.type}`} className="bg-betika-lightGray rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="text-sm text-gray-300 mb-1">{bet.match}</div>
                        <div className="text-white font-medium">{bet.selection}</div>
                      </div>
                      <button
                        onClick={() => removeBet(bet.matchId, bet.type)}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Odds</span>
                      <span className="text-betika-yellow font-bold">{bet.odds.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Betting Controls */}
          {bets.length > 0 && (
            <div className="p-4 border-t border-betika-lightGray bg-betika-dark">
              <div className="space-y-4">
                {/* Clear All Button */}
                <button
                  onClick={clearAllBets}
                  className="w-full py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  Clear All Bets
                </button>

                {/* Stake Input */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Stake Amount</label>
                  <input
                    type="number"
                    value={stake}
                    onChange={(e) => setStake(e.target.value)}
                    placeholder="Enter stake..."
                    className="w-full px-3 py-2 bg-betika-lightGray border border-betika-gray rounded-lg text-white placeholder-gray-400 focus:border-betika-yellow focus:outline-none"
                  />
                </div>

                {/* Odds Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Odds:</span>
                    <span className="text-betika-yellow font-bold">{totalOdds.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Potential Win:</span>
                    <span className="text-betika-green font-bold">₦{potentialWin}</span>
                  </div>
                </div>

                {/* Place Bet Button */}
                <button
                  className="w-full py-3 bg-betika-green hover:bg-betika-greenHover text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!stake || parseFloat(stake) <= 0}
                >
                  Place Bet
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default BetSlip;

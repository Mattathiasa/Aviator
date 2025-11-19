import { useState } from 'react';

interface BetPanelProps {
  betNumber: 1 | 2;
  amount: number;
  active: boolean;
  cashedOut: boolean;
  payout?: number;
  cashOutMultiplier?: number;
  autoBet?: boolean;
  autoCashOut?: boolean;
  autoCashOutAt?: number;
  onAmountChange: (amount: number) => void;
  onPlaceBet: () => void;
  onCashOut: () => void;
  canCashOut: boolean;
  potentialPayout: number;
  isPlaying: boolean;
  isBreak: boolean;
  balance: number;
  onToggleAutoBet?: () => void;
  onToggleAutoCashOut?: () => void;
  onAutoCashOutAtChange?: (value: number) => void;
}

export const BetPanel = ({
  betNumber,
  amount,
  active,
  cashedOut,
  payout,
  cashOutMultiplier,
  autoBet,
  autoCashOut,
  autoCashOutAt,
  onAmountChange,
  onPlaceBet,
  onCashOut,
  canCashOut,
  potentialPayout,
  isPlaying,
  isBreak,
  balance,
  onToggleAutoBet,
  onToggleAutoCashOut,
  onAutoCashOutAtChange,
}: BetPanelProps) => {
  const [inputValue, setInputValue] = useState(amount.toString());
  const [autoCashOutInput, setAutoCashOutInput] = useState((autoCashOutAt || 2.0).toString());

  const quickBets = [10, 50, 100, 500, 1000];

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 5000) {
      onAmountChange(numValue);
    }
  };

  const handleAutoCashOutChange = (value: string) => {
    setAutoCashOutInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 1.01 && onAutoCashOutAtChange) {
      onAutoCashOutAtChange(numValue);
    }
  };

  return (
    <div className="bg-[#1C1C1C] rounded-2xl p-4 border border-gray-800 shadow-lg">
      {/* Bet Amount Input */}
      <div className="mb-3">
        <label className="text-gray-400 text-xs font-semibold mb-2 block">
          BET AMOUNT
        </label>
        <div className="relative">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            disabled={active}
            className="w-full bg-[#0F0F0F] text-white text-xl font-bold px-4 py-3 rounded-xl border border-gray-700 focus:border-[#00FF80] focus:outline-none disabled:opacity-50"
            placeholder="0.00"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
            ETB
          </span>
        </div>
      </div>

      {/* Quick Bet Buttons */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {quickBets.map((bet) => (
          <button
            key={bet}
            onClick={() => handleInputChange(bet.toString())}
            disabled={active}
            className="bg-[#0F0F0F] hover:bg-gray-800 text-gray-300 text-xs font-bold py-2 rounded-lg border border-gray-700 transition-colors disabled:opacity-50"
          >
            {bet}
          </button>
        ))}
      </div>

      {/* Auto Bet Toggle */}
      <div className="flex items-center justify-between bg-[#0F0F0F] px-3 py-2 rounded-lg mb-2">
        <span className="text-gray-400 text-sm font-semibold">Auto Bet</span>
        <button
          onClick={onToggleAutoBet}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            autoBet ? 'bg-[#00FF80]' : 'bg-gray-700'
          }`}
        >
          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            autoBet ? 'translate-x-6' : 'translate-x-0'
          }`} />
        </button>
      </div>

      {/* Auto Cash Out */}
      <div className="bg-[#0F0F0F] px-3 py-2 rounded-lg mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm font-semibold">Auto Cash Out</span>
          <button
            onClick={onToggleAutoCashOut}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              autoCashOut ? 'bg-[#00FF80]' : 'bg-gray-700'
            }`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              autoCashOut ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
        {autoCashOut && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={autoCashOutInput}
              onChange={(e) => handleAutoCashOutChange(e.target.value)}
              className="flex-1 bg-[#1C1C1C] text-white text-sm font-bold px-3 py-2 rounded-lg border border-gray-700 focus:border-[#00FF80] focus:outline-none"
              placeholder="2.00"
              step="0.1"
              min="1.01"
            />
            <span className="text-gray-400 text-sm">x</span>
          </div>
        )}
      </div>

      {/* Main Action Button */}
      {balance === 0 ? (
        <div className="w-full bg-gray-700 text-gray-400 text-sm font-bold py-4 rounded-xl text-center">
          Request funds from admin to start betting
        </div>
      ) : canCashOut ? (
        <button
          onClick={onCashOut}
          className="w-full bg-gradient-to-r from-[#00FF80] to-[#00CC66] hover:from-[#00CC66] hover:to-[#00FF80] text-black text-lg font-black py-4 rounded-xl shadow-lg shadow-[#00FF80]/50 transition-all transform hover:scale-105"
        >
          CASH OUT {potentialPayout.toFixed(2)} ETB
        </button>
      ) : (
        <button
          onClick={onPlaceBet}
          disabled={active || amount < 1 || amount > balance || amount > 5000 || !isBreak}
          className="w-full bg-gradient-to-r from-[#00FF80] to-[#00CC66] hover:from-[#00CC66] hover:to-[#00FF80] text-black text-lg font-black py-4 rounded-xl shadow-lg shadow-[#00FF80]/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {active ? `BET ${amount.toFixed(2)} ETB` : isBreak ? `BET ${amount.toFixed(2)} ETB` : 'WAIT FOR NEXT ROUND'}
        </button>
      )}

      {/* Potential Payout Display */}
      {isPlaying && active && !cashedOut && (
        <div className="mt-3 bg-gradient-to-r from-[#00FF80]/20 to-[#00CC66]/20 border border-[#00FF80]/50 rounded-xl p-3 text-center">
          <div className="text-gray-400 text-xs font-semibold mb-1">POTENTIAL WIN</div>
          <div className="text-[#00FF80] text-2xl font-black">
            {potentialPayout.toFixed(2)} ETB
          </div>
        </div>
      )}

      {/* Cashed Out Display */}
      {cashedOut && payout !== undefined && (
        <div className="mt-3 bg-gradient-to-r from-[#00FF80]/30 to-[#00CC66]/30 border-2 border-[#00FF80] rounded-xl p-3 text-center">
          <div className="text-[#00FF80] text-xs font-semibold mb-1">
            CASHED OUT AT {cashOutMultiplier?.toFixed(2)}x
          </div>
          <div className="text-[#00FF80] text-2xl font-black">
            +{payout.toFixed(2)} ETB
          </div>
        </div>
      )}
    </div>
  );
};

interface RoundBet {
  socketId: string;
  playerName: string;
  betId: string;
  amount: number;
  cashedOut: boolean;
  cashOutMultiplier?: number;
  payout?: number;
  result: 'active' | 'won' | 'lost';
}

interface BetsListProps {
  bets: RoundBet[];
  currentMultiplier?: number;
  isPlaying?: boolean;
}

export const BetsList = ({ 
  bets, 
  currentMultiplier = 1.0, 
  isPlaying = false
}: BetsListProps) => {
  const safeBets = bets || [];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (result: string) => {
    if (result === 'won') return 'text-[#00FF80]';
    if (result === 'lost') return 'text-[#FF3366]';
    return 'text-[#00FFFF]';
  };

  const getStatusIcon = (result: string) => {
    if (result === 'won') return '✓';
    if (result === 'lost') return '✗';
    return '⏳';
  };

  const getAvatarColor = (socketId: string) => {
    const colors = [
      'from-[#FF3366] to-[#9D4EDD]',
      'from-[#00FF80] to-[#00CC66]',
      'from-[#00FFFF] to-[#0099CC]',
      'from-[#FFD700] to-[#FFA500]',
      'from-[#FF69B4] to-[#FF1493]',
      'from-[#9D4EDD] to-[#6A0DAD]',
    ];
    const index = socketId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  if (safeBets.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500 text-sm">No bets placed this round</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-800">
      {safeBets.map((bet, index) => (
        <div
          key={`${bet.socketId}-${bet.betId}-${index}`}
          className="flex items-center justify-between px-4 py-3 hover:bg-[#1C1C1C] transition-colors"
        >
          {/* Player Info */}
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(bet.socketId)} flex items-center justify-center text-white text-xs font-bold`}>
              {getInitials(bet.playerName)}
            </div>
            <div>
              <div className="text-white font-semibold text-sm">{bet.playerName}</div>
              <div className="text-gray-500 text-xs">{bet.amount.toFixed(2)} ETB</div>
            </div>
          </div>

          {/* Status */}
          <div className="text-right">
            {bet.result === 'won' && bet.cashOutMultiplier && (
              <div>
                <div className={`${getStatusColor(bet.result)} font-bold text-sm`}>
                  {getStatusIcon(bet.result)} {bet.cashOutMultiplier.toFixed(2)}x
                </div>
                {bet.payout && (
                  <div className="text-[#00FF80] text-xs font-semibold">
                    +{bet.payout.toFixed(2)} ETB
                  </div>
                )}
              </div>
            )}
            
            {bet.result === 'lost' && (
              <div className={`${getStatusColor(bet.result)} font-bold text-sm`}>
                {getStatusIcon(bet.result)} Lost
              </div>
            )}
            
            {bet.result === 'active' && (
              <div>
                {isPlaying ? (
                  <>
                    <div className={`${getStatusColor(bet.result)} font-bold text-sm animate-pulse`}>
                      {currentMultiplier.toFixed(2)}x
                    </div>
                    <div className="text-gray-500 text-xs">
                      {(bet.amount * currentMultiplier).toFixed(2)} ETB
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 text-xs">Waiting...</div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

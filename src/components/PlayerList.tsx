import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface PlayerListProps {
  bets: RoundBet[];
  currentMultiplier?: number;
  isPlaying?: boolean;
}

export const PlayerList = ({ bets, currentMultiplier = 1.0, isPlaying = false }: PlayerListProps) => {
  // Safety check for undefined bets
  const safeBets = bets || [];
  
  // Calculate potential payout for active bets
  const calculatePotentialPayout = (amount: number) => {
    return Math.min(amount * currentMultiplier, 10000);
  };
  
  if (safeBets.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-bold mb-2">Active Players</h3>
        <p className="text-sm text-muted-foreground">No bets placed this round</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-bold mb-3">Active Players ({safeBets.length})</h3>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {safeBets.map((bet, index) => (
            <div
              key={`${bet.socketId}-${bet.betId}-${index}`}
              className={`p-3 rounded-lg border ${
                bet.result === 'won'
                  ? 'bg-green-500/10 border-green-500/30'
                  : bet.result === 'lost'
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-yellow-500/10 border-yellow-500/30'
              }`}
            >
              {/* Player name and bet amount */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      bet.result === 'won'
                        ? 'bg-green-500'
                        : bet.result === 'lost'
                        ? 'bg-red-500'
                        : 'bg-yellow-500 animate-pulse'
                    }`}
                  />
                  <span className="font-bold text-base">{bet.playerName}</span>
                </div>
                <span className="text-sm font-semibold bg-primary/10 px-2 py-1 rounded">
                  {bet.amount} birr
                </span>
              </div>
              
              {/* Result display */}
              <div className="ml-5">
                {bet.result === 'won' && bet.cashOutMultiplier && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      ✓ Cashed out at {bet.cashOutMultiplier.toFixed(2)}x
                    </span>
                    {bet.payout && (
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        +{bet.payout.toFixed(2)} birr
                      </span>
                    )}
                  </div>
                )}
                
                {bet.result === 'lost' && (
                  <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                    ✗ Crashed - Lost {bet.amount} birr
                  </div>
                )}
                
                {bet.result === 'active' && (
                  <div className="space-y-1">
                    {isPlaying ? (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Current multiplier:</span>
                          <span className="font-bold text-primary">{currentMultiplier.toFixed(2)}x</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Potential payout:</span>
                          <span className="font-bold text-yellow-600 dark:text-yellow-400">
                            {calculatePotentialPayout(bet.amount).toFixed(2)} birr
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                        ⏳ Waiting for round to start...
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

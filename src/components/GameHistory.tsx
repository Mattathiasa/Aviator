interface HistoryEntry {
  multiplier: number;
  bet1Payout: number;
  bet2Payout: number;
  timestamp: number;
}

interface GameHistoryProps {
  history: HistoryEntry[];
}

export const GameHistory = ({ history }: GameHistoryProps) => {
  const getMultiplierColor = (multiplier: number) => {
    if (multiplier >= 10) return "text-warning";
    if (multiplier >= 2) return "text-success";
    return "text-muted-foreground";
  };

  const getTotalPayout = (entry: HistoryEntry) => {
    return entry.bet1Payout + entry.bet2Payout;
  };

  return (
    <div className="bg-card p-4 rounded-lg border border-border">
      <h3 className="text-lg font-semibold mb-3 text-foreground">Bet History (Last 10 Rounds)</h3>
      <div className="space-y-2">
        {history.length === 0 ? (
          <span className="text-muted-foreground text-sm">No history yet</span>
        ) : (
          history.map((entry, index) => {
            const totalPayout = getTotalPayout(entry);
            const isWin = totalPayout > 0;
            
            return (
              <div
                key={entry.timestamp}
                className="flex items-center justify-between p-3 rounded bg-secondary border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="text-xs text-muted-foreground">#{history.length - index}</div>
                  <div className={`font-bold text-base ${getMultiplierColor(entry.multiplier)}`}>
                    {entry.multiplier.toFixed(2)}x
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {entry.bet1Payout > 0 && (
                    <div className="text-xs">
                      <span className="text-muted-foreground">B1: </span>
                      <span className="text-success font-semibold">+{entry.bet1Payout.toFixed(0)}</span>
                    </div>
                  )}
                  {entry.bet2Payout > 0 && (
                    <div className="text-xs">
                      <span className="text-muted-foreground">B2: </span>
                      <span className="text-success font-semibold">+{entry.bet2Payout.toFixed(0)}</span>
                    </div>
                  )}
                  
                  {isWin ? (
                    <div className="text-success font-bold text-sm">
                      +{totalPayout.toFixed(0)} ETB
                    </div>
                  ) : (
                    <div className="text-destructive font-bold text-sm">
                      LOST
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

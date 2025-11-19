import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CrashHistoryProps {
  history: number[];
}

export const CrashHistory = ({ history }: CrashHistoryProps) => {
  const safeHistory = history || [];
  
  // Get color based on multiplier value
  const getColor = (multiplier: number) => {
    if (multiplier < 2) return 'text-red-500 bg-red-500/10 border-red-500/30';
    if (multiplier < 5) return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
    if (multiplier < 10) return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
    return 'text-green-500 bg-green-500/10 border-green-500/30';
  };

  if (safeHistory.length === 0) {
    return (
      <Card className="p-3">
        <h3 className="text-sm font-bold mb-2">Crash History</h3>
        <p className="text-xs text-muted-foreground">No history yet</p>
      </Card>
    );
  }

  return (
    <Card className="p-3">
      <h3 className="text-sm font-bold mb-2">Crash History</h3>
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          {safeHistory.map((multiplier, index) => (
            <div
              key={`${multiplier}-${index}`}
              className={`
                flex-shrink-0 px-3 py-2 rounded-lg border font-bold text-sm
                ${getColor(multiplier)}
              `}
            >
              {multiplier.toFixed(2)}x
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Card>
  );
};

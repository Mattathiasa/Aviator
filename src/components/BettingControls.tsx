import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface BetState {
  amount: number;
  active: boolean;
  cashedOut: boolean;
  cashOutMultiplier?: number;
  payout?: number;
  autoBet?: boolean;
  autoCashOut?: boolean;
  autoCashOutAt?: number;
}

interface BettingControlsProps {
  balance: number;
  bet1: BetState;
  bet2: BetState;
  onBet1Change: (bet: number) => void;
  onBet2Change: (bet: number) => void;
  onPlaceBet1: () => void;
  onPlaceBet2: () => void;
  onCashOut1: () => void;
  onCashOut2: () => void;
  isPlaying: boolean;
  isBreak: boolean;
  canCashOut1: boolean;
  canCashOut2: boolean;
  potentialPayout1: number;
  potentialPayout2: number;
  onToggleAutoBet1?: () => void;
  onToggleAutoBet2?: () => void;
  onToggleAutoCashOut1?: () => void;
  onToggleAutoCashOut2?: () => void;
  onAutoCashOutAt1Change?: (value: number) => void;
  onAutoCashOutAt2Change?: (value: number) => void;
}

export const BettingControls = ({
  balance,
  bet1,
  bet2,
  onBet1Change,
  onBet2Change,
  onPlaceBet1,
  onPlaceBet2,
  onCashOut1,
  onCashOut2,
  isPlaying,
  isBreak,
  canCashOut1,
  canCashOut2,
  potentialPayout1,
  potentialPayout2,
  onToggleAutoBet1,
  onToggleAutoBet2,
  onToggleAutoCashOut1,
  onToggleAutoCashOut2,
  onAutoCashOutAt1Change,
  onAutoCashOutAt2Change,
}: BettingControlsProps) => {
  const [bet1Input, setBet1Input] = useState(bet1.amount.toString());
  const [bet2Input, setBet2Input] = useState(bet2.amount.toString());
  const [autoCashOut1Input, setAutoCashOut1Input] = useState((bet1.autoCashOutAt || 2.0).toString());
  const [autoCashOut2Input, setAutoCashOut2Input] = useState((bet2.autoCashOutAt || 2.0).toString());

  const handleBet1InputChange = (value: string) => {
    setBet1Input(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 5000) {
      onBet1Change(numValue);
    }
  };

  const handleBet2InputChange = (value: string) => {
    setBet2Input(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 5000) {
      onBet2Change(numValue);
    }
  };

  const handleAutoCashOut1Change = (value: string) => {
    setAutoCashOut1Input(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 1.01 && onAutoCashOutAt1Change) {
      onAutoCashOutAt1Change(numValue);
    }
  };

  const handleAutoCashOut2Change = (value: string) => {
    setAutoCashOut2Input(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 1.01 && onAutoCashOutAt2Change) {
      onAutoCashOutAt2Change(numValue);
    }
  };

  const quickBets = [10, 50, 100, 500, 1000];

  return (
    <div className="space-y-4">
      {/* Warning when balance is 0 */}
      {balance === 0 && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
          <p className="text-xs sm:text-sm font-semibold text-red-700 dark:text-red-400 text-center">
            💰 Balance is 0 ETB - Click "Request Funds" to get started!
          </p>
        </div>
      )}
      
      {/* Warning when round is active */}
      {!isBreak && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3">
          <p className="text-xs sm:text-sm font-semibold text-yellow-700 dark:text-yellow-400 text-center">
            ⚠️ Round in progress! Wait for the break to place bets
          </p>
        </div>
      )}
      
      {/* Bet 1 Controls */}
      <div className="bg-card p-4 rounded-lg border border-border space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Bet 1</h3>
        <Input
          type="number"
          min="1"
          max="5000"
          value={bet1Input}
          onChange={(e) => handleBet1InputChange(e.target.value)}
          disabled={bet1.active}
          className="text-lg font-semibold"
          placeholder="Bet amount (ETB)"
        />
        <div className="flex gap-2 flex-wrap">
          {quickBets.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => handleBet1InputChange(amount.toString())}
              disabled={bet1.active}
              className="flex-1 min-w-[60px]"
            >
              {amount}
            </Button>
          ))}
        </div>

        {/* Auto Bet Toggle */}
        <div className="flex items-center justify-between bg-muted/50 p-2 rounded">
          <Label htmlFor="auto-bet-1" className="text-sm">Auto Bet</Label>
          <Switch
            id="auto-bet-1"
            checked={bet1.autoBet || false}
            onCheckedChange={onToggleAutoBet1}
          />
        </div>

        {/* Auto Cash Out */}
        <div className="space-y-2 bg-muted/50 p-2 rounded">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-cashout-1" className="text-sm">Auto Cash Out</Label>
            <Switch
              id="auto-cashout-1"
              checked={bet1.autoCashOut || false}
              onCheckedChange={onToggleAutoCashOut1}
            />
          </div>
          {bet1.autoCashOut && (
            <div className="flex items-center gap-2">
              <Label className="text-xs whitespace-nowrap">At:</Label>
              <Input
                type="number"
                min="1.01"
                step="0.1"
                value={autoCashOut1Input}
                onChange={(e) => handleAutoCashOut1Change(e.target.value)}
                className="h-8 text-sm"
                placeholder="2.00"
              />
              <span className="text-xs">x</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onPlaceBet1}
            disabled={bet1.active || bet1.amount < 1 || bet1.amount > balance || bet1.amount > 5000 || !isBreak}
            className="h-12 text-base font-bold bg-primary hover:bg-primary/90"
          >
            {bet1.active ? "Bet 1 Placed" : isBreak ? "Place Bet 1" : "Wait for Next Round"}
          </Button>
          
          <Button
            onClick={onCashOut1}
            disabled={!canCashOut1}
            className="h-12 text-base font-bold bg-success hover:bg-success/90 text-success-foreground"
          >
            Cash Out 1
          </Button>
        </div>

        {/* Show potential payout during flight */}
        {isPlaying && bet1.active && !bet1.cashedOut && (
          <div className="bg-success/10 border border-success/30 p-3 rounded-lg text-center">
            <div className="text-xs text-muted-foreground">Potential Win</div>
            <div className="text-xl font-bold text-success">
              {potentialPayout1.toFixed(2)} ETB
            </div>
          </div>
        )}

        {/* Show final payout if cashed out */}
        {bet1.cashedOut && bet1.payout !== undefined && (
          <div className="bg-success/20 border border-success p-3 rounded-lg text-center">
            <div className="text-xs text-success-foreground">Cashed Out at {bet1.cashOutMultiplier?.toFixed(2)}x</div>
            <div className="text-lg font-bold text-success">
              +{bet1.payout.toFixed(2)} ETB
            </div>
          </div>
        )}
      </div>

      {/* Bet 2 Controls */}
      <div className="bg-card p-4 rounded-lg border border-border space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Bet 2</h3>
        <Input
          type="number"
          min="1"
          max="5000"
          value={bet2Input}
          onChange={(e) => handleBet2InputChange(e.target.value)}
          disabled={bet2.active}
          className="text-lg font-semibold"
          placeholder="Bet amount (ETB)"
        />
        <div className="flex gap-2 flex-wrap">
          {quickBets.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => handleBet2InputChange(amount.toString())}
              disabled={bet2.active}
              className="flex-1 min-w-[60px]"
            >
              {amount}
            </Button>
          ))}
        </div>

        {/* Auto Bet Toggle */}
        <div className="flex items-center justify-between bg-muted/50 p-2 rounded">
          <Label htmlFor="auto-bet-2" className="text-sm">Auto Bet</Label>
          <Switch
            id="auto-bet-2"
            checked={bet2.autoBet || false}
            onCheckedChange={onToggleAutoBet2}
          />
        </div>

        {/* Auto Cash Out */}
        <div className="space-y-2 bg-muted/50 p-2 rounded">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-cashout-2" className="text-sm">Auto Cash Out</Label>
            <Switch
              id="auto-cashout-2"
              checked={bet2.autoCashOut || false}
              onCheckedChange={onToggleAutoCashOut2}
            />
          </div>
          {bet2.autoCashOut && (
            <div className="flex items-center gap-2">
              <Label className="text-xs whitespace-nowrap">At:</Label>
              <Input
                type="number"
                min="1.01"
                step="0.1"
                value={autoCashOut2Input}
                onChange={(e) => handleAutoCashOut2Change(e.target.value)}
                className="h-8 text-sm"
                placeholder="2.00"
              />
              <span className="text-xs">x</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onPlaceBet2}
            disabled={bet2.active || bet2.amount < 1 || bet2.amount > balance || bet2.amount > 5000 || !isBreak}
            className="h-12 text-base font-bold bg-primary hover:bg-primary/90"
          >
            {bet2.active ? "Bet 2 Placed" : isBreak ? "Place Bet 2" : "Wait for Next Round"}
          </Button>
          
          <Button
            onClick={onCashOut2}
            disabled={!canCashOut2}
            className="h-12 text-base font-bold bg-success hover:bg-success/90 text-success-foreground"
          >
            Cash Out 2
          </Button>
        </div>

        {/* Show potential payout during flight */}
        {isPlaying && bet2.active && !bet2.cashedOut && (
          <div className="bg-success/10 border border-success/30 p-3 rounded-lg text-center">
            <div className="text-xs text-muted-foreground">Potential Win</div>
            <div className="text-xl font-bold text-success">
              {potentialPayout2.toFixed(2)} ETB
            </div>
          </div>
        )}

        {/* Show final payout if cashed out */}
        {bet2.cashedOut && bet2.payout !== undefined && (
          <div className="bg-success/20 border border-success p-3 rounded-lg text-center">
            <div className="text-xs text-success-foreground">Cashed Out at {bet2.cashOutMultiplier?.toFixed(2)}x</div>
            <div className="text-lg font-bold text-success">
              +{bet2.payout.toFixed(2)} ETB
            </div>
          </div>
        )}
      </div>

      {/* Balance Display */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Balance:</span>
          <span className="text-2xl font-bold text-foreground">
            {balance.toLocaleString()} ETB
          </span>
        </div>
      </div>
    </div>
  );
};

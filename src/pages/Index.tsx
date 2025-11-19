import { GameDisplay } from "@/components/GameDisplay";
import { BettingControls } from "@/components/BettingControls";
import { GameHistory } from "@/components/GameHistory";
import { Button } from "@/components/ui/button";
import { useGameLogic } from "@/hooks/useGameLogic";
import { useGameAudio } from "@/hooks/useGameAudio";
import { RotateCcw, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const {
    balance,
    bet1,
    bet2,
    multiplier,
    isPlaying,
    crashed,
    history,
    countdown,
    isBreak,
    setBet1Amount,
    setBet2Amount,
    placeBet1,
    placeBet2,
    cashOut1,
    cashOut2,
    resetBalance,
    getPotentialPayout1,
    getPotentialPayout2,
    canCashOut1,
    canCashOut2,
    toggleAutoBet1,
    toggleAutoBet2,
    toggleAutoCashOut1,
    toggleAutoCashOut2,
    setAutoCashOutAt1,
    setAutoCashOutAt2,
  } = useGameLogic();

  // Initialize game audio
  useGameAudio(isPlaying, crashed);

  return (
    <div className="min-h-screen bg-gradient-primary p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              🚀 Aviator Crash Game
            </h1>
            <p className="text-muted-foreground">
              Place your bet, watch the multiplier rise, and cash out before it crashes!
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/aviator">
              <Button variant="default" className="gap-2 bg-gradient-to-r from-pink-500 to-red-500">
                <Users className="w-4 h-4" />
                Aviator Style
              </Button>
            </Link>
            <Link to="/multiplayer">
              <Button variant="default" className="gap-2">
                <Users className="w-4 h-4" />
                Multiplayer
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={resetBalance}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Balance
            </Button>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Game Display - Takes 2 columns on desktop */}
          <div className="md:col-span-2 space-y-4">
            <GameDisplay
              multiplier={multiplier}
              isPlaying={isPlaying}
              crashed={crashed}
              isBreak={isBreak}
              countdown={countdown}
            />
            <GameHistory history={history} />
          </div>

          {/* Betting Controls - Takes 1 column on desktop */}
          <div>
            <BettingControls
              balance={balance}
              bet1={bet1}
              bet2={bet2}
              onBet1Change={setBet1Amount}
              onBet2Change={setBet2Amount}
              onPlaceBet1={placeBet1}
              onPlaceBet2={placeBet2}
              onCashOut1={cashOut1}
              onCashOut2={cashOut2}
              isPlaying={isPlaying}
              isBreak={isBreak}
              canCashOut1={canCashOut1}
              canCashOut2={canCashOut2}
              potentialPayout1={getPotentialPayout1()}
              potentialPayout2={getPotentialPayout2()}
              onToggleAutoBet1={toggleAutoBet1}
              onToggleAutoBet2={toggleAutoBet2}
              onToggleAutoCashOut1={toggleAutoCashOut1}
              onToggleAutoCashOut2={toggleAutoCashOut2}
              onAutoCashOutAt1Change={setAutoCashOutAt1}
              onAutoCashOutAt2Change={setAutoCashOutAt2}
            />
          </div>
        </div>

        {/* Game Rules */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">How to Play</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Place up to 2 bets per round (1-5,000 ETB each)</li>
            <li>• Bet amounts are deducted immediately when placed</li>
            <li>• Rounds start automatically after an 8-second break</li>
            <li>• Place bets during the 8-second break period</li>
            <li>• Watch the multiplier increase in real-time</li>
            <li>• Click "Cash Out" before the crash to win!</li>
            <li>• If the plane crashes before you cash out, your bet is lost</li>
            <li>• Each bet can be cashed out independently</li>
            <li>• Enable "Auto Bet" to automatically place bets each round</li>
            <li>• Enable "Auto Cash Out" to automatically cash out at your target multiplier</li>
            <li>• Maximum win per bet: 50,000 ETB</li>
            <li>• Your balance and history are automatically saved</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm">
          <p>Currency: Ethiopian Birr (ETB) | Provably Fair Random Generation</p>
        </div>
      </div>
    </div>
  );
};

export default Index;

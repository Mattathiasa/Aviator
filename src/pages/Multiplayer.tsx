import { GameDisplay } from "@/components/GameDisplay";
import { BettingControls } from "@/components/BettingControls";
import { PlayerList } from "@/components/PlayerList";
import { CrashHistory } from "@/components/CrashHistory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useMultiplayerGame } from "@/hooks/useMultiplayerGame";
import { useGameAudio } from "@/hooks/useGameAudio";
import { AdminAuthModal } from "@/components/aviator-ui/AdminAuthModal";
import { AdminPanel } from "@/components/aviator-ui/AdminPanel";
import { Wifi, WifiOff, ArrowLeft, User, Shield, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const MultiplayerContent = () => {
  const {
    connected,
    socketId,
    balance,
    bet1,
    bet2,
    multiplier,
    isPlaying,
    crashed,
    countdown,
    isBreak,
    playerName,
    roundBets,
    crashHistory,
    onlinePlayers,
    updatePlayerName,
    refreshOnlinePlayers,
    setBet1Amount,
    setBet2Amount,
    placeBet1,
    placeBet2,
    cashOut1,
    cashOut2,
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
    isAdmin,
    pendingRequests,
    balanceRequestPending,
    authenticateAdmin,
    requestBalance,
    grantBalance,
    denyBalanceRequest,
  } = useMultiplayerGame();

  const [nameInput, setNameInput] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState('');

  // Update nameInput when playerName changes from server
  useEffect(() => {
    if (playerName) {
      setNameInput(playerName);
      setShowNameInput(false);
    }
  }, [playerName]);

  // Add game audio (same as home page)
  useGameAudio(isPlaying, crashed);

  // Debug: Log online players state
  useEffect(() => {
    console.log('🔍 [Multiplayer] Online Players State:', onlinePlayers);
    console.log('🔍 [Multiplayer] Connected:', connected);
    console.log('🔍 [Multiplayer] Socket ID:', socketId);
    console.log('🔍 [Multiplayer] Player Name:', playerName);
  }, [onlinePlayers, connected, socketId, playerName]);

  const handleNameSubmit = () => {
    const safeName = (nameInput || '').trim();
    if (!safeName) {
      alert('Please enter your name before joining');
      return;
    }
    
    // Safety check for updatePlayerName function
    if (typeof updatePlayerName === 'function') {
      updatePlayerName(safeName);
      setShowNameInput(false);
    } else {
      console.error('updatePlayerName is not available');
      alert('Error: Unable to set name. Please refresh the page.');
    }
  };

  const handleAdminAuth = (password: string) => {
    authenticateAdmin(password);
  };

  // Close admin auth modal when admin status changes
  useEffect(() => {
    if (isAdmin) {
      setShowAdminAuthModal(false);
      setAdminAuthError('');
    }
  }, [isAdmin]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-3 sm:p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-3 sm:gap-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-4xl font-bold text-primary tracking-wide">Berariw

            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
            {connected ? <Wifi className="text-green-500" /> : <WifiOff className="text-red-500" />}
            <span>{connected ? 'Connected' : 'Disconnected'}</span>
            <span className="hidden sm:inline">|</span>
            <span className="font-semibold">
              Balance: <span className="text-primary">{balance.toFixed(2)}</span> birr
            </span>
            
            {/* Request Funds Button (for players with 0 balance) */}
            {balance === 0 && !isAdmin && (
              <Button 
                onClick={() => requestBalance()} 
                disabled={balanceRequestPending}
                size="sm" 
                className="bg-green-600 hover:bg-green-700 h-7 sm:h-8 text-xs"
              >
                <DollarSign className="w-3 h-3 mr-1" />
                {balanceRequestPending ? 'Pending...' : 'Request Funds'}
              </Button>
            )}
            
            {/* Admin Panel Button (for admins) */}
            {isAdmin && (
              <>
                <Button 
                  onClick={() => setShowAdminPanel(true)}
                  size="sm" 
                  className="bg-pink-600 hover:bg-pink-700 h-7 sm:h-8 text-xs relative"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Admin Panel
                  {pendingRequests.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {pendingRequests.length}
                    </span>
                  )}
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                  size="sm" 
                  variant="outline"
                  className="h-7 sm:h-8 text-xs"
                >
                  Logout
                </Button>
              </>
            )}
            
            {/* Admin Login Button (for non-admins) */}
            {!isAdmin && (
              <Button 
                onClick={() => setShowAdminAuthModal(true)}
                size="sm" 
                variant="outline"
                className="h-7 sm:h-8 text-xs"
              >
                <Shield className="w-3 h-3 mr-1" />
                Admin Login
              </Button>
            )}
          </div>
        </div>

        {/* Player Name Section */}
        {showNameInput ? (
          <Card className="p-3 sm:p-4 bg-gray-900/50 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-4">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <div className="flex-1">
                <Label htmlFor="playerName" className="text-xs sm:text-sm">Enter Your Name</Label>
                <div className="flex gap-2 mt-1 sm:mt-2">
                  <Input
                    id="playerName"
                    placeholder="Your name..."
                    value={nameInput || ''}
                    onChange={(e) => setNameInput(e.target.value || '')}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                    maxLength={20}
                    className="h-8 sm:h-10 text-sm"
                  />
                  <Button onClick={handleNameSubmit} disabled={!(nameInput || '').trim()} size="sm" className="h-8 sm:h-10">
                    Set
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-2 sm:p-3 bg-gray-900/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-sm sm:text-base font-semibold">Playing as: {playerName}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowNameInput(true)} className="text-xs sm:text-sm h-7 sm:h-9">
                Change
              </Button>
            </div>
          </Card>
        )}
 
        {/* Game Area */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            {/* Game Display */}
            <Card className="p-2 sm:p-4 rounded-2xl shadow-xl bg-gradient-to-b from-gray-800 to-gray-900">
              <GameDisplay
                multiplier={multiplier}
                isPlaying={isPlaying}
                crashed={crashed}
                isBreak={isBreak}
                countdown={countdown}
              />
            </Card>
 
            {/* Crash History */}
            <div className="bg-gray-900/50 rounded-lg p-3">
              <CrashHistory history={crashHistory || []} />
            </div>
 
            {/* Player List */}
            <div className="bg-gray-900/50 rounded-lg p-3 max-h-[300px] overflow-y-auto">
              <PlayerList 
                bets={roundBets || []}
                currentMultiplier={multiplier}
                isPlaying={isPlaying}
              />
            </div>
          </div>
 
          {/* Betting Controls + Online Players */}
          <div className="flex flex-col gap-3">
            <Card className="p-3 sm:p-4 rounded-2xl bg-gradient-to-t from-slate-800 to-slate-900 shadow-xl">
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
            </Card>
 
            {/* Online Players */}
            <Card className="p-3 sm:p-4 bg-gray-900/50 rounded-lg">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Online ({onlinePlayers?.length || 0})
              </h3>
              <div className="max-h-[200px] overflow-y-auto space-y-1">
                {(onlinePlayers || []).length > 0 ? (
                  onlinePlayers?.map((player) => (
                    <div
                      key={player.socketId}
                      className="flex justify-between items-center p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-all"
                    >
                      <span>{player.name}{player.socketId === socketId && ' (You)'}</span>
                      <span className="text-primary">{player.balance.toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground text-sm mb-2">⚠️ Not receiving player data</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Connected: {connected ? '✓ Yes' : '✗ No'} | Name: {playerName || 'Not set'}
                    </p>
                    <Button size="sm" onClick={refreshOnlinePlayers} className="mb-2">
                      🔄 Refresh Players
                    </Button>
                    <p className="text-xs text-red-500">
                      Check server console for "📡 Broadcasting" messages
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
 
        {/* Footer */}
        <div className="text-center text-muted-foreground text-xs sm:text-sm pt-2">
          <p>Made with ❤️ — Multiplayer powered by Socket.io</p>
        </div>
      </div>

      {/* Admin Auth Modal */}
      {showAdminAuthModal && (
        <AdminAuthModal
          onAuthenticate={handleAdminAuth}
          onClose={() => {
            setShowAdminAuthModal(false);
            setAdminAuthError('');
          }}
          error={adminAuthError}
        />
      )}

      {/* Admin Panel */}
      {showAdminPanel && isAdmin && (
        <AdminPanel
          onlinePlayers={onlinePlayers}
          pendingRequests={pendingRequests}
          onGrantBalance={grantBalance}
          onDenyRequest={denyBalanceRequest}
          onClose={() => setShowAdminPanel(false)}
        />
      )}

      {/* Balance Request Pending Indicator */}
      {balanceRequestPending && (
        <div className="fixed top-20 left-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Balance request pending...
        </div>
      )}
    </div>
  );
};

// Error boundary wrapper
const Multiplayer = () => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error('Multiplayer error:', error);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-primary p-4 md:p-8 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            The multiplayer game encountered an error. Please refresh the page to try again.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Refresh Page
          </Button>
        </Card>
      </div>
    );
  }

  try {
    return <MultiplayerContent />;
  } catch (error) {
    console.error('Render error:', error);
    return (
      <div className="min-h-screen bg-gradient-primary p-4 md:p-8 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Render Error</h2>
          <p className="text-muted-foreground mb-4">
            Failed to render the multiplayer game. Please refresh the page.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Refresh Page
          </Button>
        </Card>
      </div>
    );
  }
};

export default Multiplayer;
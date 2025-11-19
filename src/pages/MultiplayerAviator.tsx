import { useState, useEffect } from 'react';
import { useMultiplayerGame } from '@/hooks/useMultiplayerGame';
import { useGameAudio } from '@/hooks/useGameAudio';
import { HeaderBar } from '@/components/aviator-ui/HeaderBar';
import { MultiplierBar } from '@/components/aviator-ui/MultiplierBar';
import { GameArea } from '@/components/aviator-ui/GameArea';
import { BetPanel } from '@/components/aviator-ui/BetPanel';
import { Tabs } from '@/components/aviator-ui/Tabs';
import { BetsList } from '@/components/aviator-ui/BetsList';
import { ChatButton } from '@/components/aviator-ui/ChatButton';
import { RequestFundsButton } from '@/components/aviator-ui/RequestFundsButton';
import { AdminAuthModal } from '@/components/aviator-ui/AdminAuthModal';
import { AdminPanel } from '@/components/aviator-ui/AdminPanel';

const MultiplayerAviator = () => {
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

  const [activeTab, setActiveTab] = useState<'all' | 'previous' | 'top'>('all');
  const [showNameModal, setShowNameModal] = useState(!playerName);
  const [nameInput, setNameInput] = useState('');
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState('');

  useGameAudio(isPlaying, crashed);

  // Debug: Log online players state
  useEffect(() => {
    console.log('🔍 Online Players State:', onlinePlayers);
  }, [onlinePlayers]);

  const handleNameSubmit = () => {
    const safeName = (nameInput || '').trim();
    if (!safeName) {
      alert('Please enter your name');
      return;
    }
    updatePlayerName(safeName);
    setShowNameModal(false);
  };

  const handleAdminAuth = (password: string) => {
    authenticateAdmin(password);
    // Close modal on successful auth (will be handled by isAdmin state change)
  };

  // Close admin auth modal when admin status changes
  useEffect(() => {
    if (isAdmin) {
      setShowAdminAuthModal(false);
      setAdminAuthError('');
    }
  }, [isAdmin]);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Name Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1C1C1C] rounded-2xl p-6 max-w-md w-full border border-gray-800">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
              Welcome to Bererech!
            </h2>
            <p className="text-gray-400 mb-4">Enter your name to start playing</p>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
              placeholder="Your name..."
              maxLength={20}
              className="w-full bg-[#0F0F0F] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-[#00FF80] focus:outline-none mb-4"
            />
            <button
              onClick={handleNameSubmit}
              disabled={!nameInput.trim()}
              className="w-full bg-gradient-to-r from-[#00FF80] to-[#00CC66] text-black font-bold py-3 rounded-xl disabled:opacity-50"
            >
              Start Playing
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <HeaderBar 
        balance={balance}
        isAdmin={isAdmin}
        pendingRequestsCount={pendingRequests.length}
        onRequestFunds={() => requestBalance()}
        onOpenAdminPanel={() => setShowAdminPanel(true)}
        onAdminLogin={() => setShowAdminAuthModal(true)}
      />

      {/* Multiplier History Bar */}
      <MultiplierBar history={crashHistory || []} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        {/* Left Column - Game Area + Bets List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Game Display */}
          <GameArea
            multiplier={multiplier}
            isPlaying={isPlaying}
            crashed={crashed}
            isBreak={isBreak}
            countdown={countdown}
          />

          {/* Tabs and Bets List */}
          <div className="bg-[#1C1C1C] rounded-2xl border border-gray-800 overflow-hidden">
            <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="max-h-[400px] overflow-y-auto">
              {activeTab === 'all' && (
                <BetsList
                  bets={roundBets || []}
                  currentMultiplier={multiplier}
                  isPlaying={isPlaying}
                />
              )}
              {activeTab === 'previous' && (
                <div className="flex items-center justify-center py-12">
                  <p className="text-gray-500 text-sm">My Bets - Coming Soon</p>
                </div>
              )}
              {activeTab === 'top' && (
                <div className="flex items-center justify-center py-12">
                  <p className="text-gray-500 text-sm">Top Wins - Coming Soon</p>
                </div>
              )}
            </div>
          </div>

          {/* Online Players Container */}
          <div className="bg-[#1C1C1C] rounded-2xl border border-gray-800 overflow-hidden">
            <div className="px-4 py-3 bg-[#0F0F0F] border-b border-gray-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Online ({(onlinePlayers || []).length})
              </h3>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {(onlinePlayers || []).length > 0 ? (
                <div className="divide-y divide-gray-800">
                  {(onlinePlayers || []).map((player) => {
                    const getInitials = (name: string) => {
                      return name
                        .split(' ')
                        .map(word => word[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);
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

                    return (
                      <div
                        key={player.socketId}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-[#0F0F0F] transition-colors ${
                          player.socketId === socketId ? 'bg-[#0F0F0F]/50' : ''
                        }`}
                      >
                        {/* Player Info */}
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(player.socketId)} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                            {getInitials(player.name)}
                          </div>
                          <div>
                            <div className="text-white font-semibold text-sm flex items-center gap-2">
                              {player.name}
                              {player.socketId === socketId && (
                                <span className="text-[#00FF80] text-xs font-bold">(You)</span>
                              )}
                            </div>
                            <div className="text-gray-500 text-xs flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                              Online
                            </div>
                          </div>
                        </div>

                        {/* Balance */}
                        <div className="text-right">
                          <div className="text-white font-bold text-sm">{player.balance.toFixed(2)} ETB</div>
                          <div className="text-gray-500 text-xs">Balance</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <p className="text-gray-500 text-sm">No players online</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Bet Panels */}
        <div className="space-y-4">
          <BetPanel
            betNumber={1}
            amount={bet1.amount}
            active={bet1.active}
            cashedOut={bet1.cashedOut}
            payout={bet1.payout}
            cashOutMultiplier={bet1.cashOutMultiplier}
            autoBet={bet1.autoBet}
            autoCashOut={bet1.autoCashOut}
            autoCashOutAt={bet1.autoCashOutAt}
            onAmountChange={setBet1Amount}
            onPlaceBet={placeBet1}
            onCashOut={cashOut1}
            canCashOut={canCashOut1}
            potentialPayout={getPotentialPayout1()}
            isPlaying={isPlaying}
            isBreak={isBreak}
            balance={balance}
            onToggleAutoBet={toggleAutoBet1}
            onToggleAutoCashOut={toggleAutoCashOut1}
            onAutoCashOutAtChange={setAutoCashOutAt1}
          />

          <BetPanel
            betNumber={2}
            amount={bet2.amount}
            active={bet2.active}
            cashedOut={bet2.cashedOut}
            payout={bet2.payout}
            cashOutMultiplier={bet2.cashOutMultiplier}
            autoBet={bet2.autoBet}
            autoCashOut={bet2.autoCashOut}
            autoCashOutAt={bet2.autoCashOutAt}
            onAmountChange={setBet2Amount}
            onPlaceBet={placeBet2}
            onCashOut={cashOut2}
            canCashOut={canCashOut2}
            potentialPayout={getPotentialPayout2()}
            isPlaying={isPlaying}
            isBreak={isBreak}
            balance={balance}
            onToggleAutoBet={toggleAutoBet2}
            onToggleAutoCashOut={toggleAutoCashOut2}
            onAutoCashOutAtChange={setAutoCashOutAt2}
          />
        </div>
      </div>

      {/* Chat Button */}
      <ChatButton />

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

      {/* Connection Status Indicator */}
      {!connected && (
        <div className="fixed top-20 right-4 bg-[#FF3366] text-white px-4 py-2 rounded-lg shadow-lg">
          Disconnected - Reconnecting...
        </div>
      )}

      {/* Balance Request Pending Indicator */}
      {balanceRequestPending && (
        <div className="fixed top-20 left-4 bg-[#00FF80] text-black px-4 py-2 rounded-lg shadow-lg">
          Balance request pending...
        </div>
      )}
    </div>
  );
};

export default MultiplayerAviator;

import { useState } from 'react';

interface OnlinePlayer {
  socketId: string;
  name: string;
  balance: number;
}

interface PendingRequest {
  socketId: string;
  playerName: string;
  currentBalance: number;
  requestedAt: number;
  requestedAmount?: number;
}

interface AdminPanelProps {
  onlinePlayers: OnlinePlayer[];
  pendingRequests: PendingRequest[];
  onGrantBalance: (socketId: string, amount: number) => void;
  onDenyRequest: (socketId: string) => void;
  onClose: () => void;
}

export const AdminPanel = ({
  onlinePlayers,
  pendingRequests,
  onGrantBalance,
  onDenyRequest,
  onClose
}: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  const handleGrant = (socketId: string) => {
    const amount = parseFloat(amounts[socketId] || '0');
    if (amount >= 1 && amount <= 10000) {
      onGrantBalance(socketId, amount);
      setAmounts({ ...amounts, [socketId]: '' });
    }
  };

  const handleAmountChange = (socketId: string, value: string) => {
    setAmounts({ ...amounts, [socketId]: value });
  };

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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1C1C1C] rounded-2xl max-w-4xl w-full max-h-[90vh] border border-gray-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
            Admin Panel
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 px-6 py-3 font-bold text-sm transition-colors ${
              activeTab === 'pending'
                ? 'text-[#00FF80] border-b-2 border-[#00FF80]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Pending Requests ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-6 py-3 font-bold text-sm transition-colors ${
              activeTab === 'all'
                ? 'text-[#00FF80] border-b-2 border-[#00FF80]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Players ({onlinePlayers.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No pending requests</p>
                </div>
              ) : (
                pendingRequests.map((request) => (
                  <div
                    key={request.socketId}
                    className="bg-[#0F0F0F] rounded-xl p-4 border border-gray-800"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(request.socketId)} flex items-center justify-center text-white text-sm font-bold`}>
                        {getInitials(request.playerName)}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-bold">{request.playerName}</div>
                        <div className="text-gray-400 text-sm">
                          Current Balance: {request.currentBalance.toFixed(2)} ETB
                        </div>
                        {request.requestedAmount && (
                          <div className="text-[#00FF80] text-sm">
                            Requested: {request.requestedAmount.toFixed(2)} ETB
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        value={amounts[request.socketId] || ''}
                        onChange={(e) => handleAmountChange(request.socketId, e.target.value)}
                        placeholder="Amount (1-10000)"
                        min="1"
                        max="10000"
                        className="flex-1 bg-[#1C1C1C] text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-[#00FF80] focus:outline-none"
                      />
                      <button
                        onClick={() => handleGrant(request.socketId)}
                        disabled={!amounts[request.socketId] || parseFloat(amounts[request.socketId]) < 1}
                        className="px-6 py-2 bg-gradient-to-r from-[#00FF80] to-[#00CC66] text-black font-bold rounded-lg disabled:opacity-50"
                      >
                        Grant
                      </button>
                      <button
                        onClick={() => onDenyRequest(request.socketId)}
                        className="px-6 py-2 bg-red-500/20 text-red-500 font-bold rounded-lg hover:bg-red-500/30"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'all' && (
            <div className="space-y-4">
              {onlinePlayers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No players online</p>
                </div>
              ) : (
                onlinePlayers.map((player) => (
                  <div
                    key={player.socketId}
                    className="bg-[#0F0F0F] rounded-xl p-4 border border-gray-800"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(player.socketId)} flex items-center justify-center text-white text-sm font-bold`}>
                        {getInitials(player.name)}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-bold">{player.name}</div>
                        <div className="text-gray-400 text-sm">
                          Balance: {player.balance.toFixed(2)} ETB
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        value={amounts[player.socketId] || ''}
                        onChange={(e) => handleAmountChange(player.socketId, e.target.value)}
                        placeholder="Amount (1-10000)"
                        min="1"
                        max="10000"
                        className="flex-1 bg-[#1C1C1C] text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-[#00FF80] focus:outline-none"
                      />
                      <button
                        onClick={() => handleGrant(player.socketId)}
                        disabled={!amounts[player.socketId] || parseFloat(amounts[player.socketId]) < 1}
                        className="px-6 py-2 bg-gradient-to-r from-[#00FF80] to-[#00CC66] text-black font-bold rounded-lg disabled:opacity-50"
                      >
                        Add Funds
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

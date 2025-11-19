interface OnlinePlayer {
  socketId: string;
  name: string;
  balance: number;
}

interface OnlinePlayersListProps {
  players: OnlinePlayer[];
  currentPlayerSocketId?: string;
}

export const OnlinePlayersList = ({ players, currentPlayerSocketId }: OnlinePlayersListProps) => {
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

  if (players.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500 text-sm">No players online</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-800">
      {players.map((player) => (
        <div
          key={player.socketId}
          className={`flex items-center justify-between px-4 py-3 hover:bg-[#1C1C1C] transition-colors ${
            player.socketId === currentPlayerSocketId ? 'bg-[#1C1C1C]/50' : ''
          }`}
        >
          {/* Player Info */}
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(player.socketId)} flex items-center justify-center text-white text-xs font-bold`}>
              {getInitials(player.name)}
            </div>
            <div>
              <div className="text-white font-semibold text-sm flex items-center gap-2">
                {player.name}
                {player.socketId === currentPlayerSocketId && (
                  <span className="text-[#00FF80] text-xs">(You)</span>
                )}
              </div>
              <div className="text-gray-500 text-xs">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="text-right">
            <div className="text-white font-bold text-sm">{player.balance.toFixed(2)} ETB</div>
            <div className="text-gray-500 text-xs">Balance</div>
          </div>
        </div>
      ))}
    </div>
  );
};

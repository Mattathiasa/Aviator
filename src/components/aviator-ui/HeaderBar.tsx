interface HeaderBarProps {
  balance: number;
  isAdmin?: boolean;
  pendingRequestsCount?: number;
  onRequestFunds?: () => void;
  onOpenAdminPanel?: () => void;
  onAdminLogin?: () => void;
}

export const HeaderBar = ({ 
  balance, 
  isAdmin = false, 
  pendingRequestsCount = 0,
  onRequestFunds,
  onOpenAdminPanel,
  onAdminLogin
}: HeaderBarProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#111111] border-b border-gray-800">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-pink-600 bg-clip-text text-transparent">
          Bererech
        </h1>
      </div>

      {/* Balance and Actions */}
      <div className="flex items-center gap-3">
        {/* Request Funds Button (for players with 0 balance) */}
        {balance === 0 && onRequestFunds && !isAdmin && (
          <button
            onClick={onRequestFunds}
            className="px-4 py-2 bg-gradient-to-r from-[#00FF80] to-[#00CC66] text-black font-bold text-sm rounded-lg hover:opacity-90"
          >
            Request Funds
          </button>
        )}

        {/* Admin Panel Button (for admins) */}
        {isAdmin && onOpenAdminPanel && (
          <button
            onClick={onOpenAdminPanel}
            className="relative px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold text-sm rounded-lg hover:opacity-90"
          >
            Admin Panel
            {pendingRequestsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#00FF80] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {pendingRequestsCount}
              </span>
            )}
          </button>
        )}

        {/* Admin Login Button (for non-admins) */}
        {!isAdmin && onAdminLogin && (
          <button
            onClick={onAdminLogin}
            className="px-4 py-2 bg-gray-700 text-white font-bold text-sm rounded-lg hover:bg-gray-600"
          >
            Admin Login
          </button>
        )}

        {/* Balance Display */}
        <div className="flex items-center gap-2 bg-[#1C1C1C] px-4 py-2 rounded-lg border border-gray-800">
          <span className="text-gray-400 text-sm">Balance:</span>
          <span className="text-[#00FF80] font-bold text-lg">
            {balance.toFixed(2)} ETB
          </span>
        </div>
      </div>
    </div>
  );
};

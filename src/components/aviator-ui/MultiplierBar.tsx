interface MultiplierBarProps {
  history: number[];
}

export const MultiplierBar = ({ history }: MultiplierBarProps) => {
  const getRandomColor = (multiplier: number) => {
    if (multiplier >= 10) return 'text-[#FFD700]'; // Gold
    if (multiplier >= 5) return 'text-[#9D4EDD]'; // Purple
    if (multiplier >= 2) return 'text-[#00FFFF]'; // Cyan
    return 'text-[#FF3366]'; // Pink
  };

  const getGlowColor = (multiplier: number) => {
    if (multiplier >= 10) return 'shadow-[0_0_10px_rgba(255,215,0,0.5)]';
    if (multiplier >= 5) return 'shadow-[0_0_10px_rgba(157,78,221,0.5)]';
    if (multiplier >= 2) return 'shadow-[0_0_10px_rgba(0,255,255,0.5)]';
    return 'shadow-[0_0_10px_rgba(255,51,102,0.5)]';
  };

  return (
    <div className="bg-[#0F0F0F] border-b border-gray-800 px-4 py-3 overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        {history.slice(-15).reverse().map((multiplier, index) => (
          <div
            key={`${multiplier}-${index}`}
            className={`
              px-4 py-2 rounded-lg bg-[#1C1C1C] border border-gray-700
              ${getRandomColor(multiplier)} ${getGlowColor(multiplier)}
              font-bold text-sm whitespace-nowrap
            `}
          >
            {multiplier.toFixed(2)}x
          </div>
        ))}
      </div>
    </div>
  );
};

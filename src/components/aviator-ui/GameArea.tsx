interface GameAreaProps {
  multiplier: number;
  isPlaying: boolean;
  crashed: boolean;
  isBreak: boolean;
  countdown: number;
}

export const GameArea = ({ 
  multiplier, 
  isPlaying, 
  crashed, 
  isBreak, 
  countdown 
}: GameAreaProps) => {
  return (
    <div className="relative mx-4 my-4 rounded-3xl overflow-hidden bg-gradient-to-br from-[#0F0F0F] via-[#1a1a2e] to-[#0F0F0F] border border-gray-800 shadow-2xl">
      {/* Inner glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-60" />
      
      {/* Content */}
      <div className="relative h-[400px] flex flex-col items-center justify-center">
        {/* Plane */}
        <div className={`text-8xl mb-6 transition-all duration-300 ${
          isPlaying ? 'animate-bounce scale-110' : 'scale-100'
        } ${crashed ? 'opacity-30' : 'opacity-100'}`}>
          ✈️
        </div>

        {/* Multiplier or Countdown */}
        {isBreak ? (
          <div className="space-y-2 text-center">
            <div className="text-6xl font-black text-[#00FFFF] animate-pulse">
              {countdown}
            </div>
            <div className="text-xl text-gray-400 font-semibold">
              Next round starting...
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-center">
            <div className={`text-7xl font-black transition-all duration-200 ${
              crashed 
                ? 'text-[#FF3366] animate-pulse' 
                : isPlaying 
                ? 'text-[#00FF80] scale-110' 
                : 'text-gray-400'
            }`}
            style={{
              textShadow: isPlaying && !crashed 
                ? '0 0 30px rgba(0, 255, 128, 0.8), 0 0 60px rgba(0, 255, 128, 0.4)' 
                : crashed 
                ? '0 0 30px rgba(255, 51, 102, 0.8)' 
                : 'none'
            }}>
              {multiplier.toFixed(2)}x
            </div>
            <div className={`text-2xl font-bold ${
              crashed ? 'text-[#FF3366]' : isPlaying ? 'text-[#00FF80]' : 'text-gray-500'
            }`}>
              {crashed ? 'FLEW AWAY!' : isPlaying ? 'FLYING...' : 'WAITING...'}
            </div>
          </div>
        )}

        {/* Animated background effects */}
        {isPlaying && !crashed && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-[#00FF80]/10 to-transparent animate-pulse" />
          </div>
        )}

        {crashed && (
          <div className="absolute inset-0 bg-[#FF3366]/20 pointer-events-none animate-pulse" />
        )}
      </div>
    </div>
  );
};

import { useEffect, useRef } from "react";

interface GameDisplayProps {
  multiplier: number;
  isPlaying: boolean;
  crashed: boolean;
  isBreak: boolean;
  countdown: number;
}

export const GameDisplay = ({ multiplier, isPlaying, crashed, isBreak, countdown }: GameDisplayProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (crashed && canvasRef.current) {
      canvasRef.current.style.animation = "shake 0.5s";
      setTimeout(() => {
        if (canvasRef.current) {
          canvasRef.current.style.animation = "";
        }
      }, 500);
    }
  }, [crashed]);

  const getStatusColor = () => {
    if (crashed) return "text-destructive";
    if (isPlaying) return "text-accent";
    if (isBreak) return "text-warning";
    return "text-muted-foreground";
  };

  const getStatusText = () => {
    if (crashed) return "CRASHED!";
    if (isPlaying) return "FLYING...";
    if (isBreak) return `NEXT ROUND IN ${countdown}s`;
    return "WAITING...";
  };

  return (
    <div className="relative w-full h-48 sm:h-64 lg:h-72 bg-card rounded-lg border border-border overflow-hidden">
      <div 
        ref={canvasRef}
        className="absolute inset-0 bg-gradient-game flex flex-col items-center justify-center"
      >
        {/* Plane - Smaller on mobile */}
        <div className={`text-5xl sm:text-6xl lg:text-7xl transition-transform duration-300 ${
          isPlaying ? "animate-bounce" : ""
        } ${crashed ? "opacity-30" : "opacity-100"} ${isBreak ? "opacity-50" : "opacity-100"}`}>
          🚀
        </div>

        {/* Multiplier Display or Countdown - Smaller on mobile */}
        {isBreak ? (
          <div className="mt-3 sm:mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-warning transition-all duration-200">
            {countdown}
          </div>
        ) : (
          <div className={`mt-3 sm:mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold ${getStatusColor()} transition-all duration-200 ${
            isPlaying ? "scale-110" : "scale-100"
          }`}>
            {multiplier.toFixed(2)}x
          </div>
        )}

        {/* Status - Smaller on mobile */}
        <div className={`mt-2 sm:mt-3 text-base sm:text-xl lg:text-2xl font-semibold ${getStatusColor()}`}>
          {getStatusText()}
        </div>

        {/* Animated background effect */}
        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-success/10 to-transparent animate-pulse" />
          </div>
        )}

        {crashed && (
          <div className="absolute inset-0 bg-destructive/20 pointer-events-none animate-pulse" />
        )}
      </div>
    </div>
  );
};

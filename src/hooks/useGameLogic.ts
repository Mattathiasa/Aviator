import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const INITIAL_BALANCE = 50;
const MIN_BET = 1;
const MAX_BET = 5000;
const MAX_WIN = 50000;
const STORAGE_KEY = "aviator-balance";
const HISTORY_KEY = "aviator-history";
const BREAK_TIME = 8; // seconds between rounds

/**
 * Generates a crash multiplier using a weighted random algorithm
 * Lower multipliers are more common than higher ones
 * Returns a value between 1.00x and ~100x
 */
// Generates a fair random multiplier similar to real Aviator algorithms
const generateCrashMultiplier = () => {
  const random = Math.random();

  if (random < 0.5) {
    // 50% chance of 1.00x - 2.00x
    return +(1 + Math.random()).toFixed(2);
  } else if (random < 0.8) {
    // 30% chance of 2.00x - 5.00x
    return +(2 + Math.random() * 3).toFixed(2);
  } else if (random < 0.95) {
    // 15% chance of 5.00x - 20.00x
    return +(5 + Math.random() * 15).toFixed(2);
  } else {
    // 5% chance of 20.00x - 200.00x
    return +(20 + Math.random() * 180).toFixed(2);
  }
};

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

interface HistoryEntry {
  multiplier: number;
  bet1Payout: number;
  bet2Payout: number;
  timestamp: number;
}

export const useGameLogic = () => {
  const [balance, setBalance] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseFloat(stored) : INITIAL_BALANCE;
  });
  
  const [bet1, setBet1] = useState<BetState>({
    amount: 100,
    active: false,
    cashedOut: false,
    autoBet: false,
    autoCashOut: false,
    autoCashOutAt: 2.0,
  });
  
  const [bet2, setBet2] = useState<BetState>({
    amount: 100,
    active: false,
    cashedOut: false,
    autoBet: false,
    autoCashOut: false,
    autoCashOutAt: 2.0,
  });
  
  const [multiplier, setMultiplier] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [countdown, setCountdown] = useState(BREAK_TIME);
  const [isBreak, setIsBreak] = useState(true);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Save balance and history to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  /**
   * Ends the current round:
   * - Handles crash logic for active bets (bets already lost if not cashed out)
   * - Records payouts for cashed out bets in history
   * - Updates history
   * - Starts break period
   */
  const endRound = useCallback((finalMultiplier: number) => {
    setCrashed(true);
    setIsPlaying(false);
    
    let bet1Payout = 0;
    let bet2Payout = 0;

    // Record payouts for cashed out bets (already added to balance during cashout)
    if (bet1.active && bet1.cashedOut && bet1.payout) {
      bet1Payout = bet1.payout;
    }
    if (bet2.active && bet2.cashedOut && bet2.payout) {
      bet2Payout = bet2.payout;
    }

    // Add to history
    const entry: HistoryEntry = {
      multiplier: finalMultiplier,
      bet1Payout,
      bet2Payout,
      timestamp: Date.now(),
    };
    setHistory((prev) => [entry, ...prev].slice(0, 10));

    toast.error(`Crashed at ${finalMultiplier.toFixed(2)}x!`);

    // Reset bets and start break period
    setBet1((prev) => ({ ...prev, active: false, cashedOut: false, payout: undefined }));
    setBet2((prev) => ({ ...prev, active: false, cashedOut: false, payout: undefined }));
    setIsBreak(true);
    setCountdown(BREAK_TIME);
  }, [bet1, bet2]);

  /**
   * Starts a new round:
   * - Auto-places bets if enabled
   * - Generates crash point
   * - Animates multiplier increase
   * - Handles crash logic
   */
  const startRound = useCallback(() => {
    // Auto-place bets if enabled and deduct from balance
    if (bet1.autoBet && !bet1.active && bet1.amount <= balance) {
      setBalance((prev) => prev - bet1.amount);
      setBet1((prev) => ({ ...prev, active: true, cashedOut: false }));
    }
    
    // Check balance again after potential bet1 deduction
    setBalance((currentBalance) => {
      if (bet2.autoBet && !bet2.active && bet2.amount <= currentBalance) {
        setBet2((prev) => ({ ...prev, active: true, cashedOut: false }));
        return currentBalance - bet2.amount;
      }
      return currentBalance;
    });

    setIsBreak(false);
    setIsPlaying(true);
    setCrashed(false);
    setMultiplier(1.0);

    const newCrashPoint = generateCrashMultiplier();

    // Multiplier increases over time with stable exponential growth
    // Uses the same algorithm as real Aviator games
    const interval = setInterval(() => {
      setMultiplier((prev) => {
        // Stable exponential growth: 1.5% increase per tick
        // This ensures consistent growth regardless of current multiplier
        const increment = prev * 0.015;
        const newMultiplier = prev + increment;
        
        // Auto cash out bet 1 if enabled and target reached
        setBet1((currentBet1) => {
          if (
            currentBet1.autoCashOut &&
            currentBet1.active &&
            !currentBet1.cashedOut &&
            currentBet1.autoCashOutAt &&
            newMultiplier >= currentBet1.autoCashOutAt
          ) {
            const payout = Math.min(currentBet1.amount * newMultiplier, MAX_WIN);
            setBalance((prev) => prev + payout);
            toast.success(`Bet 1 auto cashed out at ${newMultiplier.toFixed(2)}x! Won ${payout.toFixed(2)} ETB`);
            return {
              ...currentBet1,
              cashedOut: true,
              cashOutMultiplier: newMultiplier,
              payout,
            };
          }
          return currentBet1;
        });

        // Auto cash out bet 2 if enabled and target reached
        setBet2((currentBet2) => {
          if (
            currentBet2.autoCashOut &&
            currentBet2.active &&
            !currentBet2.cashedOut &&
            currentBet2.autoCashOutAt &&
            newMultiplier >= currentBet2.autoCashOutAt
          ) {
            const payout = Math.min(currentBet2.amount * newMultiplier, MAX_WIN);
            setBalance((prev) => prev + payout);
            toast.success(`Bet 2 auto cashed out at ${newMultiplier.toFixed(2)}x! Won ${payout.toFixed(2)} ETB`);
            return {
              ...currentBet2,
              cashedOut: true,
              cashOutMultiplier: newMultiplier,
              payout,
            };
          }
          return currentBet2;
        });
        
        // Check if we hit the crash point
        if (newMultiplier >= newCrashPoint) {
          clearInterval(interval);
          endRound(newCrashPoint);
          return newCrashPoint;
        }
        
        return newMultiplier;
      });
    }, 100);
  }, [bet1, bet2, endRound, balance]);

  // Countdown timer between rounds
  useEffect(() => {
    if (!isBreak) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Start new round automatically
          startRound();
          return BREAK_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreak, startRound]);

  /**
   * Places bet 1 for the next round
   * Validates amount and balance
   * Immediately deducts bet from balance
   */
  const placeBet1 = useCallback(() => {
    if (!isBreak) {
      toast.error("Wait for the next round!");
      return;
    }
    if (bet1.amount < MIN_BET) {
      toast.error(`Minimum bet is ${MIN_BET} ETB`);
      return;
    }
    if (bet1.amount > MAX_BET) {
      toast.error(`Maximum bet is ${MAX_BET} ETB`);
      return;
    }
    if (bet1.amount > balance) {
      toast.error("Insufficient balance!");
      return;
    }

    // Immediately deduct bet from balance
    setBalance((prev) => prev - bet1.amount);
    setBet1((prev) => ({ ...prev, active: true, cashedOut: false }));
    toast.success(`Bet 1 placed: ${bet1.amount} ETB`);
  }, [bet1.amount, balance, isBreak]);

  /**
   * Places bet 2 for the next round
   * Validates amount and balance
   * Immediately deducts bet from balance
   */
  const placeBet2 = useCallback(() => {
    if (!isBreak) {
      toast.error("Wait for the next round!");
      return;
    }
    if (bet2.amount < MIN_BET) {
      toast.error(`Minimum bet is ${MIN_BET} ETB`);
      return;
    }
    if (bet2.amount > MAX_BET) {
      toast.error(`Maximum bet is ${MAX_BET} ETB`);
      return;
    }
    if (bet2.amount > balance) {
      toast.error("Insufficient balance!");
      return;
    }

    // Immediately deduct bet from balance
    setBalance((prev) => prev - bet2.amount);
    setBet2((prev) => ({ ...prev, active: true, cashedOut: false }));
    toast.success(`Bet 2 placed: ${bet2.amount} ETB`);
  }, [bet2.amount, balance, isBreak]);

  /**
   * Cashes out bet 1 at current multiplier
   * Uses setMultiplier to get REAL-TIME multiplier value (no state lag)
   */
  const cashOut1 = useCallback(() => {
    if (!isPlaying || !bet1.active || bet1.cashedOut || crashed) return;

    // Get the REAL-TIME multiplier by reading it inside setMultiplier
    setMultiplier((currentMultiplier) => {
      const payout = Math.min(bet1.amount * currentMultiplier, MAX_WIN);
      
      setBalance((prev) => prev + payout);
      setBet1((prev) => ({ 
        ...prev, 
        cashedOut: true, 
        cashOutMultiplier: currentMultiplier,
        payout 
      }));
      
      toast.success(`Bet 1 cashed out at ${currentMultiplier.toFixed(2)}x! Won ${payout.toFixed(2)} ETB`);
      playSound("cashout");
      
      return currentMultiplier; // Don't change the multiplier
    });
  }, [isPlaying, bet1, crashed]);

  /**
   * Cashes out bet 2 at current multiplier
   * Uses setMultiplier to get REAL-TIME multiplier value (no state lag)
   */
  const cashOut2 = useCallback(() => {
    if (!isPlaying || !bet2.active || bet2.cashedOut || crashed) return;

    // Get the REAL-TIME multiplier by reading it inside setMultiplier
    setMultiplier((currentMultiplier) => {
      const payout = Math.min(bet2.amount * currentMultiplier, MAX_WIN);
      
      setBalance((prev) => prev + payout);
      setBet2((prev) => ({ 
        ...prev, 
        cashedOut: true, 
        cashOutMultiplier: currentMultiplier,
        payout 
      }));
      
      toast.success(`Bet 2 cashed out at ${currentMultiplier.toFixed(2)}x! Won ${payout.toFixed(2)} ETB`);
      playSound("cashout");
      
      return currentMultiplier; // Don't change the multiplier
    });
  }, [isPlaying, bet2, crashed]);

  const setBet1Amount = (amount: number) => {
    setBet1((prev) => ({ ...prev, amount }));
  };

  const setBet2Amount = (amount: number) => {
    setBet2((prev) => ({ ...prev, amount }));
  };

  const toggleAutoBet1 = useCallback(() => {
    setBet1((prev) => ({ ...prev, autoBet: !prev.autoBet }));
  }, []);

  const toggleAutoBet2 = useCallback(() => {
    setBet2((prev) => ({ ...prev, autoBet: !prev.autoBet }));
  }, []);

  const toggleAutoCashOut1 = useCallback(() => {
    setBet1((prev) => ({ ...prev, autoCashOut: !prev.autoCashOut }));
  }, []);

  const toggleAutoCashOut2 = useCallback(() => {
    setBet2((prev) => ({ ...prev, autoCashOut: !prev.autoCashOut }));
  }, []);

  const setAutoCashOutAt1 = useCallback((value: number) => {
    setBet1((prev) => ({ ...prev, autoCashOutAt: value }));
  }, []);

  const setAutoCashOutAt2 = useCallback((value: number) => {
    setBet2((prev) => ({ ...prev, autoCashOutAt: value }));
  }, []);

  const resetBalance = useCallback(() => {
    setBalance(INITIAL_BALANCE);
    setHistory([]);
    toast.success("Balance and history reset!");
  }, []);

  /**
   * Plays a simple sound effect using Web Audio API
   */
  const playSound = (type: "crash" | "cashout") => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (type === "crash") {
        oscillator.frequency.value = 200;
        gainNode.gain.value = 0.3;
        oscillator.type = "sawtooth";
      } else {
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.2;
        oscillator.type = "sine";
      }

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      // Silently fail if audio isn't supported
    }
  };

  /**
   * Calculates potential payout for active bets during flight
   * Note: These use the state multiplier which may lag slightly,
   * but actual cashout uses real-time multiplier
   */
  const getPotentialPayout1 = () => {
    if (!bet1.active || bet1.cashedOut) return 0;
    return Math.round(Math.min(bet1.amount * multiplier, MAX_WIN) * 100) / 100;
  };

  const getPotentialPayout2 = () => {
    if (!bet2.active || bet2.cashedOut) return 0;
    return Math.round(Math.min(bet2.amount * multiplier, MAX_WIN) * 100) / 100;
  };

  return {
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
    canCashOut1: isPlaying && bet1.active && !bet1.cashedOut && !crashed,
    canCashOut2: isPlaying && bet2.active && !bet2.cashedOut && !crashed,
    toggleAutoBet1,
    toggleAutoBet2,
    toggleAutoCashOut1,
    toggleAutoCashOut2,
    setAutoCashOutAt1,
    setAutoCashOutAt2,
  };
};

import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

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

interface GameState {
  multiplier: number;
  isPlaying: boolean;
  crashed: boolean;
  isBreak: boolean;
  countdown: number;
  crashPoint: number;
}

interface RoundBet {
  socketId: string;
  playerName: string;
  betId: string;
  amount: number;
  cashedOut: boolean;
  cashOutMultiplier?: number;
  payout?: number;
  result: 'active' | 'won' | 'lost';
}

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

export const useMultiplayerGame = () => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [socketId, setSocketId] = useState<string>('');
  const [balance, setBalance] = useState(200);
  const [playerName, setPlayerName] = useState('');
  const [roundBets, setRoundBets] = useState<RoundBet[]>([]);
  const [crashHistory, setCrashHistory] = useState<number[]>([]);
  const [onlinePlayers, setOnlinePlayers] = useState<OnlinePlayer[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [balanceRequestPending, setBalanceRequestPending] = useState(false);
  
  const [bet1, setBet1] = useState<BetState>({
    amount: 10,
    active: false,
    cashedOut: false,
    autoBet: false,
    autoCashOut: false,
    autoCashOutAt: 2.0,
  });
  
  const [bet2, setBet2] = useState<BetState>({
    amount: 10,
    active: false,
    cashedOut: false,
    autoBet: false,
    autoCashOut: false,
    autoCashOutAt: 2.0,
  });
  
  const [gameState, setGameState] = useState<GameState>({
    multiplier: 1.0,
    isPlaying: false,
    crashed: false,
    isBreak: true,
    countdown: 8,
    crashPoint: 0,
  });

  useEffect(() => {
    const socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
    });
    
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
      setSocketId(socket.id || '');
      toast.success('Connected to game server!');
      
      // Send player name if set
      const storedName = localStorage.getItem('aviator-player-name');
      if (storedName) {
        setPlayerName(storedName);
        socket.emit('setPlayerName', { name: storedName });
      }
      
      // Request online players list after connection
      setTimeout(() => {
        console.log('🔄 Requesting online players list...');
        socket.emit('requestOnlinePlayers');
      }, 500);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
      toast.error('Disconnected from server');
    });

    socket.on('gameState', (state: GameState & { balance: number }) => {
      setGameState({
        multiplier: state.multiplier,
        isPlaying: state.isPlaying,
        crashed: state.crashed,
        isBreak: state.isBreak,
        countdown: state.countdown,
        crashPoint: state.crashPoint,
      });
      setBalance(state.balance);
    });

    socket.on('roundBetsUpdate', ({ bets }: { bets: RoundBet[] }) => {
      setRoundBets(bets);
    });

    socket.on('crashHistoryUpdate', ({ history }: { history: number[] }) => {
      setCrashHistory(history);
    });

    socket.on('onlinePlayersUpdate', ({ players }: { players: OnlinePlayer[] }) => {
      console.log('📥 Received online players update');
      console.log('📊 Number of players received:', players?.length || 0);
      if (players && players.length > 0) {
        console.log('👥 Players received:');
        players.forEach((p, i) => {
          console.log(`  ${i + 1}. ${p.name} (${p.socketId.substring(0, 8)}...) - ${p.balance} birr`);
        });
      } else {
        console.warn('⚠️ Received empty or invalid players array');
      }
      console.log('💾 Setting onlinePlayers state with', players?.length || 0, 'players');
      setOnlinePlayers(players || []);
    });
    
    console.log('✅ Socket listeners registered');

    socket.on('roundStart', ({ crashPoint }: { crashPoint: number }) => {
      setGameState(prev => ({
        ...prev,
        isPlaying: true,
        crashed: false,
        isBreak: false,
        multiplier: 1.0,
        crashPoint,
      }));
      
      setTimeout(() => {
        setBet1(prev => {
          if (prev.autoBet && !prev.active) {
            socket.emit('placeBet', { betId: 'bet1', amount: prev.amount });
          }
          return prev;
        });
        setBet2(prev => {
          if (prev.autoBet && !prev.active) {
            socket.emit('placeBet', { betId: 'bet2', amount: prev.amount });
          }
          return prev;
        });
      }, 100);
    });

    socket.on('multiplierUpdate', ({ multiplier }: { multiplier: number }) => {
      setGameState(prev => ({ ...prev, multiplier }));
      
      setBet1(prev => {
        if (prev.autoCashOut && prev.active && !prev.cashedOut && prev.autoCashOutAt && multiplier >= prev.autoCashOutAt) {
          // Send target multiplier for exact cashout
          socket.emit('cashOut', { betId: 'bet1', targetMultiplier: prev.autoCashOutAt });
        }
        return prev;
      });
      
      setBet2(prev => {
        if (prev.autoCashOut && prev.active && !prev.cashedOut && prev.autoCashOutAt && multiplier >= prev.autoCashOutAt) {
          // Send target multiplier for exact cashout
          socket.emit('cashOut', { betId: 'bet2', targetMultiplier: prev.autoCashOutAt });
        }
        return prev;
      });
    });

    socket.on('roundEnd', ({ crashPoint }: { crashPoint: number }) => {
      setGameState(prev => ({
        ...prev,
        crashed: true,
        isPlaying: false,
        multiplier: crashPoint,
      }));
      
      // CRITICAL: Fully reset bet states (clear all previous round data)
      setBet1(prev => ({ 
        ...prev, 
        active: false, 
        cashedOut: false, 
        payout: undefined,
        cashOutMultiplier: undefined 
      }));
      setBet2(prev => ({ 
        ...prev, 
        active: false, 
        cashedOut: false, 
        payout: undefined,
        cashOutMultiplier: undefined 
      }));
      
      toast.error(`Crashed at ${crashPoint.toFixed(2)}x!`);
    });

    socket.on('countdown', ({ countdown }: { countdown: number }) => {
      setGameState(prev => ({ ...prev, countdown, isBreak: true }));
    });

    socket.on('betPlaced', ({ betId, amount, balance: newBalance, forNextRound }: any) => {
      setBalance(newBalance);
      if (betId === 'bet1') {
        setBet1(prev => ({ ...prev, active: true, cashedOut: false }));
        if (forNextRound) {
          toast.success(`Bet 1 placed for NEXT round: ${amount} birr`);
        } else {
          toast.success(`Bet 1 placed: ${amount} birr`);
        }
      } else {
        setBet2(prev => ({ ...prev, active: true, cashedOut: false }));
        if (forNextRound) {
          toast.success(`Bet 2 placed for NEXT round: ${amount} birr`);
        } else {
          toast.success(`Bet 2 placed: ${amount} birr`);
        }
      }
    });

    socket.on('betError', ({ message }: { message: string }) => {
      toast.error(message);
    });

    socket.on('cashedOut', ({ betId, multiplier, payout, balance: newBalance }: any) => {
      setBalance(newBalance);
      
      // Play cash-out sound
      const cashOutSound = new Audio('/cash.mp3');
      cashOutSound.volume = 0.6;
      cashOutSound.play().catch(() => {
        console.log('Cash-out sound failed to play.');
      });
      
      if (betId === 'bet1') {
        setBet1(prev => ({ ...prev, cashedOut: true, cashOutMultiplier: multiplier, payout }));
        toast.success(`Bet 1 cashed out at ${multiplier.toFixed(2)}x! Won ${payout.toFixed(2)} birr`);
      } else {
        setBet2(prev => ({ ...prev, cashedOut: true, cashOutMultiplier: multiplier, payout }));
        toast.success(`Bet 2 cashed out at ${multiplier.toFixed(2)}x! Won ${payout.toFixed(2)} birr`);
      }
    });

    socket.on('cashOutError', ({ message }: { message: string }) => {
      toast.error(message);
    });

    // Round bets update
    socket.on('roundBetsUpdate', ({ bets }: { bets: RoundBet[] }) => {
      setRoundBets(bets);
    });

    // Admin status
    socket.on('adminStatus', ({ isAdmin: adminStatus }: { isAdmin: boolean }) => {
      setIsAdmin(adminStatus);
      if (adminStatus) {
        toast.success('Admin access granted!');
      }
    });

    // Admin auth error
    socket.on('adminAuthError', ({ message }: { message: string }) => {
      toast.error(message);
    });

    // Balance request sent
    socket.on('balanceRequestSent', ({ message }: { message: string }) => {
      setBalanceRequestPending(true);
      toast.success(message);
    });

    // Balance updated
    socket.on('balanceUpdated', ({ newBalance, amountAdded, grantedBy }: { newBalance: number; amountAdded: number; grantedBy: string }) => {
      setBalance(newBalance);
      setBalanceRequestPending(false);
      toast.success(`Received ${amountAdded.toFixed(2)} ETB from ${grantedBy}!`);
    });

    // Balance request denied
    socket.on('balanceRequestDenied', ({ reason }: { reason?: string }) => {
      setBalanceRequestPending(false);
      toast.error(reason || 'Your balance request was denied');
    });

    // Pending requests (for admins)
    socket.on('pendingRequests', ({ requests }: { requests: PendingRequest[] }) => {
      setPendingRequests(requests);
    });

    // New balance request (for admins)
    socket.on('balanceRequest', (request: PendingRequest) => {
      setPendingRequests(prev => [...prev, request]);
      toast.info(`New balance request from ${request.playerName}`);
    });

    // Grant success (for admins)
    socket.on('grantSuccess', ({ targetSocketId, amount }: { targetSocketId: string; amount: number }) => {
      toast.success(`Successfully granted ${amount.toFixed(2)} ETB`);
    });

    // Grant error (for admins)
    socket.on('grantError', ({ message }: { message: string }) => {
      toast.error(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const placeBet1 = useCallback(() => {
    if (!socketRef.current || !connected) {
      toast.error('Not connected to server');
      return;
    }
    // Only allow betting during break period
    if (!gameState.isBreak) {
      toast.error('Cannot bet during active round! Wait for next round.');
      return;
    }
    // Ensure amount is sent as a number
    const betAmount = parseFloat(bet1.amount.toString());
    console.log(`Placing Bet 1: ${betAmount} (type: ${typeof betAmount})`);
    socketRef.current.emit('placeBet', { betId: 'bet1', amount: betAmount });
  }, [connected, bet1.amount, gameState.isBreak]);

  const placeBet2 = useCallback(() => {
    if (!socketRef.current || !connected) {
      toast.error('Not connected to server');
      return;
    }
    // Only allow betting during break period
    if (!gameState.isBreak) {
      toast.error('Cannot bet during active round! Wait for next round.');
      return;
    }
    // Ensure amount is sent as a number
    const betAmount = parseFloat(bet2.amount.toString());
    console.log(`Placing Bet 2: ${betAmount} (type: ${typeof betAmount})`);
    socketRef.current.emit('placeBet', { betId: 'bet2', amount: betAmount });
  }, [connected, bet2.amount, gameState.isBreak]);

  const cashOut1 = useCallback(() => {
    if (!socketRef.current || !connected) return;
    if (!gameState.isPlaying || !bet1.active || bet1.cashedOut || gameState.crashed) return;
    socketRef.current.emit('cashOut', { betId: 'bet1' });
  }, [connected, gameState.isPlaying, gameState.crashed, bet1.active, bet1.cashedOut]);

  const cashOut2 = useCallback(() => {
    if (!socketRef.current || !connected) return;
    if (!gameState.isPlaying || !bet2.active || bet2.cashedOut || gameState.crashed) return;
    socketRef.current.emit('cashOut', { betId: 'bet2' });
  }, [connected, gameState.isPlaying, gameState.crashed, bet2.active, bet2.cashedOut]);

  const setBet1Amount = (amount: number) => {
    const numAmount = parseFloat(amount.toString());
    console.log(`Set Bet 1 Amount: ${numAmount} (type: ${typeof numAmount})`);
    setBet1(prev => ({ ...prev, amount: numAmount }));
  };
  
  const setBet2Amount = (amount: number) => {
    const numAmount = parseFloat(amount.toString());
    console.log(`Set Bet 2 Amount: ${numAmount} (type: ${typeof numAmount})`);
    setBet2(prev => ({ ...prev, amount: numAmount }));
  };
  const toggleAutoBet1 = useCallback(() => setBet1(prev => ({ ...prev, autoBet: !prev.autoBet })), []);
  const toggleAutoBet2 = useCallback(() => setBet2(prev => ({ ...prev, autoBet: !prev.autoBet })), []);
  const toggleAutoCashOut1 = useCallback(() => setBet1(prev => ({ ...prev, autoCashOut: !prev.autoCashOut })), []);
  const toggleAutoCashOut2 = useCallback(() => setBet2(prev => ({ ...prev, autoCashOut: !prev.autoCashOut })), []);
  const setAutoCashOutAt1 = useCallback((value: number) => setBet1(prev => ({ ...prev, autoCashOutAt: value })), []);
  const setAutoCashOutAt2 = useCallback((value: number) => setBet2(prev => ({ ...prev, autoCashOutAt: value })), []);

  // Update player name function
  const updatePlayerName = useCallback((name: string) => {
    console.log('🏷️ Setting player name:', name);
    setPlayerName(name);
    localStorage.setItem('aviator-player-name', name);
    if (socketRef.current && connected) {
      console.log('📤 Sending setPlayerName to server:', name);
      socketRef.current.emit('setPlayerName', { name });
    } else {
      console.warn('⚠️ Cannot send name - not connected:', { connected, hasSocket: !!socketRef.current });
    }
  }, [connected]);

  const getPotentialPayout1 = () => {
    if (!bet1.active || bet1.cashedOut) return 0;
    return Math.min(bet1.amount * gameState.multiplier, 10000);
  };

  const getPotentialPayout2 = () => {
    if (!bet2.active || bet2.cashedOut) return 0;
    return Math.min(bet2.amount * gameState.multiplier, 10000);
  };

  const refreshOnlinePlayers = useCallback(() => {
    if (socketRef.current && connected) {
      console.log('🔄 Manually requesting online players list');
      socketRef.current.emit('requestOnlinePlayers');
    } else {
      console.warn('⚠️ Cannot refresh - not connected');
    }
  }, [connected]);

  // Admin functions
  const authenticateAdmin = useCallback((password: string) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('authenticateAdmin', { password });
    }
  }, [connected]);

  const requestBalance = useCallback((amount?: number) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('requestBalance', { amount });
    }
  }, [connected]);

  const grantBalance = useCallback((targetSocketId: string, amount: number) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('grantBalance', { targetSocketId, amount });
    }
  }, [connected]);

  const denyBalanceRequest = useCallback((targetSocketId: string, reason?: string) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('denyBalanceRequest', { targetSocketId, reason });
    }
  }, [connected]);

  return {
    connected,
    socketId,
    balance,
    bet1,
    bet2,
    multiplier: gameState.multiplier,
    isPlaying: gameState.isPlaying,
    crashed: gameState.crashed,
    countdown: gameState.countdown,
    isBreak: gameState.isBreak,
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
    canCashOut1: gameState.isPlaying && bet1.active && !bet1.cashedOut && !gameState.crashed,
    canCashOut2: gameState.isPlaying && bet2.active && !bet2.cashedOut && !gameState.crashed,
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
  };
};

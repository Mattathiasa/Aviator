import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Admin configuration
const adminConfig = {
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  authenticatedAdmins: new Set(),
  maxGrantAmount: parseInt(process.env.MAX_GRANT_AMOUNT) || 10000,
  minGrantAmount: parseInt(process.env.MIN_GRANT_AMOUNT) || 1
};

// Helper function to check if user is admin
const isAdmin = (socketId) => {
  return adminConfig.authenticatedAdmins.has(socketId);
};

// Balance request queue
const balanceRequests = new Map();
// Key: socketId, Value: { socketId, playerName, currentBalance, requestedAt, status }

// Helper functions for balance requests
const addBalanceRequest = (socketId, playerName, currentBalance) => {
  balanceRequests.set(socketId, {
    socketId,
    playerName,
    currentBalance,
    requestedAt: Date.now(),
    status: 'pending'
  });
};

const removeBalanceRequest = (socketId) => {
  balanceRequests.delete(socketId);
};

const getPendingRequests = () => {
  return Array.from(balanceRequests.values()).filter(req => req.status === 'pending');
};

// Clean up expired requests (older than 5 minutes)
setInterval(() => {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  for (const [socketId, request] of balanceRequests.entries()) {
    if (now - request.requestedAt > fiveMinutes) {
      balanceRequests.delete(socketId);
      console.log(`🧹 Cleaned up expired balance request from ${request.playerName}`);
    }
  }
}, 60000); // Check every minute

// Game state
let gameState = {
  multiplier: 1.0,
  isPlaying: false,
  crashed: false,
  isBreak: true,
  countdown: 8,
  crashPoint: 0,
  startTime: null
};

// Player balances (stored per socket ID)
const players = new Map();

// Active round bets (bets for current round)
let roundBets = [];

// Next round bets (bets placed during current round for next round)
let nextRoundBets = [];

// Crash history (last 20 crashes, newest first)
let crashHistory = [];

// Generate crash multiplier
const generateCrashMultiplier = () => {
  const random = Math.random();
  if (random < 0.5) return +(1 + Math.random()).toFixed(2);
  else if (random < 0.8) return +(2 + Math.random() * 3).toFixed(2);
  else if (random < 0.95) return +(5 + Math.random() * 15).toFixed(2);
  else return +(20 + Math.random() * 180).toFixed(2);
};

// Start a new round
const startRound = () => {
  gameState.isBreak = false;
  gameState.isPlaying = true;
  gameState.crashed = false;
  gameState.multiplier = 1.0;
  gameState.crashPoint = generateCrashMultiplier();
  gameState.startTime = Date.now();
  
  // Move next round bets to current round bets
  // roundBets should already have bets from countdown
  // nextRoundBets will be empty at start, but may get bets during the round
  
  console.log(`🚀 Round started! Crash point: ${gameState.crashPoint.toFixed(2)}x`);
  io.emit('roundStart', { crashPoint: gameState.crashPoint });
  // Broadcast current bets so all players see who's playing
  io.emit('roundBetsUpdate', { bets: roundBets });
  
  // Multiplier update loop with TIME-BASED calculation
  // This eliminates drift and ensures perfect accuracy for all bet sizes
  const interval = setInterval(() => {
    if (!gameState.isPlaying) {
      clearInterval(interval);
      return;
    }

    // Calculate multiplier based on elapsed time (no drift, no accumulation errors)
    const elapsedMs = Date.now() - gameState.startTime;
    const ticks = Math.floor(elapsedMs / 100);
    
    // True exponential growth: multiplier = 1.015^ticks
    gameState.multiplier = parseFloat(Math.pow(1.015, ticks).toFixed(2));
    
    // Broadcast multiplier update
    io.emit('multiplierUpdate', { multiplier: gameState.multiplier });
    
    // Check if crashed
    if (gameState.multiplier >= gameState.crashPoint) {
      clearInterval(interval);
      endRound();
    }
  }, 100);
};

// End the round
const endRound = () => {
  gameState.crashed = true;
  gameState.isPlaying = false;
  gameState.multiplier = gameState.crashPoint;
  
  // Mark all uncashed bets as lost
  roundBets.forEach(bet => {
    if (!bet.cashedOut) {
      bet.result = 'lost';
      bet.cashOutMultiplier = 0;
    }
  });
  
  // CRITICAL: Clear all active bets from all players
  players.forEach((player) => {
    player.activeBets = [];
  });
  
  console.log(`💥 Round crashed at ${gameState.crashPoint.toFixed(2)}x`);
  
  // Add to crash history (newest first, limit to 20)
  crashHistory.unshift(gameState.crashPoint);
  if (crashHistory.length > 20) {
    crashHistory = crashHistory.slice(0, 20);
  }
  
  io.emit('roundEnd', { 
    crashPoint: gameState.crashPoint,
    multiplier: gameState.crashPoint 
  });
  
  // Send final bet results and updated history
  io.emit('roundBetsUpdate', { bets: roundBets });
  io.emit('crashHistoryUpdate', { history: crashHistory });
  
  // Start break period
  gameState.isBreak = true;
  gameState.countdown = 8;
  startCountdown();
};

// Countdown between rounds
const startCountdown = () => {
  // Reset round bets at the START of countdown (preparing for next round)
  // This gives players time to see the previous round results before they disappear
  setTimeout(() => {
    // Move next round bets to current round bets
    roundBets = [...nextRoundBets];
    nextRoundBets = [];
    io.emit('roundBetsUpdate', { bets: roundBets });
  }, 2000); // Clear after 2 seconds, giving time to see results
  
  const countdownInterval = setInterval(() => {
    gameState.countdown--;
    io.emit('countdown', { countdown: gameState.countdown });
    
    if (gameState.countdown <= 0) {
      clearInterval(countdownInterval);
      startRound();
    }
  }, 1000);
};

// Helper function to broadcast online players list
const broadcastOnlinePlayers = () => {
  console.log('🔄 broadcastOnlinePlayers called');
  console.log('📊 Players Map size:', players.size);
  console.log('📊 Players Map entries:', Array.from(players.entries()));
  
  const onlinePlayers = Array.from(players.entries()).map(([socketId, player]) => ({
    socketId,
    name: player.name,
    balance: player.balance
  }));
  
  console.log(`📡 Broadcasting ${onlinePlayers.length} online players:`);
  onlinePlayers.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name} (${p.socketId.substring(0, 8)}...) - ${p.balance} birr`);
  });
  console.log(`📡 Total connected sockets: ${io.sockets.sockets.size}`);
  
  io.emit('onlinePlayersUpdate', { players: onlinePlayers });
  console.log(`✅ Broadcast sent to all clients`);
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`✅ Player connected: ${socket.id}`);
  
  // Initialize player with starting balance
  if (!players.has(socket.id)) {
    players.set(socket.id, {
      balance: 0,
      activeBets: [],
      name: 'Player', // Default name
      isAdmin: false,
      balanceHistory: []
    });
  }
  
  // Send current game state to new player
  socket.emit('gameState', {
    ...gameState,
    balance: players.get(socket.id).balance
  });
  
  // Send admin status
  socket.emit('adminStatus', { isAdmin: isAdmin(socket.id) });
  
  // Send current round bets
  socket.emit('roundBetsUpdate', { bets: roundBets });
  
  // Send crash history
  socket.emit('crashHistoryUpdate', { history: crashHistory });
  
  // If admin, send pending requests
  if (isAdmin(socket.id)) {
    socket.emit('pendingRequests', { requests: getPendingRequests() });
  }
  
  // Broadcast updated online players list
  broadcastOnlinePlayers();
  
  // Handle request for online players list
  socket.on('requestOnlinePlayers', () => {
    console.log(`🔄 Player ${socket.id} requested online players list`);
    broadcastOnlinePlayers();
  });
  
  // Handle player name update
  socket.on('setPlayerName', ({ name }) => {
    const player = players.get(socket.id);
    if (player) {
      player.name = name || 'Player';
      console.log(`👤 Player ${socket.id} set name to: ${player.name}`);
      // Broadcast updated players list when name changes
      broadcastOnlinePlayers();
    }
  });
  
  // Handle admin authentication
  socket.on('authenticateAdmin', ({ password }) => {
    if (password === adminConfig.adminPassword) {
      adminConfig.authenticatedAdmins.add(socket.id);
      const player = players.get(socket.id);
      if (player) {
        player.isAdmin = true;
      }
      socket.emit('adminStatus', { isAdmin: true });
      socket.emit('pendingRequests', { requests: getPendingRequests() });
      console.log(`🔐 Admin authenticated: ${socket.id}`);
    } else {
      socket.emit('adminAuthError', { message: 'Invalid admin password' });
      console.log(`❌ Failed admin authentication attempt: ${socket.id}`);
    }
  });
  
  // Handle balance request
  socket.on('requestBalance', ({ amount }) => {
    const player = players.get(socket.id);
    if (!player) return;
    
    // Add to request queue
    addBalanceRequest(socket.id, player.name, player.balance);
    
    // Notify all admins
    const request = {
      socketId: socket.id,
      playerName: player.name,
      currentBalance: player.balance,
      requestedAmount: amount,
      requestedAt: Date.now()
    };
    
    // Broadcast to all admin clients
    for (const adminSocketId of adminConfig.authenticatedAdmins) {
      io.to(adminSocketId).emit('balanceRequest', request);
    }
    
    // Confirm to requesting player
    socket.emit('balanceRequestSent', { message: 'Your request has been sent to admins' });
    
    console.log(`💰 Balance request from ${player.name} (${socket.id})`);
  });
  
  // Handle balance grant
  socket.on('grantBalance', ({ targetSocketId, amount }) => {
    // Verify admin status
    if (!isAdmin(socket.id)) {
      console.log(`⚠️ Unauthorized balance grant attempt from ${socket.id}`);
      return;
    }
    
    // Validate amount
    if (amount < adminConfig.minGrantAmount || amount > adminConfig.maxGrantAmount) {
      socket.emit('grantError', { message: `Amount must be between ${adminConfig.minGrantAmount} and ${adminConfig.maxGrantAmount} ETB` });
      return;
    }
    
    // Get target player
    const targetPlayer = players.get(targetSocketId);
    if (!targetPlayer) {
      socket.emit('grantError', { message: 'Player not found or disconnected' });
      return;
    }
    
    // Update balance
    targetPlayer.balance += amount;
    targetPlayer.balanceHistory.push({
      timestamp: Date.now(),
      amount: amount,
      type: 'grant',
      grantedBy: socket.id
    });
    
    // Remove from request queue if exists
    removeBalanceRequest(targetSocketId);
    
    // Notify target player
    const adminPlayer = players.get(socket.id);
    io.to(targetSocketId).emit('balanceUpdated', {
      newBalance: targetPlayer.balance,
      amountAdded: amount,
      grantedBy: adminPlayer ? adminPlayer.name : 'Admin'
    });
    
    // Confirm to admin
    socket.emit('grantSuccess', { 
      targetSocketId, 
      amount, 
      newBalance: targetPlayer.balance 
    });
    
    // Broadcast updated players list
    broadcastOnlinePlayers();
    
    // Update all admins with new pending requests
    for (const adminSocketId of adminConfig.authenticatedAdmins) {
      io.to(adminSocketId).emit('pendingRequests', { requests: getPendingRequests() });
    }
    
    console.log(`💵 Admin ${adminPlayer ? adminPlayer.name : socket.id} granted ${amount} ETB to ${targetPlayer.name}`);
  });
  
  // Handle balance request denial
  socket.on('denyBalanceRequest', ({ targetSocketId, reason }) => {
    // Verify admin status
    if (!isAdmin(socket.id)) {
      console.log(`⚠️ Unauthorized balance denial attempt from ${socket.id}`);
      return;
    }
    
    // Remove from request queue
    removeBalanceRequest(targetSocketId);
    
    // Notify target player
    io.to(targetSocketId).emit('balanceRequestDenied', {
      reason: reason || 'Your balance request was denied'
    });
    
    // Update all admins with new pending requests
    for (const adminSocketId of adminConfig.authenticatedAdmins) {
      io.to(adminSocketId).emit('pendingRequests', { requests: getPendingRequests() });
    }
    
    const targetPlayer = players.get(targetSocketId);
    const adminPlayer = players.get(socket.id);
    console.log(`❌ Admin ${adminPlayer ? adminPlayer.name : socket.id} denied balance request from ${targetPlayer ? targetPlayer.name : targetSocketId}`);
  });
  
  // Handle bet placement
  socket.on('placeBet', ({ betId, amount }) => {
    const player = players.get(socket.id);
    
    // Allow betting anytime - bets placed during a round will be for the NEXT round
    // No need to check isBreak anymore
    
    // CRITICAL: Convert to number first (might come as string from client)
    amount = parseFloat(amount);
    
    // Validate it's a valid number
    if (isNaN(amount)) {
      socket.emit('betError', { message: 'Invalid bet amount!' });
      return;
    }
    
    // Round amount to 2 decimals
    amount = Math.round(amount * 100) / 100;
    
    if (amount < 1 || amount > 5000) {
      socket.emit('betError', { message: 'Invalid bet amount!' });
      return;
    }
    
    if (amount > player.balance) {
      socket.emit('betError', { message: 'Insufficient balance!' });
      return;
    }
    
    // Deduct bet from balance
    const oldBalance = player.balance;
    player.balance = Math.round((player.balance - amount) * 100) / 100;
    player.activeBets.push({ betId, amount, cashedOut: false });
    
    console.log(`💰 BET PLACED: Player=${player.name}, BetId=${betId}, Amount=${amount}, OldBalance=${oldBalance}, NewBalance=${player.balance}`);
    
    // Determine which array to add bet to
    const targetBets = gameState.isPlaying ? nextRoundBets : roundBets;
    const betData = {
      socketId: socket.id,
      playerName: player.name,
      betId,
      amount,
      cashedOut: false,
      result: 'active'
    };
    
    // Add or update bet in the appropriate array
    const existingBetIndex = targetBets.findIndex(b => b.socketId === socket.id && b.betId === betId);
    if (existingBetIndex >= 0) {
      targetBets[existingBetIndex] = betData;
    } else {
      targetBets.push(betData);
    }
    
    socket.emit('betPlaced', { 
      betId, 
      amount, 
      balance: player.balance,
      forNextRound: gameState.isPlaying // Tell client if bet is for next round
    });
    
    // Broadcast updated bets to all players (only current round bets)
    io.emit('roundBetsUpdate', { bets: roundBets });
    
    // Broadcast updated players list (balance changed)
    broadcastOnlinePlayers();
    
    if (gameState.isPlaying) {
      console.log(`💰 Player ${player.name} placed bet ${betId} for NEXT round: ${amount} birr`);
    } else {
      console.log(`💰 Player ${player.name} placed bet ${betId}: ${amount} birr`);
    }
  });
  
  // Handle cash out
  socket.on('cashOut', ({ betId, targetMultiplier }) => {
    const player = players.get(socket.id);
    const bet = player.activeBets.find(b => b.betId === betId && !b.cashedOut);
    
    if (!bet) {
      socket.emit('cashOutError', { message: 'No active bet found!' });
      return;
    }
    
    if (!gameState.isPlaying || gameState.crashed) {
      socket.emit('cashOutError', { message: 'Cannot cash out now!' });
      return;
    }
    
    // CRITICAL: Ensure bet.amount is a number (convert if needed)
    const betAmount = parseFloat(bet.amount);
    
    // Calculate EXACT multiplier based on elapsed time (no lag, no drift)
    const elapsedMs = Date.now() - gameState.startTime;
    const ticks = Math.floor(elapsedMs / 100);
    const currentMultiplier = parseFloat(Math.pow(1.015, ticks).toFixed(2));
    
    // For auto cashout, use the target multiplier if provided and valid
    let cashoutMultiplier = currentMultiplier;
    if (targetMultiplier && targetMultiplier > 0 && targetMultiplier <= currentMultiplier) {
      cashoutMultiplier = parseFloat(targetMultiplier.toFixed(2));
      console.log(`🎯 AUTO CASHOUT: Using target multiplier ${cashoutMultiplier} instead of current ${currentMultiplier}`);
    }
    
    // Calculate raw payout using the cashout multiplier
    const rawPayout = betAmount * cashoutMultiplier;
    console.log(`🔍 CASHOUT CALCULATION: Bet=${betAmount}, Ticks=${ticks}, Multiplier=${cashoutMultiplier}, Raw=${rawPayout}`);
    
    // Calculate payout: bet amount × multiplier (rounded to 2 decimals, capped at 10000)
    const payout = Math.round(Math.min(rawPayout, 10000) * 100) / 100;
    const oldBalance = player.balance;
    player.balance = Math.round((player.balance + payout) * 100) / 100;
    
    console.log(`💰 PAYOUT: Raw=${rawPayout}, Capped=${payout}, OldBalance=${oldBalance}, NewBalance=${player.balance}`);
    
    bet.cashedOut = true;
    bet.cashOutMultiplier = cashoutMultiplier;
    bet.payout = payout;
    
    // Update round bet
    const roundBet = roundBets.find(b => b.socketId === socket.id && b.betId === betId);
    if (roundBet) {
      roundBet.cashedOut = true;
      roundBet.cashOutMultiplier = cashoutMultiplier;
      roundBet.payout = payout;
      roundBet.result = 'won';
    }
    
    console.log(`💵 CASHOUT: Player=${player.name}, BetAmount=${betAmount} (type: ${typeof betAmount}), Multiplier=${currentMultiplier.toFixed(2)}, Payout=${payout}, OldBalance=${oldBalance}, NewBalance=${player.balance}`);
    
    socket.emit('cashedOut', {
      betId,
      multiplier: cashoutMultiplier,
      payout,
      balance: player.balance
    });
    
    // Broadcast updated bets to all players
    io.emit('roundBetsUpdate', { bets: roundBets });
    
    // Broadcast updated players list (balance changed)
    broadcastOnlinePlayers();
    
    console.log(`💵 Player ${player.name} cashed out bet ${betId} at ${gameState.multiplier.toFixed(2)}x: ${payout.toFixed(2)} birr`);
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`❌ Player disconnected: ${socket.id}`);
    // Remove player from the list
    players.delete(socket.id);
    // Broadcast updated online players list
    broadcastOnlinePlayers();
  });
});

// Start the first countdown
startCountdown();

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🎮 Aviator Server running on port ${PORT}`);
  console.log(`📱 Connect from other devices using: http://<YOUR_LOCAL_IP>:${PORT}`);
  console.log(`💻 Local: http://localhost:${PORT}`);
});
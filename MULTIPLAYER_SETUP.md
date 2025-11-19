# Multiplayer Aviator Game - Setup Instructions

## Overview
This is a real-time multiplayer Aviator game where all connected devices see the same multiplier, crash timing, and can bet in real-time using Socket.IO.

## Features
✅ Real-time synchronization across all devices
✅ Server-controlled game logic (multiplier, crash point)
✅ Each player starts with 50,000 birr
✅ Min bet: 1 birr, Max bet: 5,000 birr
✅ Max win: 50,000 birr per round
✅ 8-second countdown between rounds
✅ Accelerating multiplier (speeds up as it increases)
✅ Auto-bet and auto-cashout features
✅ Two simultaneous bets per player

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Game

### Step 1: Start the Server

Open a terminal and run:
```bash
node server/index.js
```

You should see:
```
🎮 Aviator Server running on port 3001
📱 Connect from other devices using: http://<YOUR_LOCAL_IP>:3001
💻 Local: http://localhost:3001
```

The server will automatically start the game loop with 8-second countdowns between rounds.

### Step 2: Start the Client (React App)

Open a **new terminal** and run:
```bash
npm run dev
```

This will start the Vite development server (usually on http://localhost:5173).

### Step 3: Access the Game

**On your PC:**
- Open your browser and go to: `http://localhost:5173/multiplayer`

**On phones/tablets (same Wi-Fi network):**

1. Find your PC's local IP address:
   - **Windows**: Open Command Prompt and type `ipconfig`, look for "IPv4 Address" (e.g., 192.168.1.100)
   - **Mac/Linux**: Open Terminal and type `ifconfig` or `ip addr`, look for your local IP

2. Update the `.env` file on your PC:
   ```
   VITE_SERVER_URL=http://192.168.1.100:3001
   ```
   (Replace `192.168.1.100` with your actual local IP)

3. Restart the React dev server (Ctrl+C and run `npm run dev` again)

4. On your phone's browser, navigate to:
   ```
   http://192.168.1.100:5173/multiplayer
   ```
   (Replace `192.168.1.100` with your PC's IP)

## Game Rules

### Betting
- Place bets during the 8-second countdown
- You can place up to 2 bets simultaneously
- Min bet: 1 birr, Max bet: 5,000 birr
- Bets are deducted from your balance immediately

### Playing
- The plane takes off and the multiplier starts at 1.00x
- The multiplier increases gradually, speeding up as it gets higher
- Cash out before the plane crashes to win
- Your payout = bet amount × multiplier at cash out
- Maximum win per round: 50,000 birr

### Auto Features
- **Auto Bet**: Automatically places your bet each round
- **Auto Cash Out**: Automatically cashes out at your specified multiplier

### Synchronization
- All players see the exact same multiplier in real-time
- The crash point is determined by the server
- Everyone experiences the crash at the same moment

## Troubleshooting

### "Disconnected from server" error
- Make sure the server is running (`node server/index.js`)
- Check that the `VITE_SERVER_URL` in `.env` is correct
- Verify your firewall isn't blocking port 3001

### Can't connect from phone
- Ensure your phone and PC are on the same Wi-Fi network
- Check that your PC's firewall allows incoming connections on port 3001
- Try disabling Windows Firewall temporarily to test
- Verify you're using the correct local IP address

### Game not updating
- Refresh the page
- Check the browser console for errors (F12)
- Restart both the server and client

## Technical Details

### Server (Node.js + Socket.IO)
- Port: 3001
- Controls all game logic
- Broadcasts multiplier updates every 100ms
- Manages player balances and bets
- Generates random crash points with weighted probability

### Client (React + TypeScript + Socket.IO Client)
- Connects to server via WebSocket
- Receives real-time game state updates
- Sends bet and cash-out commands
- Displays synchronized multiplier for all players

### Game Timing
- Round duration: Variable (depends on crash point)
- Break between rounds: 8 seconds
- Multiplier update rate: 100ms (10 updates per second)
- Multiplier acceleration: Increases with current multiplier value

## Development

### Project Structure
```
├── server/
│   └── index.js          # Socket.IO server with game logic
├── src/
│   ├── hooks/
│   │   └── useMultiplayerGame.ts  # Socket.IO client hook
│   ├── pages/
│   │   └── Multiplayer.tsx        # Multiplayer game page
│   └── components/
│       └── GameDisplay.tsx        # Game visualization
└── .env                   # Environment configuration
```

### Customization

**Change round duration:**
Edit `server/index.js`, line with `gameState.countdown = 8`

**Adjust crash probability:**
Edit the `generateCrashMultiplier()` function in `server/index.js`

**Modify starting balance:**
Edit `server/index.js`, line with `balance: 50000`

**Change multiplier speed:**
Edit the growth rate calculations in `server/index.js` multiplier update loop

## Support

If you encounter issues:
1. Check both server and client console logs
2. Verify all dependencies are installed
3. Ensure ports 3001 and 5173 are not in use by other applications
4. Try restarting both server and client

Enjoy the game! 🚀

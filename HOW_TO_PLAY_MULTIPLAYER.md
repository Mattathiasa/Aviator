# 🎮 Aviator Multiplayer - Complete Guide

## ✅ CURRENT STATUS: RUNNING!

Both the server and client are **already running** and ready to play!

---

## 🚀 Quick Start (You're Already Here!)

### On Your PC:
1. Open: **http://localhost:8080**
2. Click the **"Multiplayer"** button (top right corner)
3. Look for the green **"Connected"** indicator
4. Start playing!

### On Phones/Tablets (Same Wi-Fi):
1. Open: **http://192.168.100.208:8080**
2. Click the **"Multiplayer"** button
3. Look for the green **"Connected"** indicator
4. Start playing!

---

## 🎯 How the Multiplayer Works

### Synchronized Gameplay
- ✅ **All players see the SAME multiplier** in real-time
- ✅ **Same crash timing** for everyone
- ✅ **Real-time updates** via Socket.IO
- ✅ **8-second countdown** between rounds
- ✅ **Multiplier speeds up** gradually (just like real Aviator)

### Individual Player Data
- ❌ Each player has their **own balance** (starts at 50,000 birr)
- ❌ Each player places their **own bets**
- ❌ Balances are **tracked locally** on each device

---

## 🎲 Game Rules

| Rule | Value |
|------|-------|
| Starting Balance | 50,000 birr |
| Minimum Bet | 1 birr |
| Maximum Bet | 5,000 birr |
| Maximum Win | 50,000 birr per round |
| Round Duration | ~8 seconds (varies with crash point) |
| Break Between Rounds | 8 seconds |

---

## 🎮 How to Play

### 1. **Wait for Countdown**
- Bets can only be placed during the 8-second break
- Watch the countdown timer

### 2. **Place Your Bet**
- Choose bet amount (1-5,000 birr)
- You can place up to 2 bets per round
- Click "Place Bet" button
- Your balance is deducted immediately

### 3. **Watch the Multiplier Rise**
- The plane takes off
- Multiplier starts at 1.00x and increases
- Speed increases as multiplier gets higher

### 4. **Cash Out Before Crash**
- Click "Cash Out" to secure your winnings
- Payout = Bet Amount × Current Multiplier
- Maximum payout is 50,000 birr

### 5. **If You Don't Cash Out**
- The plane crashes at a random multiplier
- You lose your bet
- New round starts after 8 seconds

---

## 🤖 Auto Features

### Auto Bet
- Toggle "Auto Bet" to automatically place the same bet each round
- Useful for continuous play
- Bet is placed automatically during countdown

### Auto Cash Out
- Toggle "Auto Cash Out" to automatically cash out at a target multiplier
- Set your target (e.g., 2.00x)
- System cashes out automatically when target is reached
- Great for consistent, safe wins

---

## 🔧 Technical Details

### What's Running:
- **Server**: Node.js + Socket.IO on port 3001
- **Client**: React + Vite on port 8080
- **Communication**: WebSocket (Socket.IO)

### Server Controls:
- Generates random crash points
- Broadcasts multiplier updates every 100ms
- Manages game state (countdown, playing, crashed)
- Tracks player balances
- Validates bets and cash outs

### Client Receives:
- `gameState` - Initial state when connecting
- `roundStart` - New round begins
- `multiplierUpdate` - Real-time multiplier changes
- `roundEnd` - Plane crashed
- `countdown` - Time until next round
- `betPlaced` - Bet confirmation
- `cashedOut` - Cash out confirmation

---

## 🔥 Tips for Winning

1. **Start Small**: Test with small bets to understand timing
2. **Use Auto Cash Out**: Set a safe target like 1.5x or 2.0x
3. **Don't Get Greedy**: Higher multipliers are rarer
4. **Watch Patterns**: Notice how multiplier speed changes
5. **Two Bets Strategy**: 
   - Bet 1: Safe cash out (1.5x-2.0x)
   - Bet 2: Risky cash out (5.0x+)

---

## 📱 Connecting Multiple Devices

### Requirements:
- All devices must be on the **same Wi-Fi network**
- Your PC must be running the server and client

### Connection URLs:
- **PC**: http://localhost:8080
- **Other Devices**: http://192.168.100.208:8080

### Troubleshooting Connection Issues:

#### Can't connect from phone?
1. Verify both devices are on same Wi-Fi
2. Check Windows Firewall settings
3. Try temporarily disabling firewall
4. Verify IP address hasn't changed

#### "Disconnected" indicator?
1. Check if server is still running
2. Refresh the page
3. Check network connection
4. Look at server console for errors

---

## 🛠️ Restarting the Game

If you need to restart:

### Stop Current Processes:
1. Close the terminal windows running server and client
2. Or press Ctrl+C in each terminal

### Start Again:
```bash
# Terminal 1 - Start Server
node server/index.js

# Terminal 2 - Start Client
npm run dev
```

Or use the batch file:
```bash
start-multiplayer-game.bat
```

---

## 📊 Understanding the Multiplier Algorithm

The crash point is generated using weighted probabilities:

- **50% chance**: 1.00x - 2.00x (Common)
- **30% chance**: 2.00x - 5.00x (Moderate)
- **15% chance**: 5.00x - 20.00x (Rare)
- **5% chance**: 20.00x - 200.00x (Very Rare)

This creates a fair, exciting game where:
- Small wins are frequent
- Medium wins are regular
- Big wins are possible but rare
- Huge wins are extremely rare

---

## 🎉 You're Ready to Play!

Everything is set up and working. Just open the URL and start playing!

**Your Connection Info:**
- PC: http://localhost:8080
- Network: http://192.168.100.208:8080

Have fun and good luck! 🚀

# 🎮 Aviator Multiplayer - Quick Start Guide

## ✅ What's Already Done
- Socket.IO server is fully implemented
- Multiplayer game hook is ready
- UI is connected and working
- All game logic is synchronized

## 🚀 How to Start Playing

### Option 1: Quick Start (Recommended)
1. Double-click `start-multiplayer-game.bat`
2. The script will show your IP address
3. Share that IP with friends on the same Wi-Fi
4. Friends open `http://YOUR_IP:5173` on their phones/devices

### Option 2: Manual Start
1. **Start the server:**
   ```bash
   node server/index.js
   ```

2. **Start the client (in a new terminal):**
   ```bash
   npm run dev
   ```

3. **Find your IP address:**
   - Windows: Run `ipconfig` and look for "IPv4 Address"
   - Example: `192.168.1.100`

4. **Connect from other devices:**
   - On your PC: Open `http://localhost:5173`
   - On phones: Open `http://YOUR_IP:5173` (e.g., `http://192.168.1.100:5173`)

## 📱 Connecting from Phones

1. Make sure your phone is on the **same Wi-Fi network** as your PC
2. Open a web browser on your phone
3. Type: `http://YOUR_PC_IP:5173`
4. Navigate to the "Multiplayer" page
5. You should see "Connected" with a green Wi-Fi icon

## 🎯 Game Features

✅ **Synchronized Gameplay**
- All players see the same multiplier
- Same crash timing for everyone
- Real-time updates via Socket.IO

✅ **Player Settings**
- Starting balance: 50,000 birr
- Min bet: 1 birr
- Max bet: 5,000 birr
- Max win: 50,000 birr per round

✅ **Round Timing**
- 8 seconds countdown between rounds
- Multiplier speeds up gradually (like real Aviator)
- Auto-bet and auto-cashout options

## 🔧 Troubleshooting

### Can't connect from phone?
1. Check if both devices are on the same Wi-Fi
2. Make sure Windows Firewall allows port 3001 and 5173
3. Try disabling firewall temporarily to test
4. Verify the IP address is correct

### Server not starting?
1. Make sure port 3001 is not in use
2. Check if Node.js is installed: `node --version`
3. Install dependencies: `npm install`

### Client not connecting to server?
1. Check the `.env` file has the correct server URL
2. For network access, update `.env`:
   ```
   VITE_SERVER_URL=http://YOUR_IP:3001
   ```
3. Restart the client after changing `.env`

## 🎮 How to Play

1. **Wait for countdown** - Bets can only be placed during the 8-second break
2. **Place your bet** - Choose amount (1-5000 birr) and click "Place Bet"
3. **Watch the multiplier rise** - The plane takes off and multiplier increases
4. **Cash out before crash** - Click "Cash Out" to secure your winnings
5. **Repeat** - New round starts automatically after 8 seconds

### Auto Features
- **Auto Bet**: Automatically places the same bet each round
- **Auto Cash Out**: Automatically cashes out at your target multiplier

## 📊 What's Synchronized?
- ✅ Multiplier value
- ✅ Crash timing
- ✅ Round start/end
- ✅ Countdown timer
- ❌ Player balances (tracked per device)
- ❌ Individual bets (each player manages their own)

## 🔥 Ready to Play!
Everything is set up and working. Just run the batch file or start the server and client manually, then share your IP with friends!

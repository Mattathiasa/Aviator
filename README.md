# 🚀 Aviator Crash Game - Multiplayer Edition

A real-time multiplayer Aviator-style crash game built with React, TypeScript, Socket.IO, and Node.js.

## ✨ Features

- **Real-time Multiplayer**: All connected devices see the same multiplier and crash timing
- **Dual Betting System**: Place up to 2 independent bets per round
- **Auto Bet & Auto Cash Out**: Set it and forget it with automated betting
- **Network Play**: Play with friends on the same Wi-Fi network
- **Synchronized Gameplay**: Server-controlled game logic ensures fair play
- **8-Second Rounds**: Fast-paced action with automatic round cycling
- **Progressive Speed**: Multiplier accelerates as it grows, just like real Aviator
- **Balance Management**: Each player starts with 50,000 birr
- **Bet Limits**: Min 1 birr, Max 5,000 birr per bet
- **Win Cap**: Maximum 50,000 birr per round

## 🚀 Quick Start

### Option 1: One-Click Start (Windows)
Double-click `start-multiplayer.bat` to start both server and client automatically!

### Option 2: Manual Start

1. **Install Dependencies**
```bash
npm install
```

2. **Start the Server** (in one terminal)
```bash
node server/index.js
```

3. **Start the Client** (in another terminal)
```bash
npm run dev
```

## 📱 Playing on Multiple Devices

### On Your PC (Server Host):
1. Run the server: `node server/index.js`
2. Note your local IP address (shown in server console, e.g., 192.168.1.100)
3. Open browser: `http://localhost:5173/multiplayer`

### On Phones/Other Devices:
1. Connect to the same Wi-Fi network as the PC
2. Open browser and go to: `http://YOUR_PC_IP:5173/multiplayer`
   - Example: `http://192.168.1.100:5173/multiplayer`
3. Start playing!

### Finding Your PC's IP Address:
- **Windows**: Run `ipconfig` in Command Prompt, look for "IPv4 Address"
- **Mac/Linux**: Run `ifconfig` or `ip addr` in Terminal

## 🎮 How to Play

1. **Wait for Countdown**: Rounds start automatically after 8 seconds
2. **Place Your Bets**: Set bet amount (1-5,000 birr) during countdown
3. **Watch It Fly**: Multiplier increases as the plane flies
4. **Cash Out**: Click "Cash Out" before it crashes to win!
5. **Win or Lose**: If you don't cash out before crash, you lose the bet

### Advanced Features:
- **Auto Bet**: Enable to automatically place bets each round
- **Auto Cash Out**: Set a target multiplier to automatically cash out
- **Dual Bets**: Place two different bets with different strategies

## 🛠️ Configuration

### Change Server URL
Edit `.env` file:
```env
VITE_SERVER_URL=http://localhost:3001
```

For network play, change to your PC's IP:
```env
VITE_SERVER_URL=http://192.168.1.100:3001
```

### Change Server Port
Edit `server/index.js`:
```javascript
const PORT = process.env.PORT || 3001;
```

## 📦 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js, Express, Socket.IO
- **UI**: Tailwind CSS, Radix UI, shadcn/ui
- **State Management**: React Hooks
- **Real-time**: Socket.IO

## 🎯 Game Rules

- Starting balance: 50,000 birr
- Minimum bet: 1 birr
- Maximum bet: 5,000 birr per bet
- Maximum win: 50,000 birr per round
- Round duration: ~8 seconds (varies by crash point)
- Break between rounds: 8 seconds
- Multiplier growth: Progressive (speeds up as it increases)

## 🔧 Troubleshooting

### Can't connect from phone?
- Ensure both devices are on the same Wi-Fi network
- Check firewall settings on PC (allow port 3001 and 5173)
- Verify the IP address is correct
- Try disabling Windows Firewall temporarily to test

### Server won't start?
- Check if port 3001 is already in use
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (requires Node 14+)

### Client won't connect to server?
- Verify server is running (check terminal output)
- Check `.env` file has correct server URL
- Clear browser cache and reload

## 📝 Development

### Project Structure
```
├── server/
│   └── index.js              # Socket.IO server
├── src/
│   ├── components/           # React components
│   ├── hooks/
│   │   ├── useGameLogic.ts   # Single-player logic
│   │   └── useMultiplayerGame.ts  # Multiplayer logic
│   ├── pages/
│   │   ├── Index.tsx         # Single-player mode
│   │   └── Multiplayer.tsx   # Multiplayer mode
│   └── App.tsx               # Main app with routing
├── .env                      # Environment variables
└── package.json              # Dependencies

```

### Available Scripts
- `npm run dev` - Start development client
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `node server/index.js` - Start game server

## 🎨 Customization

### Adjust Game Speed
Edit `server/index.js` multiplier update interval:
```javascript
const interval = setInterval(() => {
  // Change growth rate here
  let growthRate;
  if (gameState.multiplier < 2) growthRate = 0.01;
  // ...
}, 100); // Change interval (milliseconds)
```

### Change Round Duration
Edit countdown in `server/index.js`:
```javascript
gameState.countdown = 8; // Change to desired seconds
```

## 📄 License

MIT License - Feel free to use and modify!

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

**Enjoy the game! 🎮🚀**

# 🎮 Aviator Multiplayer Crash Game

A real-time multiplayer crash game built with React, TypeScript, Socket.IO, and Node.js.

## ✨ Features

- 🎮 **Real-time Multiplayer** - All players see the same multiplier and crash timing
- 🎵 **Audio Effects** - Background music and crash sounds
- 🤖 **Auto Features** - Auto-bet and auto-cashout options
- 📱 **Responsive Design** - Works on PC and mobile devices
- 🔄 **Live Synchronization** - Socket.IO for instant updates
- 💰 **Balance Tracking** - Server-side balance management

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
node server/index.js
```
Server runs on port 3001

### 3. Start the Client
```bash
npm run dev
```
Client runs on port 8080

### 4. Play!
- **PC**: http://localhost:8080
- **Phones**: http://YOUR_IP:8080 (same Wi-Fi)

Click "Multiplayer" button to join the game.

## 🎯 Game Rules

- **Starting Balance**: 200 birr
- **Min Bet**: 1 birr
- **Max Bet**: 5,000 birr
- **Max Win**: 10,000 birr per round
- **Round Duration**: ~8 seconds + countdown
- **Break Time**: 8 seconds between rounds

## 🎮 How to Play

1. **Wait for countdown** (8 seconds)
2. **Place your bet** (1-5,000 birr)
3. **Watch multiplier rise** (starts at 1.00x)
4. **Cash out before crash** to win!
5. If you don't cash out, you lose your bet

## 🔧 Configuration

Edit `.env` file to change server URL:
```
VITE_SERVER_URL=http://YOUR_IP:3001
```

## 📁 Project Structure

```
Aviator/
├── server/
│   └── index.js              # Socket.IO server
├── src/
│   ├── hooks/
│   │   ├── useMultiplayerGame.ts  # Multiplayer logic
│   │   └── useGameAudio.ts        # Audio management
│   ├── pages/
│   │   ├── Index.tsx              # Single-player mode
│   │   └── Multiplayer.tsx        # Multiplayer mode
│   └── components/
│       ├── GameDisplay.tsx        # Multiplier display
│       └── BettingControls.tsx    # Betting interface
└── .env                           # Configuration
```

## 🎵 Audio Files

Place these files in `/public` folder:
- `music.mp3` - Background music
- `crash.mp3` - Crash sound effect

Game works without audio files, but no sound will play.

## 🌐 Network Setup

### For Local Network Play:

1. Find your PC's IP address:
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Update `.env` file:
   ```
   VITE_SERVER_URL=http://192.168.1.100:3001
   ```

3. Restart the client:
   ```bash
   npm run dev
   ```

4. Share with friends:
   - PC: http://192.168.1.100:8080

### Firewall Settings:

Allow ports 3001 and 8080 in Windows Firewall, or temporarily disable it for testing.

## 🔧 Troubleshooting

### Can't connect from phone?
- Check both devices on same Wi-Fi
- Verify IP address is correct
- Check Windows Firewall settings
- Make sure server is running

### Shows "Disconnected"?
- Check if server is running (port 3001)
- Refresh the page
- Verify `.env` has correct server URL

### No sound?
- Add audio files to `/public` folder
- Click on page to enable audio (browser restriction)

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express, Socket.IO
- **Real-time**: Socket.IO for WebSocket communication
- **UI Components**: Radix UI, shadcn/ui

## 📊 Game Algorithm

Crash multiplier uses weighted random generation:
- 50% chance: 1.00x - 2.00x (Common)
- 30% chance: 2.00x - 5.00x (Moderate)
- 15% chance: 5.00x - 20.00x (Rare)
- 5% chance: 20.00x - 200.00x (Very Rare)

Multiplier speed increases gradually as it rises, just like the real Aviator game.

## 📝 License

This is a demo project for educational purposes.

## 🎉 Have Fun!

Enjoy playing with friends and may the odds be in your favor! 🚀

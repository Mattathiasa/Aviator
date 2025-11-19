# TESTING ONLINE PLAYERS FEATURE

## Step 1: Check Server Console
When you start the server with `npm run server`, you should see:
```
🎮 Aviator Server running on port 3001
```

## Step 2: Open the Game
1. Go to: http://localhost:5173/multiplayer
2. Open Browser Console (Press F12)
3. Enter your name and click "Set"

## Step 3: Check Console Messages

### In Browser Console, you should see:
```
Connected to server
📥 Received online players update: [{socketId: "...", name: "YourName", balance: 200}]
🔍 [Multiplayer] Online Players State: [{socketId: "...", name: "YourName", balance: 200}]
```

### In Server Console, you should see:
```
✅ Player connected: [socket-id]
👤 Player [socket-id] set name to: YourName
📡 Broadcasting 1 online players
```

## Step 4: If You Don't See Messages

### Problem 1: No "📥 Received online players update" message
- The server isn't sending the data
- Check if server is running
- Restart the server

### Problem 2: "📥 Received online players update: []" (empty array)
- Server is sending but no players in the list
- This shouldn't happen if you're connected
- Check server console for errors

### Problem 3: onlinePlayers is undefined or null
- The hook isn't returning the data
- Check if useMultiplayerGame is working
- Refresh the page

## Step 5: Manual Test

Open Browser Console and type:
```javascript
// This will show you the current state
console.log('Testing online players...');
```

## Quick Fix Steps:

1. **Stop the server** (Ctrl+C in server terminal)
2. **Restart the server**: `npm run server`
3. **Refresh the browser** (F5)
4. **Enter your name** when prompted
5. **Check browser console** (F12) for the messages above
6. **Check server console** for the broadcast message

## Expected Result:
You should see:
- "Online (1)" in the header
- Your name displayed
- Your balance (200.00 birr)
- Green "Online" status indicator
- "(You)" label next to your name

## If Still Not Working:
Please share:
1. Browser console output (F12)
2. Server console output
3. Screenshot of what you see

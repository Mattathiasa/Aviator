# TROUBLESHOOTING: Online Players Not Showing

## STEP-BY-STEP DEBUGGING

### Step 1: Restart Everything
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run server
```

In another terminal:
```bash
# Make sure client is running:
npm run dev
```

### Step 2: Open Browser with Console
1. Go to: http://localhost:5173/multiplayer
2. Press F12 to open Developer Console
3. Go to the "Console" tab

### Step 3: Enter Your Name
1. Type your name in the input field
2. Click "Set" button
3. Watch the console for messages

### Step 4: Check Console Messages

#### You SHOULD see these messages in order:

**When page loads:**
```
Connected to server
```

**When you set your name:**
```
🏷️ Setting player name: YourName
📤 Sending setPlayerName to server: YourName
```

**Shortly after:**
```
📥 Received online players update: [{socketId: "abc123", name: "YourName", balance: 200}]
📊 Number of players: 1
👥 Players: YourName (200 birr)
🔍 [Multiplayer] Online Players State: [{...}]
🔍 [Multiplayer] Connected: true
🔍 [Multiplayer] Socket ID: abc123
🔍 [Multiplayer] Player Name: YourName
```

### Step 5: Check Server Console

**You SHOULD see:**
```
✅ Player connected: abc123
📡 Broadcasting 1 online players
👤 Player abc123 set name to: YourName
📡 Broadcasting 1 online players
```

### Step 6: Check the UI

**You SHOULD see:**
- "Online (1)" in the header
- A card with your name
- Your balance: "200.00 birr"
- "(You)" label next to your name
- Green dot with "Online" status
- "🟢 Connected" in top right of Online card

---

## COMMON PROBLEMS & SOLUTIONS

### Problem 1: "Online (0)" showing

**Symptoms:**
- Header shows "Online (0)"
- No players in the list
- Console shows empty array: `[]`

**Causes:**
- Server not broadcasting
- Socket not connected
- Name not set

**Solutions:**
1. Check if you entered your name and clicked "Set"
2. Check server console for "📡 Broadcasting" messages
3. Restart server
4. Refresh browser

---

### Problem 2: Console shows "⚠️ Cannot send name - not connected"

**Symptoms:**
- Warning in console when setting name
- Not connected to server

**Solutions:**
1. Check if server is running: `npm run server`
2. Check server URL in console
3. Make sure port 3001 is not blocked
4. Restart both server and client

---

### Problem 3: No console messages at all

**Symptoms:**
- No "Connected to server" message
- No debug messages

**Solutions:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Check if JavaScript is enabled
4. Try a different browser
5. Check for console errors (red text)

---

### Problem 4: "📥 Received online players update: undefined"

**Symptoms:**
- onlinePlayers is undefined
- Server sending wrong format

**Solutions:**
1. Check server code in server/index.js
2. Make sure broadcastOnlinePlayers() is called
3. Restart server
4. Check for server errors

---

### Problem 5: Players show but balance is wrong

**Symptoms:**
- Players appear but balance shows NaN or 0

**Solutions:**
1. Check server initialization
2. Make sure player.balance is set to 200
3. Restart server to reset balances

---

## MANUAL VERIFICATION

### Test 1: Check if hook is working
Open browser console and type:
```javascript
// This should show the hook's state
console.log('Manual check - see React DevTools');
```

### Test 2: Check socket connection
In browser console:
```javascript
// Check if socket.io is loaded
console.log(typeof io);  // Should show "function"
```

### Test 3: Force refresh
1. Close all browser tabs
2. Stop server (Ctrl+C)
3. Restart server: `npm run server`
4. Open new browser tab
5. Go to: http://localhost:5173/multiplayer
6. Enter name and check

---

## EXPECTED BEHAVIOR

### When 1 Player Connected:
- "Online (1)"
- Your name with "(You)"
- Balance: 200.00 birr
- Green online indicator

### When 2 Players Connected:
- "Online (2)"
- Both players listed
- One with "(You)" label
- Both with balances

### When Player Leaves:
- Count decreases
- Player removed from list
- Console shows updated array

---

## STILL NOT WORKING?

If you've tried everything above and it's still not working:

1. **Share these details:**
   - Browser console output (copy all messages)
   - Server console output (copy all messages)
   - Screenshot of the Online section
   - Browser and version (e.g., Chrome 120)

2. **Try this emergency fix:**
   ```bash
   # Stop everything
   # Delete node_modules
   rm -rf node_modules
   # Reinstall
   npm install
   # Restart
   npm run server
   # In another terminal:
   npm run dev
   ```

3. **Check these files are correct:**
   - src/hooks/useMultiplayerGame.ts (has onlinePlayers state)
   - src/pages/Multiplayer.tsx (uses onlinePlayers)
   - server/index.js (has broadcastOnlinePlayers function)

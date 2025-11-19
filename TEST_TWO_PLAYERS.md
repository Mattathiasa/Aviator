# 🧪 TEST WITH TWO PLAYERS

## SETUP:

### 1. Restart Server
```bash
# Stop server (Ctrl+C)
npm run server
```

### 2. Open First Browser Tab
1. Go to: http://localhost:5173/multiplayer
2. Press F12 (open console)
3. Enter name: "Player1"
4. Click "Set"

### 3. Open Second Browser Tab (or Incognito Window)
1. Go to: http://localhost:5173/multiplayer
2. Press F12 (open console)
3. Enter name: "Player2"
4. Click "Set"

---

## WHAT TO CHECK:

### In Server Console:
You should see:
```
✅ Player connected: [socket-id-1]
📡 Broadcasting 1 online players:
  1. Player (abc12345...) - 200 birr
👤 Player [socket-id-1] set name to: Player1
📡 Broadcasting 1 online players:
  1. Player1 (abc12345...) - 200 birr

✅ Player connected: [socket-id-2]
📡 Broadcasting 2 online players:
  1. Player1 (abc12345...) - 200 birr
  2. Player (def67890...) - 200 birr
👤 Player [socket-id-2] set name to: Player2
📡 Broadcasting 2 online players:
  1. Player1 (abc12345...) - 200 birr
  2. Player2 (def67890...) - 200 birr
```

### In Browser Console (Tab 1 - Player1):
```
📥 Received online players update
📊 Number of players received: 2
👥 Players received:
  1. Player1 (abc12345...) - 200 birr
  2. Player2 (def67890...) - 200 birr
💾 Setting onlinePlayers state with 2 players
```

### In Browser Console (Tab 2 - Player2):
```
📥 Received online players update
📊 Number of players received: 2
👥 Players received:
  1. Player1 (abc12345...) - 200 birr
  2. Player2 (def67890...) - 200 birr
💾 Setting onlinePlayers state with 2 players
```

### In UI (Both Tabs):
```
Online (2)

┌─────────────────────────────────────┐
│  [P1]  Player1 (You)                │  <- Only in Tab 1
│        🟢 Online                     │
│                      200.00 birr    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  [P2]  Player2                      │
│        🟢 Online                     │
│                      200.00 birr    │
└─────────────────────────────────────┘
```

---

## IF YOU ONLY SEE 1 PLAYER:

### Check Server Console:
- Does it say "Broadcasting 2 online players"?
- Does it list both players?

### Check Browser Console:
- Does it say "Number of players received: 2"?
- Does it list both players?

### If Server Shows 2 but Browser Shows 1:
- The broadcast is working
- But the client is not receiving all players
- Check for JavaScript errors in console

### If Server Shows 1:
- The server doesn't know about the second player
- Check if second tab is actually connected
- Look for "✅ Player connected" message for second player

---

## COMMON ISSUES:

### Issue 1: Server shows 2, Browser shows 1
**Problem:** State not updating properly
**Fix:** Check React DevTools to see component state

### Issue 2: Server shows 1, should show 2
**Problem:** Second player not connecting
**Fix:** 
- Check if second tab is on the same URL
- Check if second tab shows "Connected to server"
- Try closing and reopening second tab

### Issue 3: Both tabs show different counts
**Problem:** Clients out of sync
**Fix:**
- Restart server
- Close all tabs
- Open fresh tabs

---

## WHAT TO SHARE:

If it's still not working, share:

1. **Server Console Output** (everything from when you started server)
2. **Browser Console from Tab 1** (Player1)
3. **Browser Console from Tab 2** (Player2)
4. **Screenshot of Online section from Tab 1**
5. **Screenshot of Online section from Tab 2**

This will help identify exactly where the issue is!

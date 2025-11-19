# Admin Balance Management Guide

## Overview

The admin balance management system allows designated administrators to control player balances. Players start with 0 ETB and must request funds from admins to begin playing.

## Features Implemented

✅ Players start with 0 balance
✅ Request funds button for players
✅ Admin authentication with password
✅ Admin panel with pending requests
✅ Direct balance grants to any player
✅ Request approval/denial system
✅ Real-time notifications
✅ Balance history tracking

## Quick Start

### For Players

1. **Join the game** - Enter your name when prompted
2. **Request funds** - Click "Request Funds" button in the header
3. **Wait for approval** - Admin will receive your request
4. **Start playing** - Once approved, your balance will update and you can bet

### For Admins

1. **Login as admin** - Click "Admin Login" in the header
2. **Enter password** - Default: `admin123`
3. **Open admin panel** - Click "Admin Panel" button (shows pending request count)
4. **Manage requests**:
   - **Pending Requests tab**: Approve or deny player requests
   - **All Players tab**: Add funds to any player directly

## Configuration

### Environment Variables

Create a `.env` file in the server directory:

```env
# Admin password (change this in production!)
ADMIN_PASSWORD=admin123

# Maximum amount admin can grant
MAX_GRANT_AMOUNT=10000

# Minimum amount admin can grant
MIN_GRANT_AMOUNT=1
```

### Changing Admin Password

1. Update `ADMIN_PASSWORD` in your `.env` file
2. Restart the server
3. Use the new password to authenticate

## Admin Panel Features

### Pending Requests Tab
- View all pending balance requests
- See player name and current balance
- Enter custom amount to grant
- Approve or deny requests
- Requests auto-expire after 5 minutes

### All Players Tab
- View all online players
- See current balance for each player
- Add funds to any player directly
- No request needed

## Player Experience

### Zero Balance State
- Betting controls show "Request funds from admin to start betting"
- "Request Funds" button appears in header
- Can still view game and other players

### After Requesting
- "Request Pending..." indicator appears
- Can continue watching the game
- Receives notification when approved/denied

### After Approval
- Toast notification: "Received X ETB from Admin Name"
- Balance updates immediately
- Can start placing bets

## Security Notes

⚠️ **Important Security Considerations:**

1. **Change default password** - The default `admin123` is for development only
2. **Use strong passwords** - In production, use a secure password
3. **Server-side validation** - All admin actions are validated on the server
4. **Audit trail** - All balance grants are logged with timestamps

## Troubleshooting

### Players can't request funds
- Check if player has 0 balance
- Verify server is running
- Check browser console for errors

### Admin can't login
- Verify password matches `.env` file
- Check server logs for authentication attempts
- Restart server after changing password

### Requests not appearing
- Check if admin is authenticated
- Verify WebSocket connection is active
- Check server console for request logs

## Testing the Feature

1. **Open two browser windows**:
   - Window 1: Regular player
   - Window 2: Admin (login with password)

2. **Test player request flow**:
   - Player clicks "Request Funds"
   - Admin sees request in panel
   - Admin grants funds
   - Player receives balance

3. **Test direct grant**:
   - Admin opens "All Players" tab
   - Enters amount for any player
   - Clicks "Add Funds"
   - Player receives balance immediately

## Server Logs

The server logs all admin actions:

```
🔐 Admin authenticated: socket_id
💰 Balance request from PlayerName (socket_id)
💵 Admin AdminName granted 100 ETB to PlayerName
❌ Admin AdminName denied balance request from PlayerName
```

## API Events

### Client → Server
- `authenticateAdmin` - Admin login
- `requestBalance` - Player requests funds
- `grantBalance` - Admin grants funds
- `denyBalanceRequest` - Admin denies request

### Server → Client
- `adminStatus` - Admin authentication status
- `balanceRequest` - New request (to admins)
- `balanceUpdated` - Balance granted (to player)
- `balanceRequestDenied` - Request denied (to player)
- `pendingRequests` - List of pending requests (to admins)

## Next Steps

- Consider implementing JWT tokens for production
- Add role-based permissions for multiple admin levels
- Implement balance transaction history UI
- Add admin activity logs dashboard

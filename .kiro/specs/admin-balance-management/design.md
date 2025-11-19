# Design Document

## Overview

The admin balance management system introduces a controlled economy to the Aviator game where players start with zero balance and must request funds from designated administrators. This design extends the existing Socket.IO multiplayer architecture with new event types, admin authentication, and UI components for both player fund requests and admin balance management.

The system maintains backward compatibility with the existing game mechanics while adding a new layer of financial control. Admins can be designated through environment variables or a simple configuration file, and the system supports multiple concurrent admins.

## Architecture

### System Components

1. **Server-Side Components**
   - Admin authentication module
   - Balance request queue manager
   - Balance grant validator
   - Enhanced Socket.IO event handlers

2. **Client-Side Components**
   - Request funds button/modal (for regular players)
   - Admin panel component (for admin users)
   - Balance notification system
   - Enhanced player list with admin actions

3. **Communication Layer**
   - New Socket.IO events for balance requests and grants
   - Admin status broadcast
   - Real-time balance update notifications

### Data Flow

```
Player Request Flow:
Player Client → requestBalance event → Server → balanceRequest event → Admin Clients

Admin Grant Flow:
Admin Client → grantBalance event → Server (validate) → updateBalance → Target Player Client
                                                      → broadcastOnlinePlayers → All Clients

Admin Deny Flow:
Admin Client → denyBalanceRequest event → Server → balanceRequestDenied → Target Player Client
```


## Components and Interfaces

### Server-Side Components

#### 1. Admin Configuration Module

**Purpose**: Manage admin user identification and authentication

**Implementation**:
```javascript
// Admin configuration - can be loaded from .env or config file
const adminConfig = {
  // Option 1: Simple password-based (for demo/development)
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  
  // Option 2: Predefined admin socket IDs (for production)
  adminSocketIds: new Set(),
  
  // Track authenticated admins
  authenticatedAdmins: new Set()
};

// Helper function
const isAdmin = (socketId) => {
  return adminConfig.authenticatedAdmins.has(socketId);
};
```

**Configuration Options**:
- Environment variable: `ADMIN_PASSWORD` for simple password authentication
- Future: Could extend to JWT tokens or OAuth

#### 2. Balance Request Queue

**Purpose**: Track pending balance requests from players

**Data Structure**:
```javascript
const balanceRequests = new Map();
// Key: socketId
// Value: { 
//   socketId, 
//   playerName, 
//   currentBalance, 
//   requestedAt: timestamp,
//   status: 'pending' | 'approved' | 'denied'
// }
```

#### 3. Enhanced Player Data Structure

**Modification to existing players Map**:
```javascript
players.set(socket.id, {
  balance: 0,  // Changed from 200 to 0
  activeBets: [],
  name: 'Player',
  isAdmin: false,  // New field
  balanceHistory: []  // New field - optional for tracking
});
```


### Socket.IO Events

#### New Events

**Client → Server Events**:

1. `authenticateAdmin`
   ```typescript
   { password: string }
   ```
   - Sent by client attempting to authenticate as admin
   - Server validates and responds with admin status

2. `requestBalance`
   ```typescript
   { amount?: number }  // Optional: player can suggest amount
   ```
   - Sent by player requesting funds
   - Server adds to request queue and notifies admins

3. `grantBalance`
   ```typescript
   { targetSocketId: string, amount: number }
   ```
   - Sent by admin to grant funds to a player
   - Server validates admin status and amount, then updates balance

4. `denyBalanceRequest`
   ```typescript
   { targetSocketId: string, reason?: string }
   ```
   - Sent by admin to deny a balance request
   - Server notifies the requesting player

**Server → Client Events**:

1. `adminStatus`
   ```typescript
   { isAdmin: boolean }
   ```
   - Sent to client upon connection or authentication
   - Client uses this to show/hide admin UI

2. `balanceRequest`
   ```typescript
   { 
     socketId: string, 
     playerName: string, 
     currentBalance: number,
     requestedAmount?: number,
     requestedAt: number 
   }
   ```
   - Broadcast to all admin clients when a player requests funds

3. `balanceUpdated`
   ```typescript
   { 
     newBalance: number, 
     amountAdded: number, 
     grantedBy: string 
   }
   ```
   - Sent to specific player when their balance is updated

4. `balanceRequestDenied`
   ```typescript
   { reason?: string }
   ```
   - Sent to player when their request is denied

5. `pendingRequests`
   ```typescript
   { 
     requests: Array<{
       socketId: string,
       playerName: string,
       currentBalance: number,
       requestedAt: number
     }>
   }
   ```
   - Sent to admin clients with current pending requests


### Client-Side Components

#### 1. RequestFundsButton Component

**Location**: `src/components/aviator-ui/RequestFundsButton.tsx`

**Purpose**: Allow players to request balance from admin

**Props**:
```typescript
interface RequestFundsButtonProps {
  balance: number;
  onRequestSent: () => void;
  disabled?: boolean;
}
```

**UI Design**:
- Prominent button in HeaderBar when balance is 0 or low
- Opens modal with optional amount suggestion
- Shows pending state after request is sent
- Displays success/error notifications

**States**:
- Idle: Show "Request Funds" button
- Pending: Show "Request Pending..." with disabled state
- Success: Show brief success message, then return to idle
- Denied: Show denial message, then return to idle

#### 2. AdminPanel Component

**Location**: `src/components/aviator-ui/AdminPanel.tsx`

**Purpose**: Provide admin interface for managing player balances

**Props**:
```typescript
interface AdminPanelProps {
  onlinePlayers: Array<{
    socketId: string;
    name: string;
    balance: number;
  }>;
  pendingRequests: Array<{
    socketId: string;
    playerName: string;
    currentBalance: number;
    requestedAt: number;
  }>;
  onGrantBalance: (socketId: string, amount: number) => void;
  onDenyRequest: (socketId: string) => void;
}
```

**UI Design**:
- Floating button in bottom-right corner (admin only)
- Opens full-screen or large modal overlay
- Two tabs: "Pending Requests" and "All Players"
- Each player row has:
  - Avatar and name
  - Current balance
  - Input field for amount
  - "Grant" and "Deny" buttons (for requests)
  - "Add Funds" button (for all players tab)

**Layout**:
```
┌─────────────────────────────────────┐
│  Admin Panel                    [X] │
├─────────────────────────────────────┤
│  [Pending Requests] [All Players]   │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │ 👤 Player1      Balance: 0    │  │
│  │ Amount: [____] ETB            │  │
│  │ [Grant] [Deny]                │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ 👤 Player2      Balance: 150  │  │
│  │ Amount: [____] ETB            │  │
│  │ [Add Funds]                   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```


#### 3. AdminAuthModal Component

**Location**: `src/components/aviator-ui/AdminAuthModal.tsx`

**Purpose**: Allow users to authenticate as admin

**Props**:
```typescript
interface AdminAuthModalProps {
  onAuthenticate: (password: string) => void;
  onClose: () => void;
}
```

**UI Design**:
- Simple modal with password input
- Triggered by clicking "Admin Login" button in header
- Shows error message for incorrect password
- Auto-closes on successful authentication

#### 4. Enhanced HeaderBar Component

**Modifications to**: `src/components/aviator-ui/HeaderBar.tsx`

**New Features**:
- Show "Request Funds" button when balance is 0 (for regular players)
- Show "Admin Panel" button (for admin users)
- Show "Admin Login" button (for non-authenticated users)
- Badge indicator for pending requests (admin only)

**Updated Props**:
```typescript
interface HeaderBarProps {
  balance: number;
  isAdmin?: boolean;
  pendingRequestsCount?: number;
  onRequestFunds?: () => void;
  onOpenAdminPanel?: () => void;
  onAdminLogin?: () => void;
}
```

### Hook Modifications

#### Enhanced useMultiplayerGame Hook

**Location**: `src/hooks/useMultiplayerGame.ts`

**New State**:
```typescript
const [isAdmin, setIsAdmin] = useState(false);
const [pendingRequests, setPendingRequests] = useState([]);
const [balanceRequestPending, setBalanceRequestPending] = useState(false);
```

**New Functions**:
```typescript
const authenticateAdmin = (password: string) => {
  socket.emit('authenticateAdmin', { password });
};

const requestBalance = (amount?: number) => {
  socket.emit('requestBalance', { amount });
  setBalanceRequestPending(true);
};

const grantBalance = (targetSocketId: string, amount: number) => {
  socket.emit('grantBalance', { targetSocketId, amount });
};

const denyBalanceRequest = (targetSocketId: string, reason?: string) => {
  socket.emit('denyBalanceRequest', { targetSocketId, reason });
};
```

**New Event Listeners**:
```typescript
socket.on('adminStatus', ({ isAdmin }) => {
  setIsAdmin(isAdmin);
});

socket.on('balanceRequest', (request) => {
  setPendingRequests(prev => [...prev, request]);
});

socket.on('balanceUpdated', ({ newBalance, amountAdded, grantedBy }) => {
  setBalance(newBalance);
  // Show toast notification
});

socket.on('balanceRequestDenied', ({ reason }) => {
  setBalanceRequestPending(false);
  // Show toast notification
});

socket.on('pendingRequests', ({ requests }) => {
  setPendingRequests(requests);
});
```


## Data Models

### Player Model (Enhanced)

```typescript
interface Player {
  socketId: string;
  name: string;
  balance: number;
  activeBets: Array<{
    betId: string;
    amount: number;
    cashedOut: boolean;
  }>;
  isAdmin: boolean;
  balanceHistory?: Array<{
    timestamp: number;
    amount: number;
    type: 'grant' | 'bet' | 'win' | 'cashout';
    grantedBy?: string;
  }>;
}
```

### Balance Request Model

```typescript
interface BalanceRequest {
  socketId: string;
  playerName: string;
  currentBalance: number;
  requestedAmount?: number;
  requestedAt: number;
  status: 'pending' | 'approved' | 'denied';
}
```

### Admin Config Model

```typescript
interface AdminConfig {
  adminPassword: string;
  authenticatedAdmins: Set<string>;
  maxGrantAmount: number;  // e.g., 10000
  minGrantAmount: number;  // e.g., 1
}
```

## Error Handling

### Server-Side Validation

1. **Admin Authentication**
   - Invalid password → Send error event to client
   - Rate limiting: Max 5 attempts per IP per minute

2. **Balance Grant Validation**
   - Non-admin user attempts grant → Reject silently, log security event
   - Invalid amount (< 1 or > 10000) → Send error to admin client
   - Target player not found → Send error to admin client
   - Negative balance result → Prevent and send error

3. **Balance Request Validation**
   - Duplicate request while pending → Ignore or update timestamp
   - Player already has sufficient balance → Optional warning

### Client-Side Error Handling

1. **Request Funds**
   - Network error → Show retry button
   - Request timeout (no response in 30s) → Allow retry
   - Request denied → Show reason and allow new request

2. **Admin Panel**
   - Invalid amount input → Disable grant button, show validation message
   - Grant failure → Show error toast, keep request in queue
   - Connection lost → Show warning, disable actions

### Error Messages

```typescript
const ERROR_MESSAGES = {
  INVALID_AMOUNT: 'Amount must be between 1 and 10,000 ETB',
  PLAYER_NOT_FOUND: 'Player not found or disconnected',
  UNAUTHORIZED: 'You do not have admin privileges',
  NETWORK_ERROR: 'Connection error. Please try again.',
  REQUEST_DENIED: 'Your balance request was denied',
  INVALID_PASSWORD: 'Invalid admin password'
};
```


## Testing Strategy

### Unit Tests

1. **Server-Side**
   - Admin authentication logic
   - Balance validation functions
   - Request queue management
   - Balance grant calculations

2. **Client-Side**
   - Component rendering with different props
   - Event handler functions
   - State management in hooks
   - Form validation

### Integration Tests

1. **Socket.IO Event Flow**
   - Player requests balance → Admin receives notification
   - Admin grants balance → Player receives update
   - Admin denies request → Player receives notification
   - Multiple admins receive same requests

2. **UI Integration**
   - Request button appears when balance is 0
   - Admin panel shows pending requests
   - Balance updates reflect in UI immediately
   - Notifications display correctly

### End-to-End Tests

1. **Complete User Flows**
   - New player joins → Requests funds → Admin grants → Player can bet
   - Admin authenticates → Views requests → Grants to multiple players
   - Player requests → Admin denies → Player requests again
   - Admin directly adds funds to player without request

2. **Edge Cases**
   - Player disconnects while request is pending
   - Admin disconnects while viewing requests
   - Multiple admins grant to same player simultaneously
   - Player requests funds while having active bets

### Manual Testing Checklist

- [ ] Player with 0 balance sees request button
- [ ] Request button shows pending state after click
- [ ] Admin sees notification badge for new requests
- [ ] Admin panel displays all pending requests correctly
- [ ] Grant button updates player balance immediately
- [ ] Deny button removes request and notifies player
- [ ] Admin can add funds to any player from "All Players" tab
- [ ] Balance updates broadcast to all connected clients
- [ ] Non-admin users cannot access admin functions
- [ ] Admin authentication works with correct password
- [ ] Admin authentication fails with incorrect password
- [ ] Multiple admins can operate simultaneously
- [ ] UI is responsive on mobile devices

## Security Considerations

1. **Admin Authentication**
   - Store admin password in environment variable, not in code
   - Consider implementing JWT tokens for production
   - Rate limit authentication attempts
   - Log all admin actions for audit trail

2. **Authorization**
   - Verify admin status on server for every admin action
   - Never trust client-side admin status
   - Validate all amounts server-side

3. **Data Validation**
   - Sanitize all user inputs
   - Validate socket IDs exist before operations
   - Prevent negative balances
   - Cap maximum grant amounts

4. **Audit Trail**
   - Log all balance grants with timestamp and admin ID
   - Log all denied requests
   - Track balance history per player (optional)

## Performance Considerations

1. **Request Queue Management**
   - Limit pending requests per player to 1
   - Auto-expire requests after 5 minutes
   - Clean up requests when player disconnects

2. **Broadcasting**
   - Only broadcast to admin clients for balance requests
   - Use targeted emits instead of broadcast where possible
   - Throttle online players list updates

3. **UI Optimization**
   - Virtualize long lists in admin panel
   - Debounce amount input validation
   - Lazy load admin panel component

## Deployment Notes

1. **Environment Variables**
   ```
   ADMIN_PASSWORD=your_secure_password_here
   MAX_GRANT_AMOUNT=10000
   MIN_GRANT_AMOUNT=1
   ```

2. **Migration from Current System**
   - Existing players will keep their current balance
   - New players will start with 0 balance
   - Optional: Reset all balances to 0 on deployment

3. **Backward Compatibility**
   - All existing game features continue to work
   - Non-admin users see no changes except request button
   - Existing socket events remain unchanged

# Admin Balance Management - Quick Reference

## 🎮 For Players

**Starting Balance:** 0 ETB

**To Get Funds:**
1. Click "Request Funds" button (top right)
2. Optionally enter desired amount
3. Click "Send Request"
4. Wait for admin approval

**Status Indicators:**
- "Request Pending..." = Waiting for admin
- Green toast = Funds received!
- Red toast = Request denied

---

## 👑 For Admins

**Login:**
- Click "Admin Login" (top right)
- Password: `admin123` (default)

**Admin Panel:**
- Click "Admin Panel" button
- Badge shows pending request count

**Two Tabs:**

### 📋 Pending Requests
- See all player requests
- Enter amount (1-10000 ETB)
- Click "Grant" or "Deny"

### 👥 All Players
- See all online players
- Add funds to anyone
- No request needed

---

## ⚙️ Configuration

**File:** `.env`

```env
ADMIN_PASSWORD=admin123
MAX_GRANT_AMOUNT=10000
MIN_GRANT_AMOUNT=1
```

**Change password:**
1. Edit `.env` file
2. Restart server
3. Use new password

---

## 🔍 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't login as admin | Check password in `.env` |
| Request not showing | Refresh admin panel |
| Balance not updating | Check server console |
| Button not appearing | Player needs 0 balance |

---

## 📊 Server Logs

Watch for these messages:
- `🔐 Admin authenticated` = Admin logged in
- `💰 Balance request from` = New request
- `💵 Admin granted` = Funds given
- `❌ Admin denied` = Request rejected

---

## 🚀 Quick Test

1. **Window 1 (Player):**
   - Join game
   - Click "Request Funds"

2. **Window 2 (Admin):**
   - Login with password
   - Open Admin Panel
   - Grant funds

3. **Window 1 (Player):**
   - See balance update
   - Start betting!

---

## 💡 Pro Tips

- Requests expire after 5 minutes
- Admins can grant without requests
- All actions are logged
- Balance updates are instant
- Multiple admins can work together

---

**Default Password:** `admin123`
**Valid Range:** 1 - 10,000 ETB

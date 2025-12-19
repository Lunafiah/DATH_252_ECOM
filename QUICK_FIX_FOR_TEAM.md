# Quick Fix Guide for Teammates

## 🚨 If You're Getting 401 Errors After Pulling

### Quick Fix (30 seconds):

1. **Clear browser storage:**

   - Press F12
   - Application tab → Local Storage → Clear All

2. **Restart backend:**

   ```bash
   cd server
   # Press Ctrl+C to stop
   npm run dev
   ```

3. **Login again** at http://localhost:3000/login

4. **Dashboard should work!** ✅

---

## ❓ Why This Happened

The `.env` file wasn't being loaded before the JWT token service was created, causing token mismatch.

**Fixed in:** `server/src/index.js` (moved `dotenv.config()` to first line)

---

## ✅ Verify It's Working

Backend terminal should show:

```
🔑 JWT_SECRET loaded: YES ✅
```

If you see `NO ❌`, contact the team!

---

**Need help?** Check `FIX_401_ERROR_SUMMARY.md` for full details.

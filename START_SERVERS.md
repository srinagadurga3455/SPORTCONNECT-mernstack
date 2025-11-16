# 🚀 How to Start SportConnect

## ⚠️ IMPORTANT: You MUST start BOTH servers!

### Step 1: Start Backend Server (Terminal 1)

Open a terminal and run:

```bash
cd SPORTCONNECT/server
npm install
npm run seed
npm run dev
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected: cluster0.8akladx.mongodb.net
✅ Database seeded successfully!
```

**If you see errors:**
- MongoDB connection error → Check your internet connection
- Port 5000 in use → Kill the process: `npx kill-port 5000`
- Module not found → Run `npm install` again

---

### Step 2: Start Frontend (Terminal 2)

Open a **NEW terminal** (keep the first one running!) and run:

```bash
cd SPORTCONNECT/client
npm install
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view sportconnect-client in the browser.
Local: http://localhost:3000
```

---

## ✅ Verify Everything is Working

1. **Backend Check:** Open http://localhost:5000 in browser
   - Should see: `{"message":"SportConnect API is running"}`

2. **Frontend Check:** Open http://localhost:3000
   - Should see the SportConnect landing page

3. **Test Login:**
   - Email: `player@test.com`
   - Password: `password123`

---

## 🐛 Troubleshooting

### Error: "Cannot connect to server"
**Problem:** Backend is not running
**Solution:** Make sure Terminal 1 is still running with `npm run dev`

### Error: "Signup failed"
**Problem:** Backend not responding or MongoDB not connected
**Solution:** 
1. Check Terminal 1 for errors
2. Verify MongoDB Atlas connection string in `server/.env`
3. Check your internet connection

### Error: "Port 3000 already in use"
**Solution:** 
```bash
npx kill-port 3000
npm start
```

### Error: "Port 5000 already in use"
**Solution:**
```bash
npx kill-port 5000
npm run dev
```

---

## 📝 Quick Commands Reference

### Backend Commands
```bash
cd SPORTCONNECT/server
npm install          # Install dependencies
npm run seed         # Seed test data
npm run dev          # Start development server
npm start            # Start production server
```

### Frontend Commands
```bash
cd SPORTCONNECT/client
npm install          # Install dependencies
npm start            # Start development server
npm run build        # Build for production
```

---

## 🎯 Test Accounts (After Seeding)

```
Player:
Email: player@test.com
Password: password123

Coach:
Email: coach@test.com
Password: password123

Turf Owner:
Email: turf@test.com
Password: password123
```

---

## 💡 Pro Tips

1. **Always keep both terminals open** while developing
2. **Backend must start first** before frontend can work
3. **Check Terminal 1** if you see connection errors
4. **Use Ctrl+C** to stop servers when done
5. **Run `npm run seed`** if you need fresh test data

---

## 🆘 Still Having Issues?

1. Check if MongoDB Atlas is accessible (internet connection)
2. Verify `.env` file exists in `server/` folder
3. Make sure Node.js version is 14 or higher: `node --version`
4. Clear browser cache and try again
5. Check browser console (F12) for detailed errors

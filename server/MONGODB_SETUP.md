# MongoDB Setup Guide

## Option 1: Use Local MongoDB (Recommended for Development)

### Windows:
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run as a Windows Service automatically
4. Update `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/sportconnect
```

### Mac:
```bash
# Install with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Update .env
MONGODB_URI=mongodb://localhost:27017/sportconnect
```

### Linux:
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb

# Update .env
MONGODB_URI=mongodb://localhost:27017/sportconnect
```

---

## Option 2: Fix MongoDB Atlas Connection

If you want to use MongoDB Atlas (cloud), try these fixes:

### Fix 1: Update Connection String
Add TLS parameters to your connection string in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sportconnect?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true
```

### Fix 2: Check Network Access
1. Go to MongoDB Atlas Dashboard
2. Click "Network Access" in left sidebar
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere" (0.0.0.0/0)
5. Save

### Fix 3: Check Database User
1. Go to "Database Access"
2. Ensure user has "Read and Write" permissions
3. Check username and password are correct

### Fix 4: Update MongoDB Driver
```bash
cd server
npm install mongodb@latest mongoose@latest
```

---

## Quick Test

After setup, test your connection:

```bash
cd server
node -e "require('mongoose').connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sportconnect').then(() => console.log('✅ Connected!')).catch(err => console.log('❌ Error:', err.message))"
```

---

## Current Error Fix

The SSL error you're seeing is usually caused by:
1. **Network/Firewall blocking MongoDB Atlas**
2. **Outdated MongoDB driver**
3. **Invalid SSL certificates**

**Quick Solution:** Use local MongoDB instead!

Update your `.env`:
```
MONGODB_URI=mongodb://localhost:27017/sportconnect
```

Then restart the server:
```bash
npm run dev
```

---

## Verify MongoDB is Running

### Windows:
```bash
# Check if MongoDB service is running
sc query MongoDB
```

### Mac/Linux:
```bash
# Check if MongoDB is running
ps aux | grep mongod
```

---

## Need Help?

If you're still having issues:
1. Use local MongoDB (easiest solution)
2. Check your internet connection for Atlas
3. Verify firewall isn't blocking port 27017
4. Make sure MongoDB service is running

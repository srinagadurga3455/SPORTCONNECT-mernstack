# SportConnect - Complete Setup Guide

## 📋 Project Structure

```
SPORTCONNECT/
├── server/                      # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Auth logic
│   │   ├── bookingController.js # Booking logic
│   │   └── turfController.js   # Turf CRUD logic
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification
│   │   └── roleMiddleware.js   # Role-based access
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Booking.js          # Booking schema
│   │   └── Turf.js             # Turf schema
│   ├── routes/
│   │   ├── authRoutes.js       # Auth endpoints
│   │   ├── bookingRoutes.js    # Booking endpoints
│   │   ├── turfRoutes.js       # Turf endpoints
│   │   └── userRoutes.js       # User endpoints
│   ├── seeds/
│   │   └── seedData.js         # Sample data
│   ├── server.js               # Entry point
│   ├── package.json
│   └── .env
├── client/                      # Frontend (React)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── PlayerSetup.jsx
│   │   │   ├── CoachSetup.jsx
│   │   │   ├── TurfSetup.jsx
│   │   │   ├── PlayerDashboard.jsx
│   │   │   ├── CoachDashboard.jsx
│   │   │   ├── TurfDashboard.jsx
│   │   │   ├── BookCoach.jsx
│   │   │   ├── BookTurf.jsx
│   │   │   └── ViewBookings.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🚀 Installation Steps

### Prerequisites
- Node.js v14+ installed
- MongoDB installed locally OR MongoDB Atlas account
- npm or yarn

### 1. Backend Setup

```bash
# Navigate to server directory
cd SPORTCONNECT/server

# Install dependencies
npm install

# Create .env file (already exists, just verify)
# Make sure it has:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sportconnect
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development

# Seed the database with sample data
npm run seed

# Start the server
npm run dev
```

Server will run on: http://localhost:5000

### 2. Frontend Setup

```bash
# Open new terminal
# Navigate to client directory
cd SPORTCONNECT/client

# Install dependencies
npm install

# Start React app
npm start
```

Client will run on: http://localhost:3000

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB
```bash
# Start MongoDB service
mongod

# Or on Windows (as service)
net start MongoDB
```

### Option 2: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `MONGODB_URI` in server/.env:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sportconnect
```

## 🧪 Test Credentials (After Seeding)

```
Player Account:
Email: player@test.com
Password: password123

Coach Account:
Email: coach@test.com
Password: password123

Turf Owner Account:
Email: turf@test.com
Password: password123
```

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/signup         - Register (alias)
POST   /api/auth/login          - Login user
GET    /api/auth/me             - Get current user (Protected)
POST   /api/auth/setup-profile  - Complete profile (Protected)
```

### Users
```
GET    /api/users/coaches       - Get all coaches (Protected)
GET    /api/users/turfs         - Get all turf owners (Protected)
```

### Bookings
```
POST   /api/bookings            - Create booking (Player only)
POST   /api/bookings/create     - Create booking (alias)
GET    /api/bookings/user       - Get user's bookings (Protected)
GET    /api/bookings/my         - Get user's bookings (alias)
GET    /api/bookings/assigned   - Get assigned bookings (Coach/Turf)
GET    /api/bookings/turf/:id   - Get turf bookings (Turf owner)
PUT    /api/bookings/:id/status - Update booking status (Coach/Turf)
```

### Turfs
```
POST   /api/turfs               - Create turf (Turf owner only)
GET    /api/turfs               - Get all turfs (Public)
GET    /api/turfs/my-turfs      - Get my turfs (Turf owner)
GET    /api/turfs/:id           - Get single turf (Public)
PUT    /api/turfs/:id           - Update turf (Owner only)
DELETE /api/turfs/:id           - Delete turf (Owner only)
```

## 🎯 User Workflows

### Player Flow
1. Sign up → Select "Player" role
2. Complete profile (sport, skill level, location)
3. View dashboard
4. Browse coaches or turfs
5. Create booking
6. View booking status

### Coach Flow
1. Sign up → Select "Coach" role
2. Complete profile (specialization, certification, experience)
3. View dashboard
4. See booking requests
5. Approve/Reject bookings

### Turf Owner Flow
1. Sign up → Select "Turf" role
2. Complete profile (turf name, address, sports)
3. View dashboard
4. Create turf listings (optional - using API)
5. Manage booking requests
6. Approve/Reject bookings

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 3000
npx kill-port 3000
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env
- For Atlas: Check network access settings

### CORS Issues
- Backend already configured with CORS
- Ensure proxy is set in client/package.json

### Module Not Found
```bash
# Reinstall dependencies
cd server
rm -rf node_modules package-lock.json
npm install

cd ../client
rm -rf node_modules package-lock.json
npm install
```

## 🎨 Features Implemented

✅ JWT Authentication with bcrypt
✅ Role-based access control (Player, Coach, Turf)
✅ Profile completion flow
✅ Booking system with status management
✅ Separate Turf model with CRUD operations
✅ Controller-based architecture
✅ Role middleware for authorization
✅ Seed data for testing
✅ Protected routes
✅ Clean UI with TailwindCSS
✅ Context API for state management
✅ Axios interceptors for auth headers

## 📝 Notes

- JWT tokens stored in localStorage
- Passwords hashed with bcrypt (10 rounds)
- All routes properly protected
- Role-based authorization on sensitive endpoints
- Clean separation of concerns (MVC pattern)
- Error handling middleware
- Async/await throughout

## 🚀 Production Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Update MONGODB_URI to production database
3. Change JWT_SECRET to strong secret
4. Set NODE_ENV=production

### Frontend (Vercel/Netlify)
1. Update API baseURL in src/services/api.js
2. Build: `npm run build`
3. Deploy build folder

## 📞 Support

For issues or questions, check:
- MongoDB connection
- Environment variables
- Node.js version (v14+)
- Port availability

Happy coding! 🎉

# SportConnect - MERN Stack Application

A production-ready full-stack sports booking platform connecting players with coaches and turfs.

## 🎯 Quick Start

```bash
# Backend
cd SPORTCONNECT/server
npm install
npm run seed    # Seed sample data
npm run dev     # Start server on port 5000

# Frontend (new terminal)
cd SPORTCONNECT/client
npm install
npm start       # Start React app on port 3000
```

**Test Credentials:** player@test.com / password123 (or coach@test.com, turf@test.com)

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Role-Based Access**: Three user roles (Player, Coach, Turf Owner)
- **Profile Management**: Role-specific profile setup
- **Booking System**: Players can book coaches and turfs
- **Booking Management**: Coaches and turf owners can approve/reject bookings
- **Real-time Status Updates**: Track booking status (pending, approved, rejected, completed)

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18
- React Router v6
- Axios for API calls
- Context API for state management
- TailwindCSS for styling

## Project Structure

```
SPORTCONNECT/
├── server/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── bookingRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── server.js
│   └── package.json
├── client/
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

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd SPORTCONNECT/server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sportconnect
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

5. Start the server:
```bash
npm run dev
```

Server will run on http://localhost:5000

### Frontend Setup

1. Navigate to client directory:
```bash
cd SPORTCONNECT/client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Client will run on http://localhost:3000

## MongoDB Setup

### Local MongoDB
```bash
# Start MongoDB service
mongod

# Or use MongoDB Compass GUI
```

### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update MONGODB_URI in .env

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### User Profile
- `POST /api/users/setup-profile` - Complete profile setup (Protected)
- `GET /api/users/coaches` - Get all coaches (Protected)
- `GET /api/users/turfs` - Get all turfs (Protected)

### Bookings
- `POST /api/bookings/create` - Create booking (Protected)
- `GET /api/bookings/my` - Get user's bookings (Protected)
- `GET /api/bookings/assigned` - Get assigned bookings (Protected)
- `PATCH /api/bookings/update-status` - Update booking status (Protected)

## User Roles & Workflows

### Player
1. Sign up and select "Player" role
2. Complete profile (sport, skill level, location)
3. Browse and book coaches or turfs
4. View booking status

### Coach
1. Sign up and select "Coach" role
2. Complete profile (specialization, certification, experience)
3. View booking requests
4. Approve or reject bookings

### Turf Owner
1. Sign up and select "Turf" role
2. Complete profile (turf name, address, available sports)
3. View booking requests
4. Approve or reject bookings

## Default Credentials (After Creating Users)

Create test users through the signup page with different roles.

## Development

### Backend Development
```bash
cd server
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd client
npm start  # React development server with hot reload
```

## Production Build

### Frontend
```bash
cd client
npm run build
```

### Backend
```bash
cd server
npm start
```

## Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in .env
- Verify network access in MongoDB Atlas

### CORS Issues
- Backend already configured with CORS
- Ensure frontend proxy is set in package.json

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 3000
npx kill-port 3000
```

## License

MIT

## Author

SportConnect Team

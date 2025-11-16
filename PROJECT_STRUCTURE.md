# SportConnect - Complete Project Structure

## 📁 File Organization

```
SPORTCONNECT/
├── client/                          # Frontend (React)
│   ├── public/
│   │   └── index.html              # HTML with Bootstrap & Icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Dashboard navbar (TailwindCSS)
│   │   │   └── ProtectedRoute.jsx  # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Landing page (Bootstrap)
│   │   │   ├── home.css            # Landing page styles
│   │   │   ├── Login.jsx           # Login page (TailwindCSS)
│   │   │   ├── Signup.jsx          # Signup page (TailwindCSS)
│   │   │   ├── PlayerSetup.jsx     # Player profile setup
│   │   │   ├── CoachSetup.jsx      # Coach profile setup
│   │   │   ├── TurfSetup.jsx       # Turf profile setup
│   │   │   ├── PlayerDashboard.jsx # Player dashboard (Bootstrap)
│   │   │   ├── playerDashboard.css # Player dashboard styles
│   │   │   ├── CoachDashboard.jsx  # Coach dashboard (TailwindCSS)
│   │   │   ├── TurfDashboard.jsx   # Turf dashboard (TailwindCSS)
│   │   │   ├── BookCoach.jsx       # Book coach page
│   │   │   ├── BookTurf.jsx        # Book turf page
│   │   │   └── ViewBookings.jsx    # View bookings page
│   │   ├── services/
│   │   │   └── api.js              # Axios instance with auth
│   │   ├── App.jsx                 # Main app with routing
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Global styles
│   └── package.json
│
├── server/                          # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js       # Auth logic (register, login, profile)
│   │   ├── bookingController.js    # Booking CRUD logic
│   │   └── turfController.js       # Turf CRUD logic
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   └── roleMiddleware.js       # Role-based access control
│   ├── models/
│   │   ├── User.js                 # User schema (Player/Coach/Turf)
│   │   ├── Booking.js              # Booking schema
│   │   └── Turf.js                 # Turf schema
│   ├── routes/
│   │   ├── authRoutes.js           # Auth endpoints
│   │   ├── userRoutes.js           # User endpoints
│   │   ├── bookingRoutes.js        # Booking endpoints
│   │   └── turfRoutes.js           # Turf endpoints
│   ├── seeds/
│   │   └── seedData.js             # Sample data seeder
│   ├── server.js                   # Express server entry
│   ├── package.json
│   ├── .env                        # Environment variables
│   └── .env.example                # Example env file
│
├── README.md                        # Main documentation
├── SETUP_GUIDE.md                   # Detailed setup instructions
├── PROJECT_STRUCTURE.md             # This file
└── .gitignore
```

## 🎨 UI/Styling Organization

### Landing Page (Home.jsx)
- **Framework**: Bootstrap 5
- **Styles**: home.css
- **Features**:
  - Animated floating sports icons
  - Hero section with gradient
  - Sports carousel
  - Location cards with maps
  - Features section
  - Testimonials
  - Newsletter signup
  - Contact form
  - Footer

### Dashboard Pages
- **PlayerDashboard**: Bootstrap 5 + playerDashboard.css
- **CoachDashboard**: TailwindCSS
- **TurfDashboard**: TailwindCSS

### Auth Pages
- **Login/Signup**: TailwindCSS
- **Profile Setup**: TailwindCSS

### Booking Pages
- **BookCoach/BookTurf**: TailwindCSS
- **ViewBookings**: TailwindCSS

## 🔄 Data Flow

```
User Action → React Component → Axios (api.js) → Express Route → Controller → Model → MongoDB
                                      ↓
                              JWT Token (localStorage)
                                      ↓
                              AuthContext (Global State)
```

## 🛣️ Routing Structure

### Public Routes
- `/` - Home (Landing page)
- `/login` - Login page
- `/signup` - Signup page

### Protected Routes (Require Authentication)
- `/setup-player` - Player profile setup
- `/setup-coach` - Coach profile setup
- `/setup-turf` - Turf profile setup
- `/player-dashboard` - Player dashboard
- `/coach-dashboard` - Coach dashboard
- `/turf-dashboard` - Turf dashboard
- `/book-coach` - Book a coach
- `/book-turf` - Book a turf
- `/my-bookings` - View bookings
- `/bookings` - Alias for book-turf
- `/coachbookings` - Alias for book-coach

## 🔐 Authentication Flow

1. User signs up → JWT token generated
2. Token stored in localStorage
3. AuthContext provides user state globally
4. Protected routes check authentication
5. API calls include token in headers
6. Backend verifies token with middleware

## 📊 Database Models

### User Model
- Basic fields: firstName, lastName, email, phone, password, role
- Player fields: sport, skill_level, location
- Coach fields: specialization, certification, experience, business_phone
- Turf fields: turf_name, turf_address, pin_code, available_sports

### Booking Model
- userId (reference to User)
- targetId (reference to User - coach or turf)
- bookingType: 'coach' | 'turf'
- date, time
- status: 'pending' | 'approved' | 'rejected' | 'completed'

### Turf Model (Separate entity)
- owner (reference to User)
- turfName, location, pricePerHour
- availableSports, amenities, images

## 🎯 Key Features

### Role-Based Access
- Players: Book coaches/turfs, view bookings
- Coaches: View and manage booking requests
- Turf Owners: View and manage booking requests, manage turfs

### Booking System
- Create bookings
- View own bookings
- View assigned bookings (coach/turf)
- Update booking status (approve/reject)

### Profile Management
- Role-specific profile setup
- Profile completion tracking
- Redirect to setup if incomplete

## 🔧 Configuration Files

### Frontend
- `package.json` - Dependencies and scripts
- `src/services/api.js` - Axios configuration

### Backend
- `package.json` - Dependencies and scripts
- `.env` - Environment variables
- `server.js` - Express configuration

## 📦 Dependencies

### Frontend
- react, react-dom, react-router-dom
- axios
- Bootstrap 5 (CDN)
- Bootstrap Icons (CDN)
- TailwindCSS (CDN)
- AOS Animation (CDN)

### Backend
- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors

## 🚀 Running the Project

### Development
```bash
# Backend
cd server
npm install
npm run seed    # Seed sample data
npm run dev     # Port 5000

# Frontend
cd client
npm install
npm start       # Port 3000
```

### Production
```bash
# Frontend build
cd client
npm run build

# Backend
cd server
npm start
```

## 📝 Notes

- Home page uses Bootstrap for modern landing page
- Dashboards use mix of Bootstrap and TailwindCSS
- Auth pages use TailwindCSS for consistency
- Navbar component only shows on authenticated pages
- Home page has its own integrated navbar
- All API calls go through centralized Axios instance
- JWT tokens automatically attached to requests
- Role-based middleware protects sensitive endpoints

## 🎨 Design System

### Colors (CSS Variables)
- Primary: #4361ee
- Primary Dark: #3a0ca3
- Secondary: #7209b7
- Accent: #f72585
- Success: #06d6a0
- Warning: #ffd60a
- Danger: #ef233c

### Typography
- Font Family: Poppins, Montserrat
- Weights: 300, 400, 500, 600, 700, 800

### Components
- Cards with rounded corners (15px)
- Gradient buttons
- Hover animations
- Box shadows for depth
- Smooth transitions

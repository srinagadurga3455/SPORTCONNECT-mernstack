# 🚀 SportConnect - Pre-Deployment Checklist

## ✅ Issues Fixed

### 1. Environment Variables
- ✅ Added `REACT_APP_API_URL` to client `.env` and `.env.example`
- ✅ Added `CLIENT_URL` to server `.env` and `.env.example`
- ✅ Updated API service to use environment variable
- ✅ Updated email templates to use environment variable

### 2. Email Notifications
- ✅ Implemented verification approval email
- ✅ Implemented verification rejection email
- ✅ All email templates now use `CLIENT_URL` environment variable

### 3. Documentation
- ✅ Created `.env.example` for client
- ✅ Updated server `.env.example` with all required variables

---

## 📋 Pre-Deployment Checklist

### 🔐 Security

- [ ] **Change JWT_SECRET** to a strong random string (min 32 characters)
  ```bash
  # Generate a secure secret:
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

- [ ] **Set NODE_ENV=production** in production environment

- [ ] **Review CORS settings** in `server/server.js`
  - Update to allow only your production domain
  ```javascript
  app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  }));
  ```

- [ ] **Secure MongoDB connection**
  - Use MongoDB Atlas with IP whitelist
  - Strong password for database user
  - Connection string in environment variable only

- [ ] **Rate limiting** - Already implemented ✅

- [ ] **Password validation** - Already implemented ✅

---

### 🔑 API Keys & Credentials

- [ ] **Razorpay**
  - [ ] Get production keys from https://dashboard.razorpay.com/
  - [ ] Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
  - [ ] Test payment flow in production mode

- [ ] **Email Service**
  - [ ] Set up Gmail App Password OR
  - [ ] Integrate SendGrid/AWS SES for production
  - [ ] Update `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM`
  - [ ] Test email delivery

- [ ] **MongoDB Atlas**
  - [ ] Production cluster created
  - [ ] Database user created with strong password
  - [ ] IP whitelist configured
  - [ ] Connection string updated in `MONGODB_URI`

---

### 🌐 Environment Configuration

#### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/sportconnect
JWT_SECRET=<64-character-random-string>
NODE_ENV=production
CLIENT_URL=https://your-domain.com

RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=SportConnect <noreply@sportconnect.com>
```

#### Client (.env)
```env
REACT_APP_API_URL=https://api.your-domain.com/api
```

---

### 📦 Build & Deploy

#### Frontend Build
- [ ] Run production build
  ```bash
  cd client
  npm run build
  ```
- [ ] Test build locally
  ```bash
  npx serve -s build
  ```
- [ ] Check for build errors
- [ ] Verify all routes work
- [ ] Test on mobile devices

#### Backend Deploy
- [ ] Install production dependencies only
  ```bash
  cd server
  npm install --production
  ```
- [ ] Test server startup
  ```bash
  npm start
  ```
- [ ] Verify all API endpoints
- [ ] Check database connection

---

### 🗄️ Database

- [ ] **Seed verified providers** (if needed)
  ```bash
  cd server
  npm run add-verified
  ```

- [ ] **Create admin account**
  ```bash
  npm run create-admin
  ```

- [ ] **Backup strategy** in place
  - MongoDB Atlas automatic backups enabled
  - Manual backup procedure documented

- [ ] **Indexes created** for performance
  - User email (unique)
  - Booking status
  - Verification status

---

### 🧪 Testing

- [ ] **Authentication Flow**
  - [ ] Signup (Player, Coach, Turf)
  - [ ] Login
  - [ ] Logout
  - [ ] Token persistence

- [ ] **Verification System**
  - [ ] Submit verification
  - [ ] Auto-approval with Google URL
  - [ ] Manual admin approval
  - [ ] Rejection flow
  - [ ] Email notifications

- [ ] **Booking Flow**
  - [ ] Create booking
  - [ ] Approve booking
  - [ ] Payment processing
  - [ ] Payment verification
  - [ ] Email notifications

- [ ] **Admin Panel**
  - [ ] Login as admin
  - [ ] View pending verifications
  - [ ] Approve/reject verifications
  - [ ] Validation checks

- [ ] **Security**
  - [ ] Rate limiting works
  - [ ] Password validation
  - [ ] JWT expiration
  - [ ] Protected routes

---

### 🌍 Deployment Platforms

#### Option 1: Vercel (Frontend) + Render (Backend)

**Frontend (Vercel)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd client
vercel --prod
```

**Backend (Render)**
- Create new Web Service
- Connect GitHub repo
- Build command: `cd server && npm install`
- Start command: `cd server && npm start`
- Add environment variables

#### Option 2: Heroku (Full Stack)

**Backend**
```bash
# Install Heroku CLI
heroku create sportconnect-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=...
# Add all other env vars
git push heroku main
```

**Frontend**
```bash
heroku create sportconnect-client
heroku buildpacks:set mars/create-react-app
git push heroku main
```

#### Option 3: AWS (EC2 + S3)

**Frontend (S3 + CloudFront)**
- Build React app
- Upload to S3 bucket
- Configure CloudFront distribution
- Set up custom domain

**Backend (EC2)**
- Launch EC2 instance
- Install Node.js
- Clone repository
- Install dependencies
- Use PM2 for process management
- Configure Nginx as reverse proxy

---

### 📊 Monitoring & Logging

- [ ] **Error tracking** (Sentry, LogRocket)
- [ ] **Performance monitoring** (New Relic, DataDog)
- [ ] **Uptime monitoring** (UptimeRobot, Pingdom)
- [ ] **Analytics** (Google Analytics, Mixpanel)

---

### 🔍 Final Checks

- [ ] All console.log removed from production code ✅
- [ ] No hardcoded URLs ✅
- [ ] All secrets in environment variables ✅
- [ ] HTTPS enabled
- [ ] SSL certificate installed
- [ ] Custom domain configured
- [ ] DNS records updated
- [ ] Robots.txt configured
- [ ] Sitemap.xml created
- [ ] Favicon added
- [ ] Meta tags for SEO
- [ ] Open Graph tags for social sharing
- [ ] Error pages (404, 500)
- [ ] Loading states
- [ ] Mobile responsive ✅
- [ ] Cross-browser testing
- [ ] Accessibility (WCAG)

---

### 📝 Documentation

- [ ] API documentation
- [ ] User guide ✅
- [ ] Admin guide ✅
- [ ] Deployment guide
- [ ] Troubleshooting guide
- [ ] Changelog

---

### 🚨 Emergency Procedures

- [ ] Rollback procedure documented
- [ ] Database backup/restore tested
- [ ] Emergency contacts list
- [ ] Incident response plan

---

## 🎯 Post-Deployment

### Immediate (First 24 hours)
- [ ] Monitor error logs
- [ ] Check server performance
- [ ] Verify email delivery
- [ ] Test payment processing
- [ ] Monitor user signups

### Week 1
- [ ] Gather user feedback
- [ ] Fix critical bugs
- [ ] Optimize performance
- [ ] Review analytics

### Month 1
- [ ] Security audit
- [ ] Performance optimization
- [ ] Feature requests review
- [ ] Scale infrastructure if needed

---

## 📞 Support Contacts

- **MongoDB Atlas**: https://cloud.mongodb.com/support
- **Razorpay**: https://razorpay.com/support/
- **Hosting Provider**: [Your provider support]
- **Domain Registrar**: [Your registrar support]

---

## ✅ Current Status

### Ready for Deployment ✅
- Authentication system
- Verification system with auto-approval
- Payment integration (Razorpay)
- Email notifications
- Admin panel
- Security features (rate limiting, password validation)
- 13 verified providers seeded
- Professional UI/UX

### Needs Configuration Before Deploy ⚠️
1. Production environment variables
2. Production Razorpay keys
3. Email service setup
4. Domain and hosting
5. SSL certificate

### Recommended Before Deploy 💡
1. Add error tracking (Sentry)
2. Add analytics (Google Analytics)
3. Set up monitoring (UptimeRobot)
4. Create backup strategy
5. Write API documentation

---

**Last Updated**: November 16, 2025
**Version**: 1.0.0
**Status**: Production Ready (pending configuration)

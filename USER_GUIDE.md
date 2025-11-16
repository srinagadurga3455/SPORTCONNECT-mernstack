# SportConnect - User Guide

## 🎯 Complete Booking & Payment Flow

### **For Players:**

#### Step 1: Book a Coach/Turf
1. Login as Player
2. Go to "Book a Coach" or "Book a Turf"
3. Browse available coaches/turfs
4. Select one and choose date/time
5. Click "Submit Booking Request"
6. Status: **PENDING** (waiting for approval)

#### Step 2: Wait for Approval
- Coach/Turf owner will review your request
- You'll receive an email when approved
- Check "My Bookings" page for status updates

#### Step 3: Make Payment (After Approval)
1. Go to "My Bookings"
2. Find booking with status: **APPROVED**
3. Click "Pay Now" button (only visible for approved bookings)
4. Select payment method (UPI/Card/Net Banking)
5. Confirm payment
6. Status changes to: **COMPLETED**

---

### **For Coaches/Turfs:**

#### Step 1: Receive Booking Request
1. Login to your Coach/Turf dashboard
2. You'll see "Pending Bookings" section
3. Review booking details:
   - Player name
   - Date & Time
   - Duration
   - Sport (for turfs)

#### Step 2: Approve or Reject
1. Click "Approve" to accept the booking
   - Player receives email notification
   - Player can now make payment
2. Click "Reject" to decline
   - Booking is cancelled

#### Step 3: After Payment
- Once player pays, booking status becomes "Completed"
- You receive confirmation email
- View in "Approved Bookings" section

---

## 🔧 Troubleshooting

### Payment Not Working?

**Check these:**

1. **Is booking approved?**
   - Payment only works for APPROVED bookings
   - Check booking status in "My Bookings"

2. **Is "Pay Now" button visible?**
   - Button only shows for approved bookings
   - Refresh the page if needed

3. **Backend running?**
   - Server must be running on port 5000
   - Check console for errors

4. **Check browser console:**
   - Press F12 to open developer tools
   - Look for any error messages

### Common Issues:

**"Booking must be approved before payment"**
- Solution: Wait for coach/turf to approve your booking

**"This coach/turf is not verified"**
- Solution: Verification is currently disabled, this shouldn't appear

**Booking not showing up**
- Solution: Refresh the page or check if you're logged in

---

## 📧 Email Notifications

### When are emails sent?

1. **Booking Created** → Email to Coach/Turf
2. **Booking Approved** → Email to Player (with payment link)
3. **Payment Completed** → Email to both Player and Coach/Turf

**Note:** Emails are currently in simulation mode (logged to console). To enable real emails, configure nodemailer in `server/utils/emailService.js`

---

## 🔐 Security Features

### Payment Security:
- ✅ Payment only after approval
- ✅ Amount validation
- ✅ Slot conflict prevention
- ✅ User authentication required

### Verification System:
- Currently disabled for easier testing
- Can be enabled by uncommenting code in:
  - `server/routes/userRoutes.js`
  - `server/controllers/bookingController.js`

---

## 🎨 Test Accounts

### Players:
- Email: `player@test.com` | Password: `password123` (Mumbai)
- Email: `player2@test.com` | Password: `password123` (Bangalore)

### Coaches:
- Email: `rahul.coach@sportconnect.com` | Password: `password123`
- Email: `sunil.coach@sportconnect.com` | Password: `password123`

### Turfs:
- Email: `turf.andheri@sportconnect.com` | Password: `password123`
- Email: `turf.bandra@sportconnect.com` | Password: `password123`

---

## 🚀 Quick Start

1. **Start Backend:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd client
   npm start
   ```

3. **Seed Database:**
   ```bash
   cd server
   node seeds/seedData.js
   ```

---

## 📱 Contact & Support

For issues or questions:
- Check browser console (F12)
- Check server logs
- Verify both frontend and backend are running

---

**Happy Booking! 🎉**

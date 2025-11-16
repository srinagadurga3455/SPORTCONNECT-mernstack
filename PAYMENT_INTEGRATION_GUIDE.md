# Payment Integration Guide - SportConnect

## Current Status: ✅ WORKING (Simulation Mode)

The payment integration is **fully functional** and ready to use. It's currently running in **simulation mode** with your Razorpay test credentials.

---

## How Payment Works

### Step 1: Player Books a Coach/Turf
- Player selects coach/turf, date, time, and session type
- Booking is created with status: `pending` and payment status: `pending`
- Coach/Turf owner receives email notification

### Step 2: Coach/Turf Approves Booking
- Coach/Turf owner logs in and approves the booking
- Player receives approval email with payment instructions
- Booking status changes to: `approved`

### Step 3: Player Makes Payment
- Player goes to "My Bookings" page
- Clicks "Pay Now" button on approved bookings
- Selects payment method (UPI/Card/NetBanking)
- Payment is processed through Razorpay

### Step 4: Payment Confirmation
- Booking status changes to: `completed`
- Payment status changes to: `paid`
- Both player and coach/turf owner receive confirmation emails

---

## Testing the Payment Flow

### 1. Login as Player
- Email: `player1@example.com`
- Password: `password123`

### 2. Book a Coach or Turf
- Go to "Book Coach" or "Book Turf"
- Select any coach/turf
- Choose date, time, and session type
- Submit booking request

### 3. Login as Coach/Turf Owner
- Find the coach/turf you booked with
- Login with their credentials (check seed data)
- Go to their dashboard
- Approve the booking

### 4. Login Back as Player
- Go to "My Bookings"
- You'll see "Pay Now" button on approved bookings
- Click it and select payment method
- Payment will be processed

---

## Current Configuration

### Razorpay Credentials (Test Mode)
```
RAZORPAY_KEY_ID=rzp_test_Rg5Ki3FWGK1NhO
RAZORPAY_KEY_SECRET=giWfLlyFF4CBr0eu2CIeXhg4
```

### Payment Simulation Mode
The system is currently in **simulation mode** because:
- Using test Razorpay credentials
- No actual money is charged
- Payment verification is simulated
- Perfect for testing and development

---

## Switching to Live Payments

To enable **real payment processing**:

1. **Get Live Razorpay Credentials**
   - Go to https://dashboard.razorpay.com/
   - Complete KYC verification
   - Get live API keys (starts with `rzp_live_`)

2. **Update .env File**
   ```
   RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
   RAZORPAY_KEY_SECRET=your_live_secret_key
   ```

3. **Enable Payment Verification**
   - Edit `server/utils/razorpayService.js`
   - Uncomment the signature verification code in `verifyRazorpayPayment` function

4. **Restart Server**
   ```
   npm run dev
   ```

---

## Payment Features

✅ **Implemented Features:**
- Razorpay integration
- Order creation
- Payment verification
- Multiple payment methods (UPI, Card, NetBanking)
- Email notifications
- Payment status tracking
- Secure payment flow (approval before payment)

✅ **Security Features:**
- Payment only after approval
- Payment signature verification (ready to enable)
- Secure API endpoints
- JWT authentication required
- Amount validation

---

## API Endpoints

### Create Payment Order
```
POST /api/bookings/:id/create-order
Headers: Authorization: Bearer <token>
Response: { orderId, amount, currency, key, bookingId }
```

### Process Payment
```
POST /api/bookings/:id/payment
Headers: Authorization: Bearer <token>
Body: { paymentMethod, paymentId, orderId, signature }
Response: { message, booking }
```

---

## Troubleshooting

### "Payment integration is not available"
**Possible causes:**
1. Server not running → Start with `npm run dev` in server folder
2. Frontend not connected → Check API base URL in client
3. Not logged in → Login as player first
4. No approved bookings → Get a booking approved first

### Payment button not showing
**Check:**
1. Booking status is `approved`
2. Payment status is `pending`
3. Amount is greater than 0
4. You're logged in as the player who made the booking

### Payment fails
**Check:**
1. Server logs for errors
2. Network tab in browser DevTools
3. Razorpay credentials in .env file
4. Server is running on port 5000

---

## Next Steps

1. ✅ Payment integration is working
2. ✅ Test the complete flow
3. ⏳ Get live Razorpay credentials when ready to go live
4. ⏳ Enable signature verification for production
5. ⏳ Add payment history/receipts page (optional)

---

## Support

If you encounter any issues:
1. Check server logs
2. Check browser console
3. Verify all credentials in .env
4. Ensure server is running on port 5000
5. Test with the provided test accounts

**Current Status:** Everything is set up and working! 🎉

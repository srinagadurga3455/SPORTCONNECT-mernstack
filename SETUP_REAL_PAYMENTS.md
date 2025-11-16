# 🚀 Setup Real Payments & Emails

## ✅ What's Ready

Your app is now configured to support:
- ✅ Real Razorpay payments
- ✅ Real Gmail email notifications
- ✅ Automatic fallback to simulation mode

## 📧 Step 1: Setup Gmail for Emails

### Option A: Gmail App Password (Recommended)

1. **Enable 2-Step Verification:**
   - Go to https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Create App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "SportConnect"
   - Copy the 16-character password

3. **Update `.env`:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # App password from step 2
   EMAIL_FROM=SportConnect <noreply@sportconnect.com>
   ```

### Option B: Use SendGrid (Alternative)

If Gmail doesn't work, use SendGrid:
1. Sign up at https://sendgrid.com/
2. Get API key
3. Update emailService.js to use SendGrid

## 💳 Step 2: Setup Razorpay

### Create Account:

1. **Sign Up:**
   - Go to https://razorpay.com/
   - Click "Sign Up" (Free)
   - Complete registration

2. **Get Test Keys:**
   - Login to Dashboard
   - Go to Settings → API Keys
   - Click "Generate Test Key"
   - Copy both:
     - Key ID (starts with `rzp_test_`)
     - Key Secret

3. **Update `.env`:**
   ```env
   RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
   RAZORPAY_KEY_SECRET=YOUR_ACTUAL_KEY_SECRET
   ```

### Test Cards (Razorpay Test Mode):

- **Success:** 4111 1111 1111 1111
- **Failure:** 4111 1111 1111 1112
- CVV: Any 3 digits
- Expiry: Any future date
- OTP: 1234

## 🔧 Step 3: Install Dependencies

```bash
cd server
npm install nodemailer razorpay
```

## 🧪 Step 4: Test

### Test Emails:

1. Configure EMAIL_USER and EMAIL_PASSWORD in .env
2. Restart server
3. Create a booking and approve it
4. Check your email inbox!

### Test Payments:

1. Configure RAZORPAY keys in .env
2. Restart server
3. Click "Pay Now" on approved booking
4. Razorpay checkout will open
5. Use test card: 4111 1111 1111 1111
6. Complete payment!

## 📝 Your `.env` Should Look Like:

```env
PORT=5000

MONGODB_URI=mongodb+srv://...

JWT_SECRET=super_secret_jwt_key_123
NODE_ENV=development

# Razorpay (Get from https://dashboard.razorpay.com/)
RAZORPAY_KEY_ID=rzp_test_AbCdEfGhIjKlMn
RAZORPAY_KEY_SECRET=YourSecretKeyHere123

# Email (Gmail App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM=SportConnect <noreply@sportconnect.com>
```

## 🎯 How It Works

### Automatic Mode Detection:

**If configured:** Uses real Razorpay + real emails
**If not configured:** Falls back to simulation mode

### Email Flow:

1. Booking created → Email to coach/turf
2. Booking approved → Email to player
3. Payment completed → Emails to both parties

### Payment Flow:

1. Click "Pay Now"
2. Razorpay checkout opens
3. Enter card details
4. Payment processed
5. Confirmation emails sent

## 🔐 Security Notes

- Never commit .env file to Git
- Use test keys for development
- Switch to live keys only in production
- Keep secrets secure

## ❓ Troubleshooting

### Emails Not Sending?

- Check Gmail app password is correct
- Verify 2-Step Verification is enabled
- Check server logs for errors
- Try SendGrid as alternative

### Razorpay Not Working?

- Verify keys are correct (no extra spaces)
- Check you're using test keys (rzp_test_)
- Restart server after updating .env
- Check Razorpay dashboard for errors

### Still in Simulation Mode?

- Check .env file has correct values
- Restart server: `npm run dev`
- Check server logs for "Real Email" or "Real Razorpay"

## 🚀 Go Live (Production)

1. Complete Razorpay KYC verification
2. Get live keys (rzp_live_)
3. Update .env with live keys
4. Set NODE_ENV=production
5. Deploy!

---

**Your app is ready for real payments and emails!** 🎉

Just add your credentials to `.env` and restart the server.

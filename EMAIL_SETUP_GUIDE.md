# Email Setup Guide - SportConnect

## Current Status: Simulation Mode

Emails are currently in **simulation mode** - they're logged to the server console but not actually sent. This is perfect for development and testing.

---

## How to Enable Real Emails

### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Step Verification**
   - Go to https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "SportConnect"
   - Copy the 16-character password

3. **Update .env File**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   EMAIL_FROM=SportConnect <noreply@sportconnect.com>
   ```

4. **Restart Server**
   ```bash
   npm run dev
   ```

### Option 2: Professional Email Service (Production)

For production, use a professional email service:

#### SendGrid (Recommended)
```bash
npm install @sendgrid/mail
```

Update `server/utils/emailService.js`:
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  const msg = { to, from: process.env.EMAIL_FROM, subject, html };
  await sgMail.send(msg);
};
```

#### AWS SES
```bash
npm install @aws-sdk/client-ses
```

#### Mailgun
```bash
npm install mailgun-js
```

---

## Email Types Sent by SportConnect

### 1. Booking Request (to Coach/Turf)
**Trigger:** When player creates a booking
**Recipient:** Coach or Turf owner
**Content:** New booking details, link to dashboard

### 2. Booking Approval (to Player)
**Trigger:** When coach/turf approves booking
**Recipient:** Player who made the booking
**Content:** Approval confirmation, payment link

### 3. Payment Confirmation (to Both)
**Trigger:** When payment is completed
**Recipients:** Both player and coach/turf owner
**Content:** Payment receipt, booking confirmation

---

## Testing Email Flow

### In Simulation Mode (Current)
1. Perform any action (booking, approval, payment)
2. Check server console logs
3. You'll see:
   ```
   📧 Email (Simulation - Configure .env for real emails):
   To: player@example.com
   Subject: Payment Successful - Booking Confirmed
   ```

### With Real Emails
1. Configure Gmail as shown above
2. Restart server
3. Perform actions
4. Check your inbox
5. Server logs will show:
   ```
   ✅ Real Email Sent to: player@example.com
   ```

---

## Troubleshooting

### Gmail "Less secure app access" Error
**Solution:** Use App Password instead of regular password

### "Invalid login" Error
**Check:**
- 2-Step Verification is enabled
- Using App Password (not regular password)
- No extra spaces in .env file
- Email address is correct

### Emails Going to Spam
**Solutions:**
- Use professional email service (SendGrid, AWS SES)
- Set up SPF and DKIM records
- Use verified domain

### Emails Not Sending
**Check:**
1. Server logs for error messages
2. EMAIL_USER and EMAIL_PASSWORD in .env
3. Internet connection
4. Gmail account not locked

---

## Email Templates

All email templates are in `server/utils/emailService.js`:
- Professional HTML design
- Responsive layout
- Clear call-to-action buttons
- Booking details included

To customize:
1. Edit the HTML in emailService.js
2. Test in simulation mode first
3. Use inline CSS (better email client support)

---

## Production Checklist

Before going live:
- [ ] Switch to professional email service (SendGrid/AWS SES)
- [ ] Set up custom domain email
- [ ] Configure SPF/DKIM records
- [ ] Test all email types
- [ ] Add unsubscribe links (if required)
- [ ] Set up email logging/monitoring
- [ ] Add rate limiting to prevent spam

---

## Current Configuration

```env
EMAIL_USER=                    # Empty = Simulation mode
EMAIL_PASSWORD=                # Empty = Simulation mode
EMAIL_FROM=SportConnect <noreply@sportconnect.com>
```

**Status:** ✅ Working in simulation mode
**Action Required:** Configure Gmail or professional service for real emails

---

## Quick Start (Gmail)

1. Go to https://myaccount.google.com/apppasswords
2. Generate app password
3. Update .env:
   ```
   EMAIL_USER=youremail@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```
4. Restart server: `npm run dev`
5. Test by making a booking

That's it! 🎉

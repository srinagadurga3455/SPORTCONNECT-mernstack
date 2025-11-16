// Email service utility
// In production, integrate with SendGrid, AWS SES, or similar service

const sendEmail = async ({ to, subject, html }) => {
  try {
    // Check if email is configured properly
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || 
        process.env.EMAIL_USER === 'your-email@gmail.com' ||
        process.env.EMAIL_USER.trim() === '' ||
        process.env.EMAIL_PASSWORD.trim() === '') {
      console.log('📧 Email (Simulation Mode):');
      console.log('   To:', to);
      console.log('   Subject:', subject);
      console.log('   💡 Configure EMAIL_USER and EMAIL_PASSWORD in .env to send real emails');
      return { success: true, simulated: true };
    }

    // Real email with nodemailer
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    
    console.log('✅ Real Email Sent to:', to);
    return { success: true, simulated: false };
  } catch (error) {
    console.error('❌ Email failed:', error.message);
    console.log('   Falling back to simulation mode');
    console.log('📧 Email (Simulation - Email service error):');
    console.log('   To:', to);
    console.log('   Subject:', subject);
    return { success: true, simulated: true, error: error.message };
  }
};

const sendBookingApprovalEmail = async (booking, playerEmail, playerName) => {
  const subject = 'Booking Approved - Payment Required';
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4361ee;">Booking Approved! 🎉</h2>
      <p>Dear ${playerName},</p>
      <p>Great news! Your booking has been approved.</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Booking Details:</h3>
        <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>Duration:</strong> ${booking.duration} hour(s)</p>
        <p><strong>Amount:</strong> ₹${booking.amount}</p>
      </div>
      
      <p><strong>Next Step:</strong> Please complete the payment to confirm your booking.</p>
      <p>Login to your account and navigate to "My Bookings" to make the payment.</p>
      
      <a href="${clientUrl}/my-bookings" style="display: inline-block; background: #4361ee; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        Pay Now
      </a>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        Thank you for choosing SportConnect!
      </p>
    </div>
  `;

  return await sendEmail({ to: playerEmail, subject, html });
};

const sendPaymentConfirmationEmail = async (booking, userEmail, userName, targetName) => {
  const subject = 'Payment Successful - Booking Confirmed';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #06d6a0;">Payment Successful! ✅</h2>
      <p>Dear ${userName},</p>
      <p>Your payment has been processed successfully. Your booking is now confirmed!</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Booking Confirmation:</h3>
        <p><strong>${booking.bookingType === 'coach' ? 'Coach' : 'Turf'}:</strong> ${targetName}</p>
        <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>Duration:</strong> ${booking.duration} hour(s)</p>
        <p><strong>Amount Paid:</strong> ₹${booking.amount}</p>
        <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>
        <p><strong>Payment ID:</strong> ${booking.paymentId}</p>
      </div>
      
      <p>Please arrive 10 minutes before your scheduled time.</p>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        Thank you for choosing SportConnect!<br>
        For any queries, contact us at support@sportconnect.com
      </p>
    </div>
  `;

  return await sendEmail({ to: userEmail, subject, html });
};

const sendBookingNotificationToProvider = async (booking, providerEmail, providerName, playerName) => {
  const subject = 'New Booking Request';
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4361ee;">New Booking Request 📋</h2>
      <p>Dear ${providerName},</p>
      <p>You have received a new booking request from ${playerName}.</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Booking Details:</h3>
        <p><strong>Player:</strong> ${playerName}</p>
        <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>Duration:</strong> ${booking.duration} hour(s)</p>
        ${booking.sport ? `<p><strong>Sport:</strong> ${booking.sport}</p>` : ''}
      </div>
      
      <p>Please login to your dashboard to approve or reject this booking.</p>
      
      <a href="${clientUrl}/login" style="display: inline-block; background: #4361ee; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        View Dashboard
      </a>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        SportConnect - Connecting Sports Enthusiasts
      </p>
    </div>
  `;

  return await sendEmail({ to: providerEmail, subject, html });
};

module.exports = {
  sendEmail,
  sendBookingApprovalEmail,
  sendPaymentConfirmationEmail,
  sendBookingNotificationToProvider
};

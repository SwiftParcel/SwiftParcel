const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'swiftparcel95@gmail.com',
    pass: 'Swiftparcel@group7',
  },
});

// Initialize Twilio client with correct Account SID and Auth Token
const twilioClient = twilio('ACc9a30385329e6ba2a8810ac07999a799', 'fb2102a13f0c8736993132ea5f3e410f');

// Function to send reset password email
async function sendResetPasswordEmail(email, newPassword) {
  const mailOptions = {
    from: 'swiftparcel95@gmail.com',
    to: email,
    subject: 'Password Reset',
    text: `Your new password is: ${newPassword}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Function to send reset password SMS
async function sendResetPasswordSMS(phoneNumber, newPassword) {
  try {
    await twilioClient.messages.create({
      body: `Your new password is: ${newPassword}`,
      from: '+16614599435', 
      to: phoneNumber,
    });
    console.log('SMS sent successfully.');
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
}

module.exports = {
  sendResetPasswordEmail,
  sendResetPasswordSMS,
};
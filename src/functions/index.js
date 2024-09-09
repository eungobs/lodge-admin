const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Configure the email transport using the default SMTP transport and a GMail account.
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or use another email service
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

exports.sendEmail = functions.https.onCall(async (data, context) => {
  const { email, type, message } = data;

  let subject;
  switch (type) {
    case 'confirmation':
      subject = 'Confirmation Email';
      break;
    case 'marketing':
      subject = 'Marketing Email';
      break;
    case 'reminder':
      subject = 'Reminder Email';
      break;
    default:
      subject = 'Email';
  }

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: subject,
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError('internal', 'Error sending email');
  }
});

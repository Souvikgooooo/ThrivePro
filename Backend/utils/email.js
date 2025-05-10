const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter (service that will send the email like Gmail, SendGrid, Mailgun, etc.)
  //    For development, you can use a service like Mailtrap.io or Ethereal.email
  //    IMPORTANT: Store credentials in environment variables, not directly in code!
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
    // For services like Gmail, you might need to enable "less secure app" access or use OAuth2
  });

  // 2) Define the email options
  const mailOptions = {
    // IMPORTANT: Replace 'YOUR_VERIFIED_SENDER_EMAIL@example.com' with the email address
    // you verified via SendGrid's Single Sender Verification.
    // The name part ("ThrivePro Support") can be whatever you like.
    from: 'ThrivePro Support<alup7192@gmail.com>',
    to: options.email, // Recipient address
    subject: options.subject, // Subject line
    text: options.message, // Plain text body
    // html: // You can also provide an HTML version
  };

  // 3) Actually send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    // Consider throwing the error or handling it based on your application's needs
    // throw new Error('There was an error sending the email. Try again later.');
  }
};

module.exports = sendEmail;

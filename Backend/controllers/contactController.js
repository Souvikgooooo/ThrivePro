const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email'); // Assuming this utility exists

exports.sendContactMessage = catchAsync(async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(new AppError('Please provide your name, email, and message.', 400));
  }

  try {
    const developerEmails = [
      process.env.DEV_EMAIL_1,
      process.env.DEV_EMAIL_2,
      // Add more developer emails as needed from .env
    ].filter(Boolean); // Filter out undefined/null values

    if (developerEmails.length === 0) {
      return next(new AppError('No developer emails configured for contact messages.', 500));
    }

    const emailOptions = {
      email: developerEmails.join(','), // Send to all configured developer emails
      subject: `New Contact Message from ThrivePro: ${name}`,
      html: `
        <p>You have received a new message from the ThrivePro contact form.</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    await sendEmail(emailOptions);

    res.status(200).json({
      status: 'success',
      message: 'Your message has been sent successfully!',
    });
  } catch (error) {
    console.error('Error sending contact email:', error);
    return next(new AppError('There was an error sending your message. Please try again later.', 500));
  }
});

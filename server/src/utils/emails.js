import nodemailer from 'nodemailer'

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email using the configured transporter
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} [options.html] - HTML email content
 * @param {string} [options.from] - Sender email address (optional, uses default if not provided)
 * @returns {Promise<Object>} - Nodemailer send response
 */
const sendEmail = async ({ to, subject, html, from = process.env.EMAIL_USER }) => {
  try {
    const mailOptions = {
      from,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export default sendEmail;
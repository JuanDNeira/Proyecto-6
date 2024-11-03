const nodemailer = require('nodemailer');
const { emailConfig } = require('../config/email');

const transporter = nodemailer.createTransport(emailConfig);

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: `"Sistema JN" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };
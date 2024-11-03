const express = require('express');
const router = express.Router();
const { sendEmail } = require('../services/emailService');

router.post('/send-email', async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    const result = await sendEmail({ to, subject, text, html });
    
    if (result.success) {
      res.json({ success: true, messageId: result.messageId });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
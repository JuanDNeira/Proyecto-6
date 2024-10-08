const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { authMiddleware, isClient } = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, isClient, clientController.getProfile);
router.patch('/profile', authMiddleware, isClient, clientController.updateProfile);

module.exports = router;
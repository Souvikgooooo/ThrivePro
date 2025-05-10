const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authMiddleware.authenticate, authController.logout);

// Password Reset Routes
router.post('/forgot-password', authController.forgotPassword); 
// Changed route to PATCH and added token parameter, removed auth middleware
router.patch('/reset-password/:token', authController.resetPassword); 

module.exports = router;

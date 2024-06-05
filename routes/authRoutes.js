const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/activiate/:code', authController.activiate);
router.post('/verfiyAccount', authController.verifyAccount);

// Protect all routes after this middleware

module.exports = router;

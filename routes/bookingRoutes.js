const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');
//const factory = require('./../controllers/handlerFactory');
//const Booking = require('../models/bookingModel');

const router = express.Router();

router.use(authController.protect);
router.post(
  '/checkout-session/:tourId',
  //bookingController.checkIfHasBookedTour,
  bookingController.getCheckoutSession
);
router.get('/my-booked-tours', bookingController.getMyBookedTour);
router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(bookingController.getAllBooking)
  .post(bookingController.createBooking);

router
  .route('/id')
  .get(bookingController.getBooking)
  .delete(bookingController.deleteBooking)
  .patch(bookingController.updateBooking);
module.exports = router;

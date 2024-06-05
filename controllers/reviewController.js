const catchAsync = require('../utils/catchAsync');
const Review = require('./../models/reviewModel');
const Booking = require('./../models/bookingModel');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
// const catchAsync = require('./../utils/catchAsync');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.allowReviewing = catchAsync(async (req, res, next) => {
  console.log('Middleware execution started');

  const booked = await Booking.findOne({
    user: req.user.id,
    tour: req.body.tour
  });
  console.log('Booking check complete');

  if (!booked) {
    console.log('Booking not found');
    return next(new AppError('You must buy this tour first to review it', 400));
  }

  const existingReview = await Review.findOne({
    user: req.user.id,
    tour: req.body.tour
  });
  console.log('Review check complete');

  if (existingReview) {
    console.log('Review already exists');
    return next(new AppError('You have already reviewed this tour', 400));
  }

  console.log('Proceeding to next middleware');
  next();
});

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

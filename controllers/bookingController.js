const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourModel');
//const Review = require('./../models/reviewModel');

const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1-get current tour
  //console.log('checkout Entered ya basha');
  const tour = await Tour.findById(req.params.tourId);
  //2-create session
  const sessoin = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `https://www.google.com.eg/?hl=ar`,
    //success_url: `https://www.google.com.eg/?hl=ar`,
    cancel_url: `https://fast.com/`,
    customer_email: req.user.email,
    // infrmation about product
    client_reference_id: req.params.tourId,
    // line_items: [
    //   {
    //     name: `${tour.name} Tour`,
    //     description: tour.summary,
    //     images: ['google.com'],
    //     amount: tour.price * 100,
    //     currency: 'usd',
    //     quantity: 1
    //   }
    // ],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary
            //images: ['google.com']
          },
          unit_amount: tour.price * 100
        },
        quantity: 1
      }
    ],
    mode: 'payment'
    //3-send response
  });
  console.log('success');
  res.status(200).json({
    status: 'success',
    session: sessoin
  });
});

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   const { user, tour, price } = req.query;
//   if (!user && !tour && !price) {
//     next();
//   }
//   await Booking.create({ user, tour, price });
//   res.redirect(req.originalUrl.split('?')[0]);
// });
const createBookingCheckout = async session => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.line_items[0].unit_amount / 100;
  await Booking.create({ user, tour, price });
};
exports.getMyBookedTour = catchAsync(async (req, res, next) => {
  const myTours = await Booking.find({ user: req.user.id });
  if (!myTours) next(new AppError('there is no booked tours ', 404));
  res.status(200).json({
    status: 'success',
    myTours
  });
});
exports.checkoutWebHook = async (req, res, next) => {
  console.log('5555 web hook started 55555555');
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SERCRET
    );
  } catch (err) {
    console.log('web hook error');
    return res.status(400).send(`webhook Error :${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    console.log('session is recevied ::', event);

    createBookingCheckout(event.data.object);
  }
  res.status(200).json({ received: true });
};
exports.getBooking = factory.getOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.checkIfHasBookedTour = catchAsync(async (req, res, next) => {
  console.log('Middleware execution started');

  const booked = await Booking.findOne({
    user: req.user.id
  });
  console.log('Booking check complete');
  if (booked) {
    console.log('Booking found');
    return next(new AppError('You must buy only one Tour', 400));
  }

  //console.log('booked check complete');
  console.log('Proceeding to next middleware');
  next();
});

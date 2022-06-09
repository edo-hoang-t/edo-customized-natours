const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // get current tour
  const tour = await Tour.findById(req.params.tourID);

  // create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourID
    }&user=${req.user.id}&price=${tour.price}`,
    // this is not secure since anyone knowing this URL can do a booking without purchasing
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          `https://lakshman-natours.herokuapp.com/img/tours/${tour.imageCover}`
        ],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  //   const session = await stripe.checkout.sessions.create({
  //     payment_method_types: ['card'],

  //     // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
  //     //   req.params.tourId
  //     // }&user=${req.user.id}&price=${tour.price}`,

  //     success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,

  //     cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,

  //     customer_email: req.user.email,

  //     client_reference_id: req.params.tourId,

  //     line_items: [
  //       {
  //         name: `${tour.name} Tour`,
  //         description: tour.summary,
  //         images: [
  //           `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`
  //         ],
  //         amount: tour.price * 100,
  //         currency: 'usd',
  //         quantity: 1
  //       }
  //     ]
  //   });

  // send to client
  res.status(200).json({
    status: 'success',
    session
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour || !user || !price) return next();

  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.getBooking = factory.getOne(Booking);

exports.getAllBookings = factory.getAll(Booking);

exports.createBooking = factory.createOne(Booking);

exports.updateBooking = factory.updateOne(Booking);

exports.deleteBooking = factory.deleteOne(Booking);

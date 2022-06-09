/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51L84Z6DneKUwHg1tswPh8xuIWLX4nmXBGeO4aDnDhFIpDnQYATvjUWqukDtTUE75pAqO0ZahUAMBONn6dCM1uJ6c00RGV5lIfw'
);

export const bookTour = async tourID => {
  try {
    // get checkout session
    console.log('hello in book tour!');
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourID}`
    );

    console.log(session);

    // create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    showAlert('error', err);
  }
};

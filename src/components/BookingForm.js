// src/components/Booking/BookingForm.js
import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const BookingForm = ({ accommodation }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const handleBooking = (details) => {
    // Save booking details to Firestore here
    alert('Booking confirmed!');
  };

  return (
    <form>
      <input type="date" onChange={(e) => setCheckIn(e.target.value)} required />
      <input type="date" onChange={(e) => setCheckOut(e.target.value)} required />
      <input type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)} required />
      
      <PayPalScriptProvider options={{ "client-id": "YOUR_PAYPAL_CLIENT_ID" }}>
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: accommodation.price, // Set the price dynamically
                },
              }],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then(handleBooking);
          }}
        />
      </PayPalScriptProvider>
    </form>
  );
};

export default BookingForm;

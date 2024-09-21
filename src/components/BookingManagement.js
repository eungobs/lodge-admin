// src/components/BookingManagement.js
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const db = getFirestore();
        const bookingsCollection = collection(db, 'bookings');
        const bookingSnapshot = await getDocs(bookingsCollection);
        const bookingList = bookingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(bookingList);
      } catch (err) {
        setError('Error fetching bookings: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Booking Management</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {bookings.map((booking) => (
          <div key={booking.id} style={cardStyle}>
            <h3>{booking.userName}</h3>
            <p><strong>Check-in:</strong> {booking.checkInDate}</p>
            <p><strong>Check-out:</strong> {booking.checkOutDate}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            <button style={buttonStyle} onClick={() => {/* Add any specific action here */}}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '20px',
  width: '200px',
  boxShadow: '2px 2px 10px rgba(0,0,0,0.1)',
};

const buttonStyle = {
  padding: '10px',
  backgroundColor: '#007BFF',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default BookingManagement;

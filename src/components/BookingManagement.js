import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const db = getFirestore();
        const bookingsCollection = collection(db, 'bookings');
        const bookingSnapshot = await getDocs(bookingsCollection);
        const bookingList = bookingSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(bookingList);
      } catch (err) {
        setError('Error fetching bookings: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const db = getFirestore();
      const bookingDocRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingDocRef, { status: newStatus });

      // Update state to reflect changes locally
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );

      setSelectedBooking(null); // Close the modal after updating
    } catch (err) {
      console.error('Error updating booking status: ', err);
    }
  };

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
            <button style={buttonStyle} onClick={() => handleViewDetails(booking)}>View Details</button>
          </div>
        ))}
      </div>

      {selectedBooking && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2>Booking Details</h2>
            <p><strong>User ID:</strong> {selectedBooking.userId}</p>
            <p><strong>User Name:</strong> {selectedBooking.userName}</p>
            <p><strong>Email:</strong> {selectedBooking.email}</p>
            <p><strong>Phone Number:</strong> {selectedBooking.phoneNumber}</p>
            <p><strong>Address:</strong> {selectedBooking.address}</p>
            <p><strong>Check-in Date:</strong> {selectedBooking.checkInDate}</p>
            <p><strong>Check-out Date:</strong> {selectedBooking.checkOutDate}</p>
            <p><strong>Room Price:</strong> ${selectedBooking.roomPrice}</p>
            <p><strong>Payment Method:</strong> {selectedBooking.paymentMethod}</p>
            <p><strong>Date of Booking:</strong> {selectedBooking.bookingDate}</p>
            <p><strong>Status:</strong> {selectedBooking.status}</p>

            {/* Approve and Decline buttons */}
            <div style={{ marginTop: '20px' }}>
              <button
                style={{ ...buttonStyle, backgroundColor: '#28a745', marginRight: '10px' }}
                onClick={() => updateBookingStatus(selectedBooking.id, 'Approved')}
              >
                Approve
              </button>
              <button
                style={{ ...buttonStyle, backgroundColor: '#dc3545' }}
                onClick={() => updateBookingStatus(selectedBooking.id, 'Declined')}
              >
                Decline
              </button>
            </div>

            <button onClick={closeModal} style={closeButtonStyle}>Close</button>
          </div>
        </div>
      )}
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

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '400px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
};

const closeButtonStyle = {
  padding: '10px',
  backgroundColor: '#FF6347',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default BookingManagement;

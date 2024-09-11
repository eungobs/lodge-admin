import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner } from 'react-bootstrap';
import { firestore } from '../firebaseconfig'; // Make sure this path is correct
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import emailjs from 'emailjs-com';
import './AccommodationManagement.css'; // Custom CSS for styling

const AccommodationManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings from Firebase Firestore
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Reference to the 'bookings' collection in Firestore
        const bookingsCollection = collection(firestore, 'bookings');
        const bookingSnapshot = await getDocs(bookingsCollection);
        const bookingList = bookingSnapshot.docs.map((doc, index) => ({
          id: doc.id,
          name: doc.data().name,
          surname: doc.data().surname,
          roomNumber: doc.data().roomNumber,
          email: doc.data().email,
          contact: doc.data().contact,
          paymentStatus: doc.data().paymentStatus,
          index: index + 1,
        }));
        setBookings(bookingList);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Function to send confirmation email using EmailJS
  const sendConfirmationEmail = (booking) => {
    const templateParams = {
      user_id: booking.id,
      name: booking.name,
      surname: booking.surname,
      room_number: booking.roomNumber,
      email: booking.email,
      contact: booking.contact,
    };

    emailjs
      .send('service_5gxtz2e', 'template_dg7330r', templateParams, 'oEKaFqTlXsJvcTae6')
      .then((response) => {
        console.log('Email sent successfully', response);
        alert(`Confirmation email sent to ${booking.email}`);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  };

  // Function to cancel a booking
  const cancelBooking = async (bookingId) => {
    try {
      const bookingRef = doc(firestore, 'bookings', bookingId);
      await updateDoc(bookingRef, { paymentStatus: 'Cancelled' });
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, paymentStatus: 'Cancelled' } : booking
        )
      );
      alert('Booking has been cancelled');
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
        <h2>Loading bookings...</h2>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Accommodation Management</h2>

      <Table striped bordered hover responsive className="custom-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User ID</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Room Number</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.index}</td>
              <td>{booking.id}</td>
              <td>{booking.name}</td>
              <td>{booking.surname}</td>
              <td>{booking.roomNumber}</td>
              <td>{booking.email}</td>
              <td>{booking.contact}</td>
              <td>{booking.paymentStatus}</td>
              <td>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => sendConfirmationEmail(booking)}
                >
                  Confirm Booking
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="ml-2"
                  onClick={() => cancelBooking(booking.id)}
                >
                  Cancel Booking
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AccommodationManagement;















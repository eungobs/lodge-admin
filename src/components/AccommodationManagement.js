import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { firestore } from '../firebaseconfig'; // Firebase Firestore configuration
import { collection, getDocs } from 'firebase/firestore';
import emailjs from 'emailjs-com'; // EmailJS for sending confirmation emails

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
        const bookingList = bookingSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(bookingList); // Set the bookings state with the data
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchBookings(); // Call the function to fetch bookings on component mount
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
      .send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_USER_ID')
      .then((response) => {
        console.log('Email sent successfully', response);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <h2>Loading bookings...</h2>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center">Accommodation Management</h2>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Room Number</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.name}</td>
              <td>{booking.surname}</td>
              <td>{booking.roomNumber}</td>
              <td>{booking.email}</td>
              <td>{booking.contact}</td>
              <td>
                <Button onClick={() => sendConfirmationEmail(booking)}>
                  Confirm
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




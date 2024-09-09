import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import { firestore } from '../firebaseconfig'; // Import Firestore instance correctly
import { collection, getDocs } from 'firebase/firestore';

const AccommodationManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsCollection = collection(firestore, 'bookings'); // Use 'firestore' here
        const bookingSnapshot = await getDocs(bookingsCollection);
        const bookingList = bookingSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
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

  if (loading) {
    return (
      <Container className="mt-5">
        <h2>Loading bookings...</h2>
      </Container>
    );
  }

  const formatDate = (timestamp) => {
    return timestamp ? new Date(timestamp.toDate()).toLocaleDateString() : '';
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Accommodation Management</h2>

      <h3 className="mt-4">Successful Bookings</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Accommodation ID</th>
            <th>Check-in Date</th>
            <th>Check-out Date</th>
            <th>Total Amount</th>
            <th>Adults</th>
            <th>Children</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings
            .filter((booking) => booking.status === 'successful')
            .map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.name}</td>
                <td>{booking.email}</td>
                <td>{booking.accommodationId}</td>
                <td>{formatDate(booking.checkInDate)}</td>
                <td>{formatDate(booking.checkOutDate)}</td>
                <td>${booking.totalAmount}</td>
                <td>{booking.adults}</td>
                <td>{booking.children}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
        </tbody>
      </Table>

      <h3 className="mt-4">Unsuccessful Bookings</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Accommodation ID</th>
            <th>Check-in Date</th>
            <th>Check-out Date</th>
            <th>Total Amount</th>
            <th>Adults</th>
            <th>Children</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings
            .filter((booking) => booking.status === 'unsuccessful')
            .map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.name}</td>
                <td>{booking.email}</td>
                <td>{booking.accommodationId}</td>
                <td>{formatDate(booking.checkInDate)}</td>
                <td>{formatDate(booking.checkOutDate)}</td>
                <td>${booking.totalAmount}</td>
                <td>{booking.adults}</td>
                <td>{booking.children}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AccommodationManagement;

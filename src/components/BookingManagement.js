import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { styled } from 'styled-components';

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

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Check if it's a Firestore Timestamp
      const date = dateString.seconds 
        ? new Date(dateString.seconds * 1000) 
        : new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

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

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );

      setSelectedBooking(null);
    } catch (err) {
      console.error('Error updating booking status: ', err);
    }
  };

  if (loading) return <LoadingContainer>Loading bookings...</LoadingContainer>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Container>
      <Title>Booking Management</Title>
      <BookingList>
        {bookings.map((booking) => {
          // Determine check-in and check-out dates
          const checkInDate = booking.bookingDetails?.checkInDate || booking.checkInDate;
          const checkOutDate = booking.bookingDetails?.checkOutDate || booking.checkOutDate;

          return (
            <BookingCard key={booking.id}>
              <BookingName>{booking.userName || 'Unknown User'}</BookingName>
              <BookingDetail><strong>Check-in:</strong> {formatDate(checkInDate)}</BookingDetail>
              <BookingDetail><strong>Check-out:</strong> {formatDate(checkOutDate)}</BookingDetail>
              <BookingDetail><strong>Status:</strong> {booking.status || 'Pending'}</BookingDetail>
              <ViewDetailsButton onClick={() => handleViewDetails(booking)}>
                View Details
              </ViewDetailsButton>
            </BookingCard>
          );
        })}
      </BookingList>

      {selectedBooking && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Booking Details</ModalTitle>
            <ModalDetail><strong>User ID:</strong> {selectedBooking.userId}</ModalDetail>
            <ModalDetail><strong>User Name:</strong> {selectedBooking.userName}</ModalDetail>
            <ModalDetail><strong>Email:</strong> {selectedBooking.email}</ModalDetail>
            <ModalDetail><strong>Phone Number:</strong> {selectedBooking.phoneNumber}</ModalDetail>
            <ModalDetail><strong>Address:</strong> {selectedBooking.address}</ModalDetail>
            
            <ModalDetail>
              <strong>Check-in Date:</strong> {formatDate(
                selectedBooking.bookingDetails?.checkInDate || 
                selectedBooking.checkInDate
              )}
            </ModalDetail>
            <ModalDetail>
              <strong>Check-out Date:</strong> {formatDate(
                selectedBooking.bookingDetails?.checkOutDate || 
                selectedBooking.checkOutDate
              )}
            </ModalDetail>
            
            <ModalDetail><strong>Room Price:</strong> ${selectedBooking.roomPrice}</ModalDetail>
            <ModalDetail><strong>Payment Method:</strong> {selectedBooking.paymentMethod}</ModalDetail>
            <ModalDetail><strong>Date of Booking:</strong> {formatDate(selectedBooking.bookingDate)}</ModalDetail>
            <ModalDetail><strong>Status:</strong> {selectedBooking.status}</ModalDetail>

            <ModalActions>
              <ApproveButton onClick={() => updateBookingStatus(selectedBooking.id, 'Approved')}>
                Approve
              </ApproveButton>
              <DeclineButton onClick={() => updateBookingStatus(selectedBooking.id, 'Declined')}>
                Decline
              </DeclineButton>
            </ModalActions>

            <CloseButton onClick={closeModal}>Close</CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const BookingList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const BookingCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const BookingName = styled.h3`
  margin-bottom: 10px;
  color: #333;
`;

const BookingDetail = styled.p`
  margin-bottom: 5px;
`;

const ViewDetailsButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const ModalTitle = styled.h2`
  margin-bottom: 20px;
  text-align: center;
`;

const ModalDetail = styled.p`
  margin-bottom: 10px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const ApproveButton = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }
`;

const DeclineButton = styled.button`
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c82333;
  }
`;

const CloseButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 15px;
  cursor: pointer;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

export default BookingManagement;
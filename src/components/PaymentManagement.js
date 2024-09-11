import React, { useState, useEffect, useCallback } from 'react';
import { firestore, auth } from '../firebaseconfig'; // Import from firebaseconfig
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/PaymentManagement.css';

function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const fetchPayments = useCallback(async () => {
    try {
      if (!user) {
        setError('User not authenticated.');
        return;
      }

      const paymentCollection = collection(firestore, 'payments');
      const paymentSnapshot = await getDocs(paymentCollection);
      const paymentList = paymentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPayments(paymentList);
    } catch (error) {
      setError('Error fetching payment records: ' + error.message);
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchPayments(); // Fetch payments if user is authenticated
      } else {
        setError('User not authenticated.');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [fetchPayments]);

  return (
    <div className="payment-management">
      <h2>Payment Management</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {payments.length > 0 ? (
        <table className="custom-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Booking ID</th>
              <th>Customer Name</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Booking Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.bookingId}</td>
                <td>{payment.customerName}</td>
                <td>${payment.amount}</td>
                <td>{payment.paymentStatus}</td>
                <td>{payment.bookingDate ? new Date(payment.bookingDate.toDate()).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No payment records found.</p>
      )}
    </div>
  );
}

export default PaymentManagement;


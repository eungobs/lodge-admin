import React, { useState, useEffect } from 'react';
import { firestore } from '../firebaseconfig'; // Ensure this matches your firebaseconfig
import { collection, getDocs } from 'firebase/firestore';

function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const paymentCollection = collection(firestore, 'payments');
      const paymentSnapshot = await getDocs(paymentCollection);
      const paymentList = paymentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPayments(paymentList);
    } catch (error) {
      setError('Error fetching payment records: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Payment Management</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {payments.length > 0 ? (
        <table>
          <thead>
            <tr>
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
                <td>{payment.bookingId}</td>
                <td>{payment.customerName}</td>
                <td>${payment.amount}</td>
                <td>{payment.paymentStatus}</td>
                <td>{new Date(payment.bookingDate.toDate()).toLocaleDateString()}</td>
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

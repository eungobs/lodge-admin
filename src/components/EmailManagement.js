import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';

const EmailManagement = () => {
  const [email, setEmail] = useState('');
  const [emailType, setEmailType] = useState('confirmation'); // 'confirmation', 'marketing', 'reminder'
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // New state for loading
  const [user, setUser] = useState(null); // State for user authentication

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Set the current user
    });
    return () => unsubscribe(); // Cleanup subscription
  }, []);

  const handleSendEmail = async () => {
    if (!user) {
      setError('You must be logged in to send emails.');
      return;
    }
    
    setLoading(true); // Start loading
    try {
      // Send email via Firebase Cloud Function
      const response = await fetch('https://us-central1-sunset-heaven-lodge.cloudfunctions.net/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          emailType,
          message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error('Error sending email: ' + errorData.message);
      }

      alert('Email sent successfully!');
      // Reset the form fields
      setEmail('');
      setEmailType('confirmation');
      setMessage('');
    } catch (error) {
      setError('Error sending email: ' + error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <h2>Email Management</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
      </div>
      <div>
        <label>Type of Email:</label>
        <select value={emailType} onChange={(e) => setEmailType(e.target.value)}>
          <option value="confirmation">Confirmation</option>
          <option value="marketing">Marketing</option>
          <option value="reminder">Reminder</option>
        </select>
      </div>
      <div>
        <label>Message:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message here"
        />
      </div>
      <button onClick={handleSendEmail} disabled={loading}>
        {loading ? 'Sending...' : 'Send Email'}
      </button>
    </div>
  );
};

export default EmailManagement;

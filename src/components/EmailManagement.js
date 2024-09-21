import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';

const EmailManagement = () => {
  const [email, setEmail] = useState('');
  const [emailType, setEmailType] = useState('confirmation'); // 'confirmation', 'marketing', 'reminder'
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // New state for loading

  const handleSendEmail = async () => {
    setLoading(true); // Start loading
    try {
      const functions = getFunctions();
      const sendEmail = httpsCallable(functions, 'sendEmail');
      await sendEmail({ email, type: emailType, message });
      alert('Email sent successfully!');
      // Reset the form fields if needed
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


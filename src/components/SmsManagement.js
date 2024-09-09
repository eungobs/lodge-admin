import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseconfig'; // Adjusted import to use firebaseconfig
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider } from 'firebase/auth'; // Import necessary functions from firebase/auth

function SmsManagement() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');

  useEffect(() => {
    setupRecaptcha();
  }, []);

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: (response) => {
        console.log('reCAPTCHA resolved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      }
    }, auth);
  };

  const handleSendCode = async () => {
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setVerificationId(confirmationResult.verificationId);
      alert('Verification code sent!');
    } catch (error) {
      alert('Error sending verification code: ' + error.message);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      await auth.signInWithCredential(credential);
      alert('Phone number verified!');
    } catch (error) {
      alert('Error verifying code: ' + error.message);
    }
  };

  return (
    <div>
      <h2>SMS Management</h2>
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Enter phone number"
      />
      <button onClick={handleSendCode}>Send Code</button>
      <div id="recaptcha-container"></div>
      <input
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        placeholder="Enter verification code"
      />
      <button onClick={handleVerifyCode}>Verify Code</button>
    </div>
  );
}

export default SmsManagement;

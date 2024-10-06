// src/components/ProfileManagement.js
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { FaBan, FaUnlockAlt, FaEnvelope } from 'react-icons/fa'; // Import icons for block/unblock and email
import './ProfileManagement.css';

const ProfileManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const userData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [db]);

  // Toggle block/unblock user and update the UI immediately
  const toggleBlockUser = async (userId, isBlocked) => {
    try {
      // Update local state immediately for UI feedback
      setUsers(users.map(user => user.id === userId ? { ...user, blocked: !isBlocked } : user));

      // Update in Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { blocked: !isBlocked });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-management">
      <h2>User Profiles</h2>
      <div className="card-container">
        {users.map(user => (
          <div className="user-card" key={user.id}>
            <h3>{user.name}</h3>
            <p>
              Email: {user.email}
              {/* Email icon with mailto link */}
              <a href={`mailto:${user.email}`} title="Send Email" style={{ marginLeft: '10px' }}>
                <FaEnvelope color="#007bff" />
              </a>
            </p>
            {/* Show block/unblock status and icons */}
            <p>
              Status: {user.blocked ? 'Blocked' : 'Active'} 
              {user.blocked ? <FaBan color="red" style={{ marginLeft: '10px' }} /> : <FaUnlockAlt color="green" style={{ marginLeft: '10px' }} />}
            </p>
            {/* Block/Unblock button */}
            <button 
              onClick={() => toggleBlockUser(user.id, user.blocked)} 
              style={{ cursor: 'pointer' }}
            >
              {user.blocked ? 'Unblock User' : 'Block User'}
            </button>

            {/* Booking details */}
            {user.bookingDetails && (
              <div className="booking-status">
                <p>Booking Status: {user.bookingDetails.status}</p>
                <p>Check-In Date: {user.bookingDetails.checkInDate}</p>
                <p>Check-Out Date: {user.bookingDetails.checkOutDate}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileManagement;


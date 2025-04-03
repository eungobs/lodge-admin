import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  FaBan, 
  FaUnlockAlt, 
  FaEnvelope, 
  FaIdCard, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaArrowLeft 
} from 'react-icons/fa';
import './ProfileManagement.css';

const ProfileManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const db = getFirestore();
  const navigate = useNavigate();

  // Function to handle going back to admin dashboard
  const handleGoBack = () => {
    navigate('/admin-dashboard');
  };

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const userData = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        setUsers(userData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [db]);

  // Toggle block/unblock user
  const toggleBlockUser = async (userId, isBlocked) => {
    try {
      // Optimistically update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, blocked: !isBlocked } 
          : user
      ));

      // Update in Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { blocked: !isBlocked });
    } catch (error) {
      console.error('Error updating user status:', error);
      // Revert local state if update fails
      setUsers(users);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={handleGoBack}>Back to AdminDashboard </button>
      </div>
    );
  }

  return (
    <div className="profile-management-container">
      {/* Back Button */}
      <div className="back-button-container">
        <button 
          className="back-button" 
          onClick={handleGoBack}
        >
          <FaArrowLeft /> Back to AdminDashboard
        </button>
      </div>

      <h2 className="profile-management-title">User Profiles</h2>
      
      {users.length === 0 ? (
        <div className="no-users-container">
          <p>No users found</p>
        </div>
      ) : (
        <div className="card-container">
          {users.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-header">
                <h3 className="user-name">
                  {user.name} {user.surname}
                </h3>
                <a 
                  href={`mailto:${user.email}`} 
                  title="Send Email" 
                  className="email-link"
                >
                  <FaEnvelope color="#007bff" />
                </a>
              </div>

              <div className="user-details">
                <div className="user-detail">
                  <FaIdCard /> 
                  <span>ID Number: {user.idNumber || 'Not provided'}</span>
                </div>

                <div className="user-detail">
                  <FaPhone /> 
                  <span>Phone: {user.phoneNumber || 'Not provided'}</span>
                </div>

                <div className="user-detail">
                  <FaMapMarkerAlt /> 
                  <span>Address: {user.address || 'Not provided'}</span>
                </div>
              </div>

              <div className="contact-info">
                <p>Email: {user.email}</p>
                <div className="status-container">
                  <p>
                    Status: {user.blocked ? 'Blocked' : 'Active'} 
                    {user.blocked 
                      ? <FaBan color="red" className="status-icon" /> 
                      : <FaUnlockAlt color="green" className="status-icon" />
                    }
                  </p>
                </div>
              </div>

              <button 
                className={`action-button ${user.blocked ? 'blocked' : 'active'}`}
                onClick={() => toggleBlockUser(user.id, user.blocked)}
              >
                {user.blocked ? 'Unblock User' : 'Block User'}
              </button>

              {user.bookingDetails && (
                <div className="booking-status">
                  <h4>Booking Details</h4>
                  <p>Status: {user.bookingDetails.status}</p>
                  <p>Check-In: {user.bookingDetails.checkInDate}</p>
                  <p>Check-Out: {user.bookingDetails.checkOutDate}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileManagement;

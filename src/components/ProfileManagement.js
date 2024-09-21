// src/components/ProfileManagement.js
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import './ProfileManagement.css'; // Create a CSS file for styles

const ProfileManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

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

  const blockUser = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { blocked: true }); // Assuming you have a blocked field
      setUsers(users.map(user => user.id === userId ? { ...user, blocked: true } : user));
    } catch (error) {
      console.error('Error blocking user:', error);
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
            <p>Email: {user.email}</p>
            <p>Status: {user.blocked ? 'Blocked' : 'Active'}</p>
            <button onClick={() => blockUser(user.id)} disabled={user.blocked}>
              {user.blocked ? 'Blocked' : 'Block User'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileManagement;

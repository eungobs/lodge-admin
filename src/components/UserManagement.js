import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebaseconfig'; // Correct import
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './UserManagement.css'; // Adjust path as needed

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch user data on component load
  useEffect(() => {
    fetchUsers();
    checkAdminStatus();
  }, []);

  // Check if current user is an admin
  const checkAdminStatus = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        setIsAdmin(!!idTokenResult.claims.admin);
      }
    } catch (error) {
      setError('Error checking admin status: ' + error.message);
    }
  };

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const userCollection = collection(firestore, 'users');
      const userSnapshot = await getDocs(userCollection);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    } catch (error) {
      setError('Error fetching users: ' + error.message);
    }
  };

  // Delete user from Firestore
  const handleDeleteUser = async (userId) => {
    if (isAdmin) {
      try {
        await deleteDoc(doc(firestore, 'users', userId));
        fetchUsers(); // Refresh the user list
        alert('User deleted successfully!');
      } catch (error) {
        setError('Error deleting user: ' + error.message);
      }
    } else {
      setError('You do not have permission to delete users.');
    }
  };

  return (
    <Container className="user-management-container">
      <h2>User Management</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {users.length > 0 ? (
        <Row>
          {users.map((user) => (
            <Col md={6} lg={4} key={user.id} className="mb-4">
              <Card className="user-card">
                <Card.Body>
                  <div className="text-center">
                    {user.profileImage && (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                      />
                    )}
                    <h4>{user.fullName}</h4>
                    <p>Email: {user.email}</p>
                    <p>Phone: {user.phoneNumber}</p>
                    <p>Address: {user.streetAddress}, {user.city}, {user.stateCountry}</p>
                  </div>
                  {isAdmin && (
                    <div className="text-center mt-4">
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete User
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No users found.</p>
      )}
    </Container>
  );
}

export default UserManagement;

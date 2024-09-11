import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faSms } from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseconfig';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="sidebar">
      <div className="icon-container">
        <FontAwesomeIcon 
          icon={faEnvelope} 
          className="sidebar-icon"
          onClick={() => navigate('/emailmanagement')} 
        />
        <FontAwesomeIcon 
          icon={faSms} 
          className="sidebar-icon"
          onClick={() => navigate('/smsmanagement')} 
        />
      </div>
      <button onClick={() => navigate('/login')} className="sidebar-button">Login</button>
      <button onClick={() => navigate('/roommanagement')} className="sidebar-button">Room Management</button>
      <button onClick={() => navigate('/eventmanagement')} className="sidebar-button">Event Management</button>
      <button onClick={() => navigate('/paymentmanagement')} className="sidebar-button">Payment Management</button>
      <button onClick={() => navigate('/usermanagement')} className="sidebar-button">User Management</button>
      <button onClick={() => navigate('/accommodationmanagement')} className="sidebar-button">Accommodation Management</button>
      <button onClick={() => navigate('/aboutpagemanagement')} className="sidebar-button">About Page Management</button>
      <button onClick={handleLogout} className="sidebar-button">Logout</button>
    </div>
  );
};

export default Sidebar;

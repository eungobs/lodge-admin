// src/components/Dashboard.js
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useNavigate, Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaEnvelope } from 'react-icons/fa'; // Import only the email icon

// Registering necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Data for the graph
  const data = {
    labels: ['New Bookings', 'Checkouts', 'Cancellations'],
    datasets: [
      {
        label: 'Booking Statistics',
        data: [20, 10, 5], // Sample data for the graph
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Options for the graph (optional)
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Hotel Booking Statistics',
      },
    },
  };

  const toggleMode = () => {
    setDarkMode(!darkMode);
  };

  const handleUserProfileClick = () => {
    navigate('/login'); // Navigate to login first
    setTimeout(() => {
      navigate('/profile-management'); // Then navigate to user profile after a brief delay
    }, 1000); // Adjust the delay as necessary
  };

  const handleUserBookingsClick = () => {
    navigate('/login'); // Navigate to login first
    setTimeout(() => {
      navigate('/booking-management'); // Then navigate to booking management after a brief delay
    }, 1000); // Adjust the delay as necessary
  };

  return (
    <div style={{ padding: '20px', backgroundColor: darkMode ? '#333' : '#f0f0f0', color: darkMode ? '#fff' : '#000', minHeight: '100vh' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="https://i.pinimg.com/564x/d2/c1/36/d2c136b481507a78ad8eee3933a6026d.jpg" 
            alt="Hotel Logo" 
            style={{ width: '100px', height: '100px', marginRight: '20px', borderRadius: '8px' }} 
          />
          <div style={{ textAlign: 'left' }}>
            <h1>Sunset Heaven Dashboard</h1>
            <h2>Admin: Elizabeth Ndzukule</h2>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/email-management" style={{ margin: '0 10px' }}>
            <FaEnvelope size={24} title="Email Management" style={{ cursor: 'pointer', color: darkMode ? '#fff' : '#000' }} />
          </Link>
          <button onClick={handleUserProfileClick} style={{ margin: '0 10px', background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#fff' : '#000' }}>
            User Profile
          </button>
          <button onClick={handleUserBookingsClick} style={{ margin: '0 10px', background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#fff' : '#000' }}>
            User Bookings
          </button>
        </div>
      </header>

      {/* Graph */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Bar data={data} options={options} />
      </div>

      {/* Buttons to navigate and toggle mode */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <button
          style={buttonStyle}
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
        <button
          style={buttonStyle}
          onClick={toggleMode}
        >
          Switch to {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  margin: '10px',
  fontSize: '16px',
  backgroundColor: '#000000',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default Dashboard;

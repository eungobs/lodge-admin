import React from 'react';
import Sidebar from './Sidebar';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h2>Admin</h2>
        <p>Elizabeth Ndzukule.</p> {/* Example of text */}

        {/* Add the new text here */}
        <div className="footer-info">
          <h4>Sunset Heaven Lodge</h4>
          <p>Admin: Elizabeth Ndzukule</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;





import React from 'react';
import Sidebar from './Sidebar';
import './Dashboard.css';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function Dashboard() {
  const data = {
    labels: ['Bookings', 'Check-outs', 'Cancellations'],
    datasets: [
      {
        label: 'Daily Statistics',
        data: [12, 7, 3], // Example data, replace with your actual data
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <div className="footer-info">
          <h4>Sunset Heaven Lodge</h4>
          <p>Admin: Elizabeth Ndzukule</p>
        </div>
        <div className="graph-container">
          <Bar data={data} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;









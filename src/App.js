import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import EmailManagement from './components/EmailManagement';
import SmsManagement from './components/SmsManagement';
import Login from './components/Login';
import RoomManagement from './components/RoomManagement';
import EventManagement from './components/EventManagement';
import PaymentManagement from './components/PaymentManagement';
import UserManagement from './components/UserManagement';
import AccommodationManagement from './components/AccommodationManagement';
import AboutPageManagement from './components/AboutPageManagement';
import Dashboard from './components/Dashboard'; // Import Dashboard

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} /> {/* Default route */}
            <Route path="/emailmanagement" element={<EmailManagement />} />
            <Route path="/smsmanagement" element={<SmsManagement />} />
            <Route path="/login" element={<Login />} />
            <Route path="/roommanagement" element={<RoomManagement />} />
            <Route path="/eventmanagement" element={<EventManagement />} />
            <Route path="/paymentmanagement" element={<PaymentManagement />} />
            <Route path="/usermanagement" element={<UserManagement />} />
            <Route path="/accommodationmanagement" element={<AccommodationManagement />} />
            <Route path="/aboutpagemanagement" element={<AboutPageManagement />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/Login';
import AccommodationList from './components/AccommodationList';
import AddAccommodation from './components/AddAccommodation'; // Import the AddAccommodation component
import EmailManagement from './components/EmailManagement'; // Import EmailManagement component
import ProfileManagement from './components/ProfileManagement'; // Import ProfileManagement component
import BookingManagement from './components/BookingManagement'; // Import BookingManagement component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/accommodations" element={<AccommodationList />} />
        <Route path="/add-accommodation/:id?" element={<AddAccommodation />} /> {/* Updated route with optional ID */}
        <Route path="/email-management" element={<EmailManagement />} /> {/* Route for EmailManagement */}
        <Route path="/profile-management" element={<ProfileManagement />} /> {/* Route for ProfileManagement */}
        <Route path="/booking-management" element={<BookingManagement />} /> {/* Route for BookingManagement */}
      </Routes>
    </Router>
  );
};

export default App;
;









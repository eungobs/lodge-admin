import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ensure this path is correct
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for navigation
import './AccommodationList.css';

const AccommodationList = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate for editing

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "accommodationRoom")); // Ensure this matches your Firestore structure
        const fetchedAccommodations = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setAccommodations(fetchedAccommodations);
      } catch (error) {
        console.error('Error fetching accommodations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAccommodations();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "accommodationRoom", id)); // Ensure this matches your Firestore structure
      setAccommodations(prev => prev.filter(acc => acc.id !== id));
    } catch (error) {
      console.error('Error deleting accommodation:', error);
    }
  };

  const handleEdit = (acc) => {
    navigate('/add-accommodation', { state: acc }); // Pass the accommodation object
  };

  return (
    <div className="accommodation-list">
      <h1>Accommodations</h1>
      <Link to="/add-accommodation">
        <button className="add-button">Add Accommodation</button>
      </Link>
      {loading ? (
        <p>Loading accommodations...</p>
      ) : accommodations.length === 0 ? (
        <p>No accommodations available.</p>
      ) : (
        accommodations.map(acc => (
          <div key={acc.id} className="accommodation-card">
            <h2>{acc.name}</h2>
            <div className="image-container">
              {acc.images && acc.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={acc.name}
                  className="accommodation-image"
                  onClick={() => window.open(image)} // Open the image in a new tab on click
                />
              ))}
            </div>
            <div className="card-details">
              <p><strong>Description:</strong> Luxury Room with a beautiful bathroom and furniture</p>
              <p><strong>Price:</strong> ${acc.price} per night</p>
              <p><strong>Available Bed Types:</strong> {acc.bedTypes || 'N/A'}</p>
              <p><strong>Children Policy:</strong> {acc.childrenPolicy || 'N/A'}</p>
              <p><strong>Extra Bed Policy:</strong> {acc.extraBedPolicy || 'N/A'}</p>
              <div>
                <h4>Custom Policies:</h4>
                <p>{acc.customPolicies || 'Children From 13 Years must pay adult price'}</p>
              </div>
              <div>
                <h4>Utilities:</h4>
                <ul>
                  {acc.utilities ? (
                    Object.entries(acc.utilities).map(([key, value]) => (
                      value && <li key={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</li>
                    ))
                  ) : (
                    <li>No utilities available.</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="card-buttons">
              <button onClick={() => handleEdit(acc)}>Edit</button>
              <button onClick={() => handleDelete(acc.id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AccommodationList;

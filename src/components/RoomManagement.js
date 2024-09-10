import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from 'firebase/firestore'; // Import collection
import { firestore } from '../firebaseconfig'; // Ensure this path is correct

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    breakfastIncluded: false,
    breakfastAndDinnerIncluded: false,
    amenities: [
      'Free WiFi 🌐',
      'Air Conditioning ❄️',
      'Flat-screen TV 📺',
      'Minibar 🥤',
      'Safe 🔒',
      'Coffee Maker ☕',
      'Parking 🚗',
      'Microwave 🍽️',
      'Tea/Coffee ☕',
      'Outdoor Pool 🏊‍♂️',
      'Beach 🏖️',
      'Restaurant 🍽️',
      'Bar 🍹',
    ],
    checkInTime: '',
    checkOutTime: '',
    availability: '',
    images: [], // Array to hold image URLs
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'rooms')); // Use collection here
      const roomsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(roomsData || []);
    } catch (error) {
      console.error("Error fetching rooms: ", error);
      setRooms([]);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prevData => ({
      ...prevData,
      images: imageUrls
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const roomRef = collection(firestore, 'rooms'); // Use collection here
      await addDoc(roomRef, formData);
      fetchRooms(); // Refresh room list
    } catch (error) {
      console.error("Error adding room: ", error);
    }
  };

  return (
    <div>
      <h1>Room Management</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleFormChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleFormChange} required />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" name="price" value={formData.price} onChange={handleFormChange} required />
        </div>
        <div>
          <label>
            <input type="checkbox" name="breakfastIncluded" checked={formData.breakfastIncluded} onChange={handleFormChange} />
            Breakfast Included
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" name="breakfastAndDinnerIncluded" checked={formData.breakfastAndDinnerIncluded} onChange={handleFormChange} />
            Breakfast and Dinner Included
          </label>
        </div>
        <div>
          <label>Amenities:</label>
          {formData.amenities.map(amenity => (
            <div key={amenity}>
              <label>
                <input type="checkbox" name="amenities" checked={formData.amenities.includes(amenity)} onChange={handleFormChange} />
                {amenity}
              </label>
            </div>
          ))}
        </div>
        <div>
          <label>Check-In Time:</label>
          <input type="time" name="checkInTime" value={formData.checkInTime} onChange={handleFormChange} required />
        </div>
        <div>
          <label>Check-Out Time:</label>
          <input type="time" name="checkOutTime" value={formData.checkOutTime} onChange={handleFormChange} required />
        </div>
        <div>
          <label>Availability:</label>
          <input type="text" name="availability" value={formData.availability} onChange={handleFormChange} required />
        </div>
        <div>
          <label>Upload Images:</label>
          <input type="file" multiple onChange={handleImageUpload} />
          <div>
            {formData.images.map((image, index) => (
              <img key={index} src={image} alt={`Room preview ${index + 1}`} width="100" />
            ))}
          </div>
        </div>
        <button type="submit">Add Room</button>
      </form>
      <div>
        <h2>Available Rooms</h2>
        {rooms.length > 0 ? (
          rooms.map(room => (
            <div key={room.id}>
              <h3>{room.name}</h3>
              <p>{room.description}</p>
              <p>Price: ${room.price}</p>
              <p>Check-In Time: {room.checkInTime}</p>
              <p>Check-Out Time: {room.checkOutTime}</p>
              <p>Availability: {room.availability}</p>
              <p>Amenities: {room.amenities.join(', ')}</p>
              {room.images && room.images.map((img, index) => (
                <img key={index} src={img} alt={`Room ${index + 1}`} width="100" />
              ))}
            </div>
          ))
        ) : (
          <p>No rooms available</p>
        )}
      </div>
    </div>
  );
};

export default RoomManagement;

import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'; 
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firestore, storage } from '../firebaseconfig'; 

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
    images: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editRoomId, setEditRoomId] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'rooms'));
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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files).slice(0, 3); // Limit to 3 images
    const newImageUrls = await Promise.all(
      files.map(async (file) => {
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return url;
      })
    );

    setFormData(prevData => ({
      ...prevData,
      images: newImageUrls
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const roomDoc = doc(firestore, 'rooms', editRoomId);
        await updateDoc(roomDoc, formData);
        setIsEditing(false);
        setEditRoomId(null);
      } else {
        const roomRef = collection(firestore, 'rooms');
        await addDoc(roomRef, formData);
      }
      setFormData({
        name: '',
        description: '',
        price: '',
        breakfastIncluded: false,
        breakfastAndDinnerIncluded: false,
        amenities: [],
        checkInTime: '',
        checkOutTime: '',
        availability: '',
        images: [],
      });
      fetchRooms();
    } catch (error) {
      console.error("Error adding/updating room: ", error);
    }
  };

  const handleEdit = (room) => {
    setFormData(room);
    setIsEditing(true);
    setEditRoomId(room.id);
  };

  const handleDelete = async (roomId) => {
    try {
      const roomDoc = doc(firestore, 'rooms', roomId);
      await deleteDoc(roomDoc);
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room: ", error);
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
          <label>Price (in ZAR):</label>
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
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
          <div>
            {formData.images.map((image, index) => (
              <img key={index} src={image} alt={`Room preview ${index + 1}`} width="100" />
            ))}
          </div>
        </div>
        <button type="submit">{isEditing ? 'Update Room' : 'Add Room'}</button>
      </form>
      
      <div>
        <h2>Available Rooms</h2>
        {rooms.length > 0 ? (
          rooms.map(room => (
            <div key={room.id} style={{ marginBottom: '2rem' }}>
              <h3>{room.name}</h3>
              <p>{room.description}</p>
              <p>Price: R{room.price}</p>
              <p>Check-In Time: {room.checkInTime}</p>
              <p>Check-Out Time: {room.checkOutTime}</p>
              <p>Availability: {room.availability}</p>
              <p>Amenities: {room.amenities.join(', ')}</p>
              <div>
                {room.images && room.images.map((img, index) => (
                  <img key={index} src={img} alt={`Room ${index + 1}`} width="100" style={{ marginRight: '1rem' }} />
                ))}
              </div>
              <button onClick={() => handleEdit(room)}>Edit</button>
              <button onClick={() => handleDelete(room.id)}>Delete</button>
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







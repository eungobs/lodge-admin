import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Ensure this path is correct
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddAccommodation = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [bedTypes, setBedTypes] = useState('');
  const [childrenPolicy, setChildrenPolicy] = useState('');
  const [extraBedPolicy, setExtraBedPolicy] = useState('');
  const [customPolicies, setCustomPolicies] = useState('');
  const [utilities, setUtilities] = useState({
    wifi: false,
    gardenView: false,
    airConditioning: false,
    mountainView: false,
    beachView: false,
    attachedBathroom: false,
    flatScreenTV: false,
    coffeeMachine: false,
    parking: false,
    deviceChargingPorts: false,
    microwave: false,
    iron: false,
    hairDryer: false,
  });
  const [breakfastIncluded, setBreakfastIncluded] = useState(false);
  const [images, setImages] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const storage = getStorage();

  // Check if we are in edit mode and set the accommodation details
  useEffect(() => {
    const state = location.state;
    if (state) {
      setEditMode(true);
      setName(state.name);
      setDescription(state.description);
      setPrice(state.price);
      setBedTypes(state.bedTypes);
      setChildrenPolicy(state.childrenPolicy);
      setExtraBedPolicy(state.extraBedPolicy);
      setCustomPolicies(state.customPolicies);
      setUtilities(state.utilities);
      setBreakfastIncluded(state.breakfastIncluded);
      setImages(state.images || []); // Set existing images
    }
  }, [location.state]);

  const handleUtilityChange = (event) => {
    const { name, checked } = event.target;
    setUtilities((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 3) {
      alert("You can upload a maximum of 3 images.");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const storageRef = ref(storage, `accommodations/${image.name}`);
          await uploadBytes(storageRef, image);
          return getDownloadURL(storageRef);
        })
      );

      if (editMode) {
        // Update existing accommodation
        const id = location.state.id; // Get the ID of the accommodation to update
        const accommodationRef = doc(db, 'accommodationRoom', id);
        await updateDoc(accommodationRef, {
          name,
          description,
          price,
          bedTypes,
          childrenPolicy,
          extraBedPolicy,
          customPolicies,
          utilities,
          breakfastIncluded,
          images: imageUrls.length > 0 ? imageUrls : images, // Update images if new ones are uploaded
        });
        alert('Accommodation updated successfully!');
      } else {
        // Add new accommodation
        await addDoc(collection(db, 'accommodationRoom'), {
          name,
          description,
          price,
          bedTypes,
          childrenPolicy,
          extraBedPolicy,
          customPolicies,
          utilities,
          breakfastIncluded,
          images: imageUrls,
        });
        alert('Accommodation added successfully!');
      }
      navigate('/accommodations');
    } catch (error) {
      console.error("Error saving accommodation: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editMode ? 'Edit Accommodation' : 'Add New Accommodation'}</h2>
      <input 
        type="text" 
        placeholder="Name of the Room" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input 
        type="number" 
        placeholder="Price per night for 2 adults" 
        value={price} 
        onChange={(e) => setPrice(e.target.value)} 
        required 
      />
      <input 
        type="text" 
        placeholder="Available Bed Types" 
        value={bedTypes} 
        onChange={(e) => setBedTypes(e.target.value)} 
        required 
      />
      <input 
        type="text" 
        placeholder="Children Policy" 
        value={childrenPolicy} 
        onChange={(e) => setChildrenPolicy(e.target.value)} 
        required 
      />
      <input 
        type="text" 
        placeholder="Extra Bed Policy" 
        value={extraBedPolicy} 
        onChange={(e) => setExtraBedPolicy(e.target.value)} 
        required 
      />
      <h3>Utilities (Select all that apply):</h3>
      {Object.keys(utilities).map((utility) => (
        <label key={utility}>
          <input 
            type="checkbox" 
            name={utility} 
            checked={utilities[utility]} 
            onChange={handleUtilityChange} 
          />
          {utility.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
        </label>
      ))}
      <label>
        <input 
          type="checkbox" 
          checked={breakfastIncluded} 
          onChange={(e) => setBreakfastIncluded(e.target.checked)} 
        />
        Breakfast Included
      </label>
      <h4>Custom Policies:</h4>
      <textarea
        placeholder="Write any custom policies here..."
        value={customPolicies}
        onChange={(e) => setCustomPolicies(e.target.value)}
      />
      <div>
        <h4>Standard Policies:</h4>
        <p>
          <strong>Non-refundable</strong> and pay the property before arrival.
        </p>
      </div>
      <h4>Upload Images (Max 3):</h4>
      <div>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
        />
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
        />
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
        />
      </div>
      <button type="submit">{editMode ? 'Save Changes' : 'Add Accommodation'}</button>
    </form>
  );
};

export default AddAccommodation;


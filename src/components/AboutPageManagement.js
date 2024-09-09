import React, { useState, useEffect } from 'react';
import { firestore, storage } from '../firebaseconfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import '../styles/AboutPageManagement.css'; // Import CSS for styling

const AboutPageManagement = () => {
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(firestore, 'about', 'info');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDescription(data.description || '');
          setContactNumber(data.contactNumber || '');
          setWhatsappNumber(data.whatsappNumber || '');
          setUploadedImages(data.images || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleUploadImages = async () => {
    const imageURLs = [];
    try {
      for (const file of imageFiles) {
        const imageRef = ref(storage, `about-images/${file.name}`);
        await uploadBytes(imageRef, file);
        const url = await getDownloadURL(imageRef);
        imageURLs.push(url);
      }
      setUploadedImages((prev) => [...prev, ...imageURLs]);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const docRef = doc(firestore, 'about', 'info');
      await setDoc(docRef, {
        description,
        contactNumber,
        whatsappNumber,
        images: uploadedImages,
      });
      alert('Changes saved!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes!');
    }
  };

  return (
    <div className="container">
      <h2>About Page Management</h2>
      
      <div className="section">
        <h3>Update Description</h3>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="6"
          placeholder="Update description"
        />
      </div>
      
      <div className="section">
        <h3>Update Contact Information</h3>
        <input
          type="text"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          placeholder="Update contact number"
        />
        <input
          type="text"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          placeholder="Update WhatsApp number"
        />
      </div>
      
      <div className="section">
        <h3>Upload Images</h3>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImageFiles(Array.from(e.target.files))}
        />
        <button onClick={handleUploadImages}>Upload Images</button>
      </div>
      
      <div className="section">
        <h3>Uploaded Images</h3>
        <div className="image-gallery">
          {uploadedImages.map((url, index) => (
            <img key={index} src={url} alt={`Uploaded ${index}`} />
          ))}
        </div>
      </div>

      <button onClick={handleSaveChanges}>Save Changes</button>
    </div>
  );
};

export default AboutPageManagement;

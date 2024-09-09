import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore } from '../firebaseconfig'; // Adjusted to use firebaseconfig
import { collection, addDoc } from 'firebase/firestore';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [imageDescription, setImageDescription] = useState('');

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) return;

    const storage = getStorage();
    const storageRef = ref(storage, `images/${image.name}`);

    try {
      // Upload the image to Firebase Storage
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);
      
      // Save the image URL and description to Firestore
      await addDoc(collection(firestore, 'landingImages'), { url, description: imageDescription });

      // Reset state
      setImage(null);
      setImageDescription('');
      setImageURL(url);
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <Container>
      <h2>Upload New Image</h2>
      <Form>
        <Form.Group controlId="formFile">
          <Form.Label>Select Image</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
        <Form.Group controlId="imageDescription" className="mt-2">
          <Form.Label>Image Description</Form.Label>
          <Form.Control
            type="text"
            value={imageDescription}
            onChange={(e) => setImageDescription(e.target.value)}
            placeholder="Enter description"
          />
        </Form.Group>
        <Button variant="primary" className="mt-3" onClick={handleUpload}>
          Upload
        </Button>
        {imageURL && (
          <div className="mt-3">
            <h5>Uploaded Image:</h5>
            <img src={imageURL} alt="Uploaded preview" className="img-fluid" />
          </div>
        )}
      </Form>
    </Container>
  );
};

export default ImageUpload;

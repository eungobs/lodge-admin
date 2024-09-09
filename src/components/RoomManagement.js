import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';
import { firestore, storage } from '../firebaseconfig'; // Import both firestore and storage
import { addDoc, collection } from 'firebase/firestore'; // Firestore functions
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Storage functions
import './RoomManagement.css'; 
 

const RoomManagement = ({ accommodations = [] }) => {
  const [showAllImages, setShowAllImages] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newRoom, setNewRoom] = useState({
    name: '',
    description: '',
    price: '',
    breakfastIncluded: false,
    breakfastAndDinnerIncluded: false,
    images: [],
    amenities: [],
    checkInTime: '',
    checkOutTime: ''
  });
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleViewMore = (id) => {
    setShowAllImages(id);
    setShowModal('view');
  };

  const handleCloseModal = () => {
    setShowAllImages(null);
    setShowModal(null);
    setSelectedImage(null);
  };

  const handleBook = (id) => {
    navigate(`/book/${id}`);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewRoom(prev => ({ ...prev, images: files }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewRoom(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddRoom = async () => {
    setUploading(true);
    try {
      const roomRef = collection(firestore, 'accommodations');
      const imageUrls = [];
      for (const file of newRoom.images) {
        const storageRef = ref(storage, `gallery/landingpage/accommodationlist/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }
      await addDoc(roomRef, {
        ...newRoom,
        images: imageUrls
      });
      setNewRoom({
        name: '',
        description: '',
        price: '',
        breakfastIncluded: false,
        breakfastAndDinnerIncluded: false,
        images: [],
        amenities: [],
        checkInTime: '',
        checkOutTime: ''
      });
      alert("Room added successfully!");
    } catch (error) {
      console.error("Error adding room: ", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Our Accommodations</h2>
      <Row>
        {accommodations.length === 0 ? (
          <p className="text-center">No accommodations available.</p>
        ) : (
          accommodations.map((acc) => (
            <Col key={acc.id} md={4} className="mb-4">
              <Card className={acc.availability ? 'available-room' : 'not-available-room'}>
                <div className="carousel-container">
                  <img
                    src={acc.images[0]}
                    alt="Accommodation"
                    className="main-image"
                    onClick={() => handleImageClick(acc.images[0])}
                  />
                  <Button onClick={() => handleViewMore(acc.id)} variant="link" className="view-more-button">
                    View More
                  </Button>
                </div>
                <Card.Body>
                  <Card.Title>{acc.name}</Card.Title>
                  <Card.Text>{acc.description}</Card.Text>
                  <Card.Text>Price: ${acc.price}</Card.Text>
                  <Form.Check
                    type="checkbox"
                    label="Include Breakfast"
                    checked={acc.breakfastIncluded}
                    disabled
                  />
                  <Form.Check
                    type="checkbox"
                    label="Include Breakfast and Dinner"
                    checked={acc.breakfastAndDinnerIncluded}
                    disabled
                  />
                  <Button className="mt-3" variant="primary" onClick={() => handleBook(acc.id)}>
                    Book Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Modal for Adding a New Room */}
      <Modal show={showModal === 'add'} onHide={() => setShowModal(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formRoomName">
              <Form.Label>Room Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter room name"
                name="name"
                value={newRoom.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formRoomDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter room description"
                name="description"
                value={newRoom.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formRoomPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter room price"
                name="price"
                value={newRoom.price}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formRoomAmenities">
              <Form.Label>Amenities (comma separated)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter amenities"
                name="amenities"
                value={newRoom.amenities.join(', ')}
                onChange={(e) => handleInputChange({ ...e, target: { ...e.target, name: 'amenities', value: e.target.value.split(',').map(a => a.trim()) } })}
              />
            </Form.Group>
            <Form.Group controlId="formRoomCheckInTime">
              <Form.Label>Check-In Time</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter check-in time"
                name="checkInTime"
                value={newRoom.checkInTime}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formRoomCheckOutTime">
              <Form.Label>Check-Out Time</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter check-out time"
                name="checkOutTime"
                value={newRoom.checkOutTime}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formRoomBreakfast">
              <Form.Check
                type="checkbox"
                label="Include Breakfast"
                name="breakfastIncluded"
                checked={newRoom.breakfastIncluded}
                onChange={handleInputChange}
              />
              <Form.Check
                type="checkbox"
                label="Include Breakfast and Dinner"
                name="breakfastAndDinnerIncluded"
                checked={newRoom.breakfastAndDinnerIncluded}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formRoomImages">
              <Form.Label>Room Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleFileChange}
              />
            </Form.Group>
            <Button
              className="mt-3"
              variant="primary"
              onClick={handleAddRoom}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Add Room'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for Viewing More Images */}
      <Modal show={!!showAllImages} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>More Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {accommodations.find(acc => acc.id === showAllImages)?.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Accommodation ${index}`}
              className="img-fluid mb-2"
              onClick={() => handleImageClick(img)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </Modal.Body>
      </Modal>

      {/* Modal for Viewing Selected Image */}
      <Modal show={!!selectedImage} onHide={() => setSelectedImage(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Selected Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={selectedImage} alt="Selected Accommodation" className="img-fluid" />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

RoomManagement.propTypes = {
  accommodations: PropTypes.array.isRequired,
};

export default RoomManagement;


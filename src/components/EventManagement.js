import React, { useState, useEffect } from 'react';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import { firestore } from '../firebaseconfig'; // Correctly import firestore
import { collection, addDoc, updateDoc, doc, getDocs } from 'firebase/firestore';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState('');
  const [editingEventId, setEditingEventId] = useState(null);
  const [editingEventText, setEditingEventText] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'events'));
      const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsList);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (newEvent.trim()) {
      try {
        await addDoc(collection(firestore, 'events'), { text: newEvent });
        setNewEvent('');
        fetchEvents();  // Re-fetch events to update the list
      } catch (error) {
        console.error('Error adding event:', error);
      }
    }
  };

  const handleEditEvent = async (id) => {
    if (editingEventText.trim()) {
      try {
        await updateDoc(doc(firestore, 'events', id), { text: editingEventText });
        setEditingEventId(null);
        setEditingEventText('');
        fetchEvents();  // Re-fetch events to update the list
      } catch (error) {
        console.error('Error editing event:', error);
      }
    }
  };

  return (
    <Container>
      <h2>Event Management</h2>
      
      <Form onSubmit={handleAddEvent}>
        <Form.Group controlId="newEvent">
          <Form.Label>New Event</Form.Label>
          <Form.Control
            type="text"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            placeholder="Enter event details"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Add Event
        </Button>
      </Form>

      <ListGroup className="mt-4">
        {events.map(event => (
          <ListGroup.Item key={event.id}>
            {editingEventId === event.id ? (
              <>
                <Form.Control
                  type="text"
                  value={editingEventText}
                  onChange={(e) => setEditingEventText(e.target.value)}
                />
                <Button
                  variant="success"
                  onClick={() => handleEditEvent(event.id)}
                  className="ml-2"
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                {event.text}
                <Button
                  variant="warning"
                  onClick={() => {
                    setEditingEventId(event.id);
                    setEditingEventText(event.text);
                  }}
                  className="ml-2"
                >
                  Edit
                </Button>
              </>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default EventManagement;

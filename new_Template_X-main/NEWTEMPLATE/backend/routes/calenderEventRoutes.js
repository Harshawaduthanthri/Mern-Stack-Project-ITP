// calendarEventRoutes.js

import express from 'express';
import CalendarEvent from '../models/calendarEvent.js';

const router = express.Router();

// CREATE - POST a new event
router.post('/events', async (req, res) => {
  try {
    const { title, start, end, description } = req.body;
    const newEvent = await CalendarEvent.create({ title, start, end, description });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
});

// READ - GET all events
router.get('/events', async (req, res) => {
  try {
    const events = await CalendarEvent.find();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// UPDATE - PUT/PATCH an event
router.put('/events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, start, end, description } = req.body;
    const updatedEvent = await CalendarEvent.findByIdAndUpdate(
      eventId,
      { title, start, end, description },
      { new: true }
    );
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event' });
  }
});

// DELETE - DELETE an event
router.delete('/events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    await CalendarEvent.findByIdAndDelete(eventId);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event' });
  }
});

export default router;

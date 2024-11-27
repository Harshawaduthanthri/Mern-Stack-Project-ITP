import express from "express";
import { Card } from "../models/cardModel.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

//Route for save a new card

router.post('/', requireSignIn, async (request, response) => {
    try {
      if (!request.body.number || !request.body.name || !request.body.exdate || !request.body.cvv) {
        return response.status(400).send({ message: 'Send all required fields.' });
      }
  
      const newCard = {
        number: request.body.number,
        name: request.body.name,
        exdate: request.body.exdate,
        cvv: request.body.cvv,
        user: request.user._id, // Assign the logged-in user's ID to the card
      };
  
      const card = await Card.create(newCard);
      return response.status(201).send(card);
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });

//Route foe Get all cards from databse

router.get('/', requireSignIn, async (req, res) => {
    try {
      const userId = req.user._id; // Get the logged-in user's ID
      const cards = await Card.find({ user: userId });
      res.status(200).json(cards);
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: 'Server Error' });
    }
  });


//Route foe Get one card from databse by id

router.get('/:id', requireSignIn, async (req, res) => {
    try {
      const cardId = req.params.id;
      const userId = req.user._id; // Get the logged-in user's ID
  
      const card = await Card.findOne({ _id: cardId, user: userId });
      if (!card) {
        return res.status(404).json({ message: 'Card not found' });
      }
  
      res.status(200).json(card);
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: 'Server Error' });
    }
  });
  
  // Route for updating a card by ID
  router.put('/:id', requireSignIn, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id; // Get the logged-in user's ID
  
      if (!req.body.number || !req.body.name || !req.body.exdate || !req.body.cvv) {
        return res.status(400).send({ message: 'Send all required fields' });
      }
  
      const card = await Card.findOneAndUpdate(
        { _id: id, user: userId }, // Find the card by ID and ensure it belongs to the user
        req.body,
        { new: true } // Return the updated card after the update operation
      );
  
      if (!card) {
        return res.status(404).json({ message: 'Card not found or not authorized' });
      }
  
      res.status(200).json({ message: 'Card updated successfully', card });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: 'Server Error' });
    }
  });

//Route for delete a card

router.delete('/:id', requireSignIn, async (req, res) => {
    try {
      const cardId = req.params.id;
      const userId = req.user._id; // Get the logged-in user's ID
  
      // Check if the card belongs to the logged-in user before deleting
      const card = await Card.findOne({ _id: cardId, user: userId });
      if (!card) {
        return res.status(404).json({ message: 'Card not found' });
      }
  
      await Card.deleteOne({ _id: cardId });
      res.status(200).json({ message: 'Card deleted successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: 'Server Error' });
    }
  });

export default router
import Feedback from "../models/feedbackModel.js";

// Controller for creating new feedback
export const createFeedbackController = async (req, res) => {
  try {
    const { name, email, phone, message, serviceType, ratings } = req.body;
    
    // Check if all fields are present
    if (!name || !email || !phone || !message || !serviceType || !ratings) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const createdBy = req.user._id; // Assuming req.user contains the current user's ID
    const feedback = new Feedback({ name, email, phone, message, serviceType, ratings, createdBy });
    await feedback.save();
    res.status(201).json({ message: 'Feedback created successfully', feedback });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Controller for reading all feedback
export const readAllFeedbackController = async (req, res) => {
  try {
    const feedback = await Feedback.find({ createdBy: req.user._id }).populate('createdBy');
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error reading feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

  

// Controller for reading feedback by ID
export const readFeedbackController = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findById(id).populate('createdBy');
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error reading feedback by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Controller for updating feedback by ID
export const updateFeedbackController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFeedback = await Feedback.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.status(200).json({ message: 'Feedback updated successfully', feedback: updatedFeedback });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller for deleting feedback by ID
export const deleteFeedbackController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFeedback = await Feedback.findByIdAndDelete(id);
    if (!deletedFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const getServiceTypeCounts = async (req, res) => {
  try {
    const serviceTypeCounts = await Feedback.aggregate([
      { $group: { _id: "$serviceType", count: { $sum: 1 } } },
    ]);
    res.json(serviceTypeCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


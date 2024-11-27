import express from "express";
import { 
  createFeedbackController, 
  readAllFeedbackController, 
  readFeedbackController, 
  updateFeedbackController, 
  deleteFeedbackController, 
  getServiceTypeCounts
} from  './../controllers/FeedbackController.js';
import { requireSignIn } from "../middlewares/authMiddleware.js";
import Feedback from "../models/feedbackModel.js";

const router = express.Router();

// Create feedback route
router.post("/create-feedback",requireSignIn, createFeedbackController);

// Read all feedback route
router.get("/get-feedback", requireSignIn,readAllFeedbackController);

// Read feedback by ID route
router.get("/Onefeedback/:id", requireSignIn,readFeedbackController);

// Update feedback by ID route
router.put("/Updatefeedback/:id",requireSignIn, updateFeedbackController);

// Delete feedback by ID route
router.delete("/Deletefeedback/:id", deleteFeedbackController);

router.get("/service-type-counts", getServiceTypeCounts);

export default router;

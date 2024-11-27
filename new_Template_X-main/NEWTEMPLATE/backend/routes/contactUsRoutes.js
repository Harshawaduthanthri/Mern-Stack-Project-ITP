// routes/contactUsRoutes.js
import express from 'express';
import { createContactController, getContactsController, getContactController, deleteContactController, generateReport } from '../controllers/contactUsController.js';
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create contact us route
router.post('/contact', createContactController);

//retrieve all data

router.get("/get-contact", requireSignIn, getContactsController);

//retrieve by id
//router.get("/Onecontact/:id", requireSignIn, getContactController);

//delete by id
router.delete("/Deletecontact/:id", requireSignIn, deleteContactController);

//route for generate report
// routes/contactUsRoutes.js

router.get("/report", generateReport);



export default router;
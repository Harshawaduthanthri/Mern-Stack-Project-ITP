import express from 'express';
import { employeeRegisterController } from './../controllers/EmployeeController.js';  // Adjust the import path based on your file structure
const router = express.Router();

// Define routes
router.post('/register', employeeRegisterController);

export default router;
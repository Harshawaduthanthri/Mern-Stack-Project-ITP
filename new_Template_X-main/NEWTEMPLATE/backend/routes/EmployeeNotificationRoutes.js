import express from 'express';
import {  approveAppointmentNotification , getEmployeeNotifications, rejectAppointmentNotification, updateStatusEnumValues } from '../controllers/EmployeeController.js';  // Adjust the import path based on your file structure
import { requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router()




router.get('/notifications', getEmployeeNotifications);

router.put('/notifications/update/:notificationId', updateStatusEnumValues );

router.post('/notifications/approve/:notificationId', approveAppointmentNotification);


// Route to reject an appointment notification (DELETE method)
router.delete('/notifications/reject/:notificationId', rejectAppointmentNotification);


export default router;
import mongoose from 'mongoose';

const employeeNotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // Assuming you have a User model
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'completed','issue occured'], // Only allows 'pending' or 'completed' status
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "appointment",
    required: true, // Assuming you have an Appointment model
  },
  appointmentNotification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "appointmentNotification", // Assuming you have an AppointmentNotification model
  },
}, { timestamps: true });

export default mongoose.model('EmployeeNotification', employeeNotificationSchema);

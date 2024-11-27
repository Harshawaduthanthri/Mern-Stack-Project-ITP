// employeeController.js
import express from 'express';
import EmployeeNotification from '../models/EmployeeNotification.js';
import AppointmentNotification from '../models/appointmentNotification.js';
import Appointment from '../models/appointmentModel.js';
import Notification  from '../models/appointmentNotification.js';



export const getEmployeeNotifications = async (req, res) => {
  try {
    // Fetch all employee notifications and populate the 'user' and 'appointment' fields
    const notifications = await EmployeeNotification.find()
      .populate('user') // Populate 'user' field
      .populate('appointment'); // Populate 'appointment' field

    if (notifications.length === 0) {
      return res.status(404).json({ message: 'No notifications found' });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



export const approveAppointmentNotification = async (req, res) => {
  try {
    const { notificationId } = req.params; // Extract notificationId from params

    // Find the appointment notification by ID
    const appointmentNotification = await AppointmentNotification.findById(notificationId);

    if (!appointmentNotification) {
      return res.status(404).json({ message: 'Appointment notification not found' });
    }

    // Check if the appointment notification is already approved
    if (appointmentNotification.status === 'approved') {
      return res.status(400).json({ message: 'Appointment notification is already approved' });
    }

    // Get the appointment ID from the appointment notification
    const appointmentId = appointmentNotification.appointment;

    // Update status to 'approved' and save
    appointmentNotification.status = 'approved';
    await appointmentNotification.save();

    // Create employee notification for the approved appointment
    const employeeNotification = await EmployeeNotification.create({
      user: appointmentNotification.user,
      message: `${appointmentNotification.user.name || 'customer'} has an appointment`, // Assuming 'firstname' is the field in the User model containing the user's first name
      appointmentNotification: appointmentNotification._id,
      appointment: appointmentId, // Associate appointment ID with employee notification
    });
    
    res.status(200).json({ message: 'Appointment notification approved successfully', employeeNotification });
  } catch (error) {
    console.error('Error approving appointment notification:', error);
    res.status(500).json({ message: 'Error approving appointment notification', error: error.message });
  }
};

// Controller to reject an appointment notification (using DELETE method)
// Controller to reject an appointment notification (using DELETE method)
export const rejectAppointmentNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    // Delete the appointment notification by ID
    const deletedNotification = await AppointmentNotification.deleteOne({ _id: notificationId });

    if (deletedNotification.deletedCount === 0) {
      return res.status(404).json({ message: 'Appointment notification not found' });
    }

    // Update related employee notifications and send custom message
    await EmployeeNotification.updateMany(
      { appointmentNotification: notificationId },
      { $set: { message: 'Unfortunately, the user canceled the appointment' } }
    );

    res.status(200).json({ message: 'Appointment notification rejected successfully' });
  } catch (error) {
    console.error('Error rejecting appointment notification:', error);
    res.status(500).json({ message: 'Error rejecting appointment notification', error: error.message });
  }
};
export const updateStatusEnumValues = async (req, res) => {
  const { notificationId } = req.params;
  const { status } = req.body;

  try {
    // Check if the provided status is one of the allowed values
    const allowedStatusValues = ['pending', 'completed', 'issue occured'];
    if (!allowedStatusValues.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find the notification by ID and update its status
    const updatedNotification = await EmployeeNotification.findByIdAndUpdate(
      notificationId,
      { status },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification status updated successfully', updatedNotification });
  } catch (error) {
    console.error('Error updating notification status:', error);
    res.status(500).json({ message: 'Error updating notification status', error: error.message });
  }
};
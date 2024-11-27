import EmployeeNotification from "../models/EmployeeNotification.js";
import appointmentModel from "../models/appointmentModel.js";
import appointmentNotification from "../models/appointmentNotification.js";
import AppointmentNotification from "../models/appointmentNotification.js"; // Correct import
import notificationModel from '../models/appointmentNotification.js'
import { sendNotificationToAdmin } from './notificationService.js';
import moment from "moment";
import sendEmail from "./../utils/sendEmail.js";
import slugify from "slugify";
import userModel from "../models/userModel.js";


export const createAppointmentController = async (req, res) => {
  try {
    const { firstname, lastname, description, type, specialization, address, date, phoneNumber } = req.body;

    if (!firstname || !lastname || !type || !specialization || !address || !date || !phoneNumber) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingAppointment = await appointmentModel.findOne({ firstname, lastname, date });

    if (existingAppointment) {
      return res.status(200).json({
        success: true,
        message: "Appointment already exists",
        appointment: existingAppointment, // Include existing appointment details in the response
      });
    }

    const newAppointment = await appointmentModel.create({
      user: req.user._id, // Assuming you have user information in req.user
      firstname,
      lastname,
      description,
      type,
      specialization,
      address,
      date,
      phoneNumber,
    });

    // Create an appointment notification message
    const appointmentNotificationMessage = `Appointment ID ${newAppointment._id} created on ${newAppointment.date}`;

    // Create the appointment notification and associate appointment ID
    const newAppointmentNotification = await AppointmentNotification.create({
      user: req.user._id,
      message: appointmentNotificationMessage,
      status: 'pending',
      appointment: newAppointment._id, // Associate appointment ID with the notification
    });
    
    // Send notification to admin about the new appointment
    await sendNotificationToAdmin(`New appointment booked:\n${newAppointment}`);

    // Send the response with all created data including the appointment ID
    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      appointment: newAppointment,
      appointmentNotification: newAppointmentNotification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error while creating appointment',
      error: error.message,
    });
  }
};




export const updateAppointmentController = async (req, res) => {
  try {
    const { firstname, lastname, description, type, specialization, address, date, phoneNumber } = req.body;
    const { id } = req.params;

    const appointment = await appointmentModel.findByIdAndUpdate(
      id,
      {
        firstname,
        lastname,
        description,
        type,
        specialization,
        address,
        date,
        phoneNumber,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error updating appointment",
    });
  }
};

export const getAppointmentController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.status(200).send({
      success: true,
      message: "All Appointments List",
      appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all appointments",
    });
  }
};

export const getCurrentAppointmentController = async (req, res) => {
  try {
    // Find appointments for the current user
    const appointments = await appointmentModel
      .find({ user: req.user._id })
      .populate("user", "name") // You can populate additional fields if needed
      .exec();

    res.json({ appointments });
  } catch (error) {
    console.error(error);not
    res.status(500).json({
      success: false,
      message: "Error while getting appointments",
      error: error.message,
    });
  }
};


export const getSingleAppointmentController = async (req, res) => {
  try {
    const appointment = await appointmentModel.findById(req.params.id);
    res.status(200).send({
      success: true,
      message: "Get Single Appointment Successfully",
      appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting single appointment",
    });
  }
};

export const deleteAppointmentController = async (req, res) => {
  try {
    const { id } = req.params;
    await appointmentModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error deleting appointment",
    });
  }
};

export const getAppointmentsNotificationController = async (req, res) => {
  try {
    // Find appointments
    const appointments = await appointmentModel
      .find({ user: req.user._id });

    // Find notifications and populate user
    const notifications = await appointmentNotification
      .find({ user: req.user._id })
      .populate("user", "name")
      .exec();

    res.json({ appointments, notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while getting appointments and notifications",
      error: error.message,
    });
  }
};

export const getAllNotificationAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({})
      .populate({
        path: 'user',
        select: 'firstname lastname email',
      })
      .sort({ createdAt: -1 });

    const notifications = await AppointmentNotification
      .find({})
      .populate("user", "name")
      .populate({
        path: 'appointment',
        select: 'firstname lastname description type specialization address date phoneNumber',
      })
      .exec();

    // Map through appointments to extract notification details
    const appointmentsWithNotifications = appointments.map(appointment => {
      const notification = notifications.find(n => n.appointment && n.appointment._id.equals(appointment._id));
      return {
        ...appointment.toObject(),
        notifications: notification ? [notification] : [],
      };
    });

    res.json({
      success: true,
      message: 'All appointments retrieved successfully',
      appointments: appointmentsWithNotifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error while fetching appointments',
      error: error.message,
    });
  }
};


export const notificationStatusController = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const updatedNotification = await appointmentNotification.findByIdAndUpdate(
      appointmentId,  // Use appointmentId here
      { status },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json(updatedNotification);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while updating notification status",
      error: error.message,
    });
  }
};

export const deleteNotificationAppointmentController = async (req, res) => {
  try {
    const { id } = req.params;
    await notificationModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error deleting appointment",
    });
  }
};


  export const deleteAllUserNotificationsController = async (req, res) => {
    try {
      // Assuming the user name is available in the request after authentication
      const userName = req.user.name;
      
      // Delete notifications for the authenticated user based on user name
      await notificationModel.deleteMany({ name: userName });
  
      res.status(200).send({
        success: true,
        message: 'Current user notifications deleted successfully',
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        error,
        message: 'Error deleting current user notifications',
      });
    }
  };

  export const countNotificationStatusController = async (req, res) => {
    try {
      const { user } = req;
  
      const notifications = user?.notifications || [];
  
      const count = {
        approved: notifications.filter((notification) => notification.status === "approved").length,
        rejected: notifications.filter((notification) => notification.status === "rejected").length,
        pending: notifications.filter((notification) => notification.status === "pending").length,
        pending: notifications.filter((notification) => notification.status === "done").length,
      };
  
      return res.status(200).json(count);
    } catch (error) {
      console.error("Error counting notification statuses:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };


  export const getAppointmentTypeCount = async (req, res) => {
    try {
        // Use MongoDB's aggregate function to group by the 'type' field and count the number of appointments
        const appointmentTypeCounts = await appointmentModel.aggregate([
            {
                $group: {
                    _id: '$specialization', // Group by appointment type
                    count: { $sum: 1 } // Count the number of appointments for each type
                }
            }
        ]);

        // Return the result as JSON
        res.json(appointmentTypeCounts);
    } catch (error) {
        // Handle any errors
        console.error('Error in getAppointmentTypeCount:', error.message);
        res.status(500).json({ error: 'Internal Server Error: ' + error.message });
    }
};

export const countAppointments = async (req, res) => {
  try {
      // Count all appointments
      const count = await appointmentModel.countDocuments({});
      // Return the count as a JSON response
      res.json({ count });
  } catch (error) {
      // Handle errors and respond with a suitable status and error message
      res.status(500).json({ error: 'An error occurred while counting appointments.' });
  }
};



export const getNotificationCountsByStatus = async (req, res) => {
  try {
    // Perform aggregation to group by status and count each group
    const notificationCounts = await notificationModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Transform the result to a dictionary with status as key and count as value
    const counts = notificationCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    // Send the counts as a JSON response
    res.status(200).json(counts);
  } catch (error) {
    console.error("Error fetching notification counts by status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendAppointmentNotification = async (req, res) => {
  const { email, status, appointment } = req.body; // Get email, status, and appointment details from the request body

  try {
    // Find the user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    // Construct email subject
    const subject = `Appointment ${status}`;

    // Construct email message with appointment details
    const message = `
      <h2>Hello ${user.name},</h2>
      <p>Your appointment has been ${
        status === "approved" ? "approved" : "rejected"
      }:</p>
      <ul>
        <li>Type: ${appointment.type}</li>
        <li>Specialization: ${appointment.specialization}</li>
        <li>Address: ${appointment.address}</li>
        <li>Date: ${moment(appointment.date).format("MMMM DD, YYYY")}</li>
        <li>Status: ${status}</li>
      </ul>
      <p>Thank you for using our services.</p>
      <p>For assistance or support, feel free to contact our team anytime.</p>
      <p>Regards,</p>
      <p>Greenline Team</p>
    `;

    // Send email
    await sendEmail(subject, message, email, process.env.EMAIL_USER);

    res.status(200).json({
      success: true,
      message: "Appointment notification sent successfully",
    });
  } catch (error) {
    console.error("Error sending appointment notification:", error);
    res.status(500).json({
      success: false,
      error: "Error sending appointment notification",
    });
  }
};
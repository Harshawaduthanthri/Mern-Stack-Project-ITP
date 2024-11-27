import { Router } from "express";
import {checkAttendance, saveAttendance} from "../controllers/attendanceController.js";
import Attendance from '../models/attendanceModel.js';
const router = Router();

// Save attendance
router.post("/saveAttendance", async (req, res) => {
    const { date, employees } = req.body;
  
    // Validate the 'employees' property
    if (!Array.isArray(employees)) {
      return res.status(400).json({ message: "Invalid 'employees' data" });
    }
  
    try {
      // Check if attendance already exists for the given employee and date
      const existingAttendance = await Attendance.findOne({
        employee: employees[0], // Assuming employees[0] contains the employee ID
        AttendenceDate: date,
      });
  
      if (existingAttendance) {
        return res.status(400).json({
          message: "Attendance already submitted for this employee and date",
        });
      }
  
      // Create attendance record
      await Attendance.create({ employee: employees[0], AttendenceDate: date });
  
      res.status(201).json({ message: "Attendance saved successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});


// Check attendance
router.get("/employeeAttendance", async (req, res) => {
    try {
        const allEmployeeAttendance = await Attendance.find().populate('employee');
        res.status(200).json(allEmployeeAttendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

  

// Route to get all attendance records separated by attendance date
router.get("/attendanceByDate", async (req, res) => {
    try {
      // Group attendance records by attendance date
      const attendanceByDate = await Attendance.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$AttendenceDate" },
            }, // Group by attendance date in "YYYY-MM-DD" format
            attendance: { $push: "$$ROOT" }, // Push all attendance records for each attendance date
          },
        },
      ]);
  
      res.status(200).json(attendanceByDate);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Route to get count of attendance in each attendance date
  router.get("/attendanceCountByDate", async (req, res) => {
    try {
      // Group attendance records by attendance date and count the attendance
      const attendanceCountByDate = await Attendance.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$AttendenceDate" },
            }, // Group by attendance date in "YYYY-MM-DD" format
            count: { $sum: 1 }, // Count the number of attendance records for each attendance date
          },
        },
      ]);
  
      res.status(200).json(attendanceCountByDate);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // DELETE request handler for deleting attendance records by date
  router.delete("/deleteByDate/:date", async (req, res) => {
    const { date } = req.params;
  
    try {
      // Your logic to delete attendance records for the specified date
  
      const deletedAttendance = await Attendance.deleteMany({
        AttendenceDate: new Date(date),
      });
  
      if (deletedAttendance.deletedCount > 0) {
        // Sending a success response if records are deleted
        res.status(200).json({
          message: `Attendance records for date ${date} deleted successfully`,
        });
      } else {
        // Sending a response if no records are found for deletion
        res.status(404).json({
          message: `No attendance records found for date ${date}`,
        });
      }
    } catch (error) {
      // Sending an error response if something goes wrong
      res.status(500).json({
        error: "Failed to delete attendance records",
        details: error.message,
      });
    }
  });
  
  router.get("/attendanceByDate/:date", async (req, res) => {
    try {
      const { date } = req.params;
  
      // Find attendance records for the specified date
      const attendance = await Attendance.find({ AttendenceDate: new Date(date) })
        .populate('employee', 'name email profession') // Populate employee details
        .exec();
  
      if (attendance.length === 0) {
        return res.status(404).json({ message: "No attendance records found for this date" });
      }
  
      res.status(200).json(attendance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

export default router;
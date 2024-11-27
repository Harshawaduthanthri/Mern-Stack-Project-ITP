import { Router } from "express";

import Attendance from '../models/attendanceModel.js';

// Controller function to save attendance
export const saveAttendance = async (req, res) => {
    const { date, employee } = req.body;
  
    try {
      // Check if attendance already exists for the given employee and date
      const existingAttendance = await Attendance.findOne({
        employee,
        AttendenceDate: date,
      });
  
      if (existingAttendance) {
        return res.status(400).json({
          message: "Attendance already submitted for this employee and date",
        });
      }
  
      // Create attendance record
      await Attendance.create({ employee, AttendenceDate: date });
  
      res.status(201).json({ message: "Attendance saved successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Controller function to check attendance
export const checkAttendance = async (req, res) => {
  const { date, employeeIds } = req.query;

  try {
    // Check if attendance already exists for the given employees and date
    const existingAttendance = await Attendance.find({
      AttendenceDate: date,
      employee: { $in: employeeIds },
    });

    res.status(200).json(existingAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


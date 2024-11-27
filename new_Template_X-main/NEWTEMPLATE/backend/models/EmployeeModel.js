// employeeModel.js

import mongoose from 'mongoose';


const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  // Add a reference to the Profession model
  profession: {
    type: String,
    enum: ['hardware', 'software'], // Valid values for profession
    required: true,
  },
  role: {
    type: Number,
    default: 3, // Assuming employee role is 1, adjust as needed
  },
  isActive: {
    type: Boolean,
    default: true, // User is active by default
  },
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;

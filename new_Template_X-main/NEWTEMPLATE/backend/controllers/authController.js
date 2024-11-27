import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import Order from "../models/orderModel.js"; // Add this line
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import Employee from '../models/EmployeeModel.js';
import JWT from "jsonwebtoken";
import Token from "../models/tokenModel.js";
import crypto from "crypto";
import sendEmail from "./../utils/sendEmail.js";

import mongoose, { Model } from "mongoose";
// ... rest of your code

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer,role } = req.body;
    //validations
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "email is required" });
    }
    if (!password) {
      return res.send({ message: "password is required" });
    }
    if (!phone) {
      return res.send({ message: "[phone] is required" });
    }
    if (!address) {
      return res.send({ message: "address is required" });
    }
    //check user
    const existingUser = await userModel.findOne({ email });
    //existinf user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }

    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      role,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Success",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in registeration",
      error,
    });
  }
};
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email / password",
      });
    }

    // Check if the email is registered for a user
    const user = await userModel.findOne({ email });

    // If not found as a user, check as an employee
    if (!user) {
      const employee = await Employee.findOne({ email });

      if (!employee) {
        return res.status(404).send({
          success: false,
          message: "Email is not registered",
        });
      }

      // Check the password for the employee
      const match = await comparePassword(password, employee.password);

      if (!match) {
        return res.status(400).send({
          success: false,
          message: "Invalid Password",
        });
      }

      // Generate token for the employee
      const token = await JWT.sign(
        { _id: employee._id, role: employee.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(200).send({
        success: true,
        message: "Login successful",
        user: {
          _id: employee._id,
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          address: employee.address,
          role: employee.role,
        },
        token,
      });
    } else {
      // Check the password for the user
      const match = await comparePassword(password, user.password);

      if (!match) {
        return res.status(400).send({
          success: false,
          message: "Invalid Password",
        });
      }

      // Generate token for the user
      const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).send({
        success: true,
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
        token,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};


//testController
export const testController = (req, res) => {
  try {
    res.send("protected Route");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

//update profile controller
export const updateUser = async (req, res) => {
  try {
    // Find the user by ID
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Update user's profile fields
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.photo = req.body.photo || user.photo;

    // Save the updated user profile
    const updatedUser = await user.save();

    // Respond with updated user details
    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updatedUser: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        photo: updatedUser.photo,
      },
    });
  } catch (error) {
    // Handle any errors
    console.error("Error while updating profile:", error);
    res.status(400).send({
      success: false,
      message: "Error while updating profile",
      error: error.message,
    });
  }
};

//changePassword
export const changePasswordController = async (req, res) => {
  //res.send("Password Change");
  const user = await userModel.findById(req.user._id);
  const { oldPassword, password } = req.body;

  const hashedPassword = password ? await hashPassword(password) : undefined;
  if (!user) {
    res.status(400).send({
      success: false,
      message: "User not found, please signup",
    });
  }
  // Validate
  if (!oldPassword || !password) {
    res.status(400).send({
      success: false,
      message: "Please add old and new password",
    });
  }

  // check if old password matches pasword in DB
  const passwordIsCorrect = await comparePassword(oldPassword, user.password);

  //Save new password
  if (user && passwordIsCorrect) {
    user.password = hashedPassword || password;
    await user.save();
    res.status(200).send("Password change successful");
  } else {
    res.status(400).send({
      success: false,
      message: "Old password is incorrect",
    });
  }
};

//Delete
export const deleteProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    await userModel.findByIdAndDelete(req.user._id);

    res.status(200).send({
      success: true,
      message: "Profile Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Deleting Profile",
      error,
    });
  }
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }

  // Delete Token if it exists in DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  // Create Reset Token
  //console.log(resetToken);
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);

  // Hash Token before saving to DB          //algorithm specify to use -sha256
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log(hashedToken);

  // Save Token to DB
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), //30 minutes
  }).save();

  //Construct Reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Reset Email
  const message = `
    <h2>Hello ${user.name}  <h2>
    <p>Please use the url below to reset your password </p>
    <p>This reset link is valid for only 30 minutes</p>

    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

    <p>Regards...</p>
    <p>Greenline Team</p>
  `;

  const subject = "Password Reset Request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({ success: true, message: "Reset Email Sent" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Email not sent, please try again" });
  }

};

export const resetPassword = async (req, res) => {
  const { password: newPassword } = req.body; // Assuming the password is sent as "password" in the request body
  const { resetToken } = req.params;

  // Validate newPassword
  if (!newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "New Password is required" });
  }

  try {
    // Hash the resetToken
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Find the token in the database
    const userToken = await Token.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() },
    });

    // If token not found, return error
    if (!userToken) {
      return res
        .status(404)
        .json({ success: false, error: "Invalid or Expired Token" });
    }

    // Find the user by token
    const user = await userModel.findById(userToken.userId);

    // If user not found, return error
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Send success response
    res.status(200).json({
      success: true,
      message: "Password Reset Successful, Please Login",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Controller function to get user registration data grouped by month
export const getUserRegistrationData = async (req, res) => {
  try {
    const userRegistrationData = await userModel.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' }, // Grouping by month
          count: { $sum: 1 }, // Counting the number of users in each month
        },
      },
      {
        $sort: { '_id': 1 } // Sort by month
      }
    ]);

    res.json(userRegistrationData);
  } catch (error) {
    console.error('Error fetching user registration data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const generatePieChart = async (req, res) => {
  try {
    // Get the count of isActive true and false for users with role 0
    const activeCount = await userModel.countDocuments({ role: 0, isActive: true });
    const inactiveCount = await userModel.countDocuments({ role: 0, isActive: false });

    // Generate pie chart data
    const pieData = {
      labels: ['Active', 'Inactive'],
      datasets: [{
        data: [activeCount, inactiveCount],
        backgroundColor: ['#36a2eb', '#ff6384'],
      }],
    };

    res.json({ data: pieData });
  } catch (error) {
    console.error('Error generating pie chart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting order",
      error,
    });
  }
};

//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 }); // Correct syntax for sorting by createdAt in descending order
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error,
    });
  }
};
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Use await and fix the parameter name to orderId
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.json(updatedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updating Order",
      error,
    });
  }
};

export const orderDeleteController = async (req, res) => {
  try {
    // Extract orderId from request parameters
    const { orderId } = req.params;

    // Assuming you have a model named Order, you can use its delete method
    // Make sure to replace Order with your actual model
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
      deletedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while deleting order",
      error: error.message,
    });
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await userModel.find({ role: 0 }); // Fetch users where role is 0
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getallUsers = async (req, res, next) => {
  try {
    // Use the find() method with a filter to get users with role numbers 1 and 2
    const users = await userModel.find({ role: { $in: [1, 2] } });
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserCount = async (req, res, next) => {
  try {
    const userCount = await userModel.countDocuments();
    res.status(200).json({ success: true, userCount });
  } catch (error) {
    console.error("Error counting users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserDetailsController = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate if id is provided and follows a valid pattern for MongoDB ObjectId
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    if (!userId || !objectIdPattern.test(userId)) {
      return res.status(400).json({ error: "Invalid user ID provided" });
    }

    const user = await userModel.findById(userId);

    // Check if the user with the provided ID exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User details retrieved successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while retrieving user details",
      error,
    });
  }
};

export const updateUserRoleController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate if userId is provided and is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID provided" });
    }

    // Validate the role
    if (![0, 1, 2].includes(role)) {
      return res
        .status(400)
        .json({ error: "Invalid role value. Must be 0, 1, or 2." });
    }

    // Update user role
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while updating user role",
      error,
    });
  }
};


export const deleteUserRoleController = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate if userId is provided and is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID provided" });
    }

    // Delete user by IDF
    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while deleting user",
      error: error.message,  // Include the error message in the response
    });
  }
};


export const getEmployeeManagerCount = async (req, res, next) => {
  try {
    const employeeManagerCount = await userModel.countDocuments({ role: 2 });
    res.status(200).json({ success: true, employeeManagerCount });
  } catch (error) {
    console.error("Error counting employee managers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const employeeRegisterController = async (req, res) => {
  try {
    const { name, email, password, phone, address, profession } = req.body;

    // Validations
    if (!name || !email || !password || !phone || !address || !profession) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    // Check if the phone number is not 7 or 10 characters
    if (phone.length !== 7 && phone.length !== 10) {
      return res.status(400).send({ message: 'Phone number must be either 7 or 10 characters long' });
    }

    // Check if the email is already registered
    const existingEmployee = await Employee.findOne({ email });

    if (existingEmployee) {
      return res.status(400).send({
        success: false,
        message: 'Email is already registered. Please use a different email.',
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new employee with the specified profession
    const newEmployee = await new Employee({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      profession,
    }).save();

    res.status(201).send({
      success: true,
      message: 'Employee registration successful',
      employee: {
        _id: newEmployee._id,
        name: newEmployee.name,
        email: newEmployee.email,
        phone: newEmployee.phone,
        address: newEmployee.address,
        profession: newEmployee.profession,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error in employee registration',
      error,
    });
  }
};


export const getEmpDetailsController = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Validate if id is provided and follows a valid pattern for MongoDB ObjectId
    if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ error: "Invalid employee ID provided" });
    }

    const employee = await Employee.findById(employeeId);

    // Check if the employee with the provided ID exists
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json({
      success: true,
      message: "Employee details retrieved successfully",
      employee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while retrieving employee details",
      error,
    });
  }
};


export const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find();
    res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error("Error getting employees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateEmployeeController = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { name, email, phone, address, profession } = req.body;

    // Validate if employeeId is provided and is a valid ObjectId
    if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ error: "Invalid employee ID provided" });
    }

    // Find the employee by ID
    const existingEmployee = await Employee.findById(employeeId);

    // Check if the employee with the provided ID exists
    if (!existingEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Update employee information
    existingEmployee.name = name || existingEmployee.name;
    existingEmployee.email = email || existingEmployee.email;
    existingEmployee.phone = phone || existingEmployee.phone;
    existingEmployee.address = address || existingEmployee.address;
    existingEmployee.profession = profession || existingEmployee.profession;

    // Save the updated employee
    const updatedEmployee = await existingEmployee.save();

    res.status(200).json({
      success: true,
      message: "Employee information updated successfully",
      updatedEmployee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while updating employee information",
      error,
    });
  }
};

export const deleteEmployeeController = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Validate if employeeId is provided and is a valid ObjectId
    if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ error: "Invalid employee ID provided" });
    }

    // Delete employee by ID
    const deletedEmployee = await Employee.findByIdAndDelete(employeeId);

    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      deletedEmployee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while deleting employee",
      error: error.message,
    });
  }
};


export const deactivateUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate if userId is provided and is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID provided" });
    }

    // Find the user by ID and update isActive to false (deactivate)
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deactivated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while deactivating user",
      error,
    });
  }
};



export const checkUserIsActive = async (req, res, next) => {
  try {
    const { email } = req.body; // Assuming the login request contains the email
  
    // Find the regular user by email
    const regularUser = await userModel.findOne({ email });

    // Find the employee by email
    const employee = await Employee.findOne({ email });

    if (!regularUser && !employee) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = regularUser || employee; // Assign whichever is found (regular user or employee)

    if (!user.isActive) {
      return res.status(403).json({ error: "User account is inactive" });
    }

    // User is active, continue with login
    req.user = user; // Attach the user object to the request for later use
    next();
  } catch (error) {
    console.error("Error in checkUserIsActive middleware:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const activateUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate if userId is provided and is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID provided" });
    }

    // Find the user by ID and update isActive to true (activate)
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User activated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while activating user",
      error,
    });
  }
};
export const getEmployeeCount = async (req, res, next) => {
  try {
    const employeeCount = await Employee.countDocuments();
    res.status(200).json({ success: true, employeeCount });
  } catch (error) {
    console.error("Error counting employees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCount = async (req, res, next) => {
  try {
    const employeeCount = await Employee.countDocuments();
    res.status(200).json({ success: true, employeeCount });
  } catch (error) {
    console.error("Error counting employees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRoleBasedUsers = async (req, res, next) => {
  try {
   
    const usersRole1 = await userModel.find({ role: 1 }); // Fetch users where role is 1
    const usersRole2 = await userModel.find({ role: 2 }); // Fetch users where role is 2

    res.status(200).json({
      success: true,

      usersRole1,
      usersRole2,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getNotProcessedOrdersCountController = async (req, res) => {
  try {
    const notProcessedCount = await orderModel.countDocuments({ status: "Not Process" });
    res.json({ count: notProcessedCount });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting not processed orders count",
      error,
    });
  }
};

export const getHardwareEmployeeCount = async (req, res, next) => {
  try {
    const hardwareEmployeeCount = await Employee.countDocuments({ profession: 'hardware' });
    res.status(200).json({ success: true, hardwareEmployeeCount });
  } catch (error) {
    console.error("Error counting employees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSoftwareEmployeeCount = async (req, res, next) => {
  try {
    const softwareEmployeeCount = await Employee.countDocuments({ profession: 'software' });
    res.status(200).json({ success: true, softwareEmployeeCount });
  } catch (error) {
    console.error("Error counting employees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getEmployeeCounts = async (req, res, next) => {
  try {
    const hardwareEmployeeCount = await Employee.countDocuments({ profession: 'hardware' });
    const softwareEmployeeCount = await Employee.countDocuments({ profession: 'software' });

    res.status(200).json({
      success: true,
      hardwareEmployeeCount,
      softwareEmployeeCount
    });
  } catch (error) {
    console.error("Error counting employees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserEmailController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id); // Assuming you have the user ID attached to the request object after authentication
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, userEmail: user.email });
  } catch (error) {
    console.error("Error fetching user email:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const generateUserRegistrationPDF = async (req, res) => {
  try {
    const users = await userModel.find();

    // PDF generation logic
    const doc = new PDFDocument();
    doc.pipe(res);

    // Add content to the PDF document
    doc.fontSize(16).text("User Registration Analysis Report", { align: "center" });
    // Add more content as needed

    // End the document
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
};
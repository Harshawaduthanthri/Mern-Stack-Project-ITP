import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
import Employee from "../models/EmployeeModel.js";

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    // Check if the authorization header exists
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({ success: false, message: "No token provided" });
    }

    // Verify the JWT token
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ success: false, message: "Token has expired" });
    }
    console.error("Error in requireSignIn middleware:", error);
    res.status(401).send({ success: false, message: "Unauthorized access" });
  }
};


//admin acceess
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(401).send({ 
        success: false,
        message: "User not found",
      });
    }
    if (user.role !== 1) {
      return res.status(401).send({ 
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};


//employee acceess
export const isEmployee = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 2) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};

export const isEmployeeUser = async (req, res, next) => {
  try {
    // Check if the authenticated user is an employee
    console.log('req.user:', req.user); // Check if req.user is properly set
    console.log('req.headers.authorization:', req.headers.authorization); // Check the token being sent
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).send({
        success: false,
        message: 'Unauthorized Access: Token not provided',
      });
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    console.log('decoded:', decoded); // Check the decoded token
    const employee = await Employee.findById(decoded._id);
    console.log('employee:', employee); // Check if employee is found

    if (!employee || employee.role !== 3) {
      return res.status(401).send({
        success: false,
        message: 'Unauthorized Access: User is not an employee with role 3',
      });
    }

    req.employee = employee; // Set req.employee with the found employee
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error in isEmployeeUser middleware',
      error: error.message,
    });
  }
};



export const isUserManager = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 4) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in manager middleware",
    });
  }
};
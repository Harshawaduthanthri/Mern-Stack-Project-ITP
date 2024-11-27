import express from "express";
import {
  registerController,
  loginController,
  testController,
  deleteProfileController,
  forgotPassword,
  resetPassword,
  updateUser,
  changePasswordController,

  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  orderDeleteController,
  getUsers,
  getUserDetailsController,
  updateUserRoleController,
  
  deleteUserRoleController,
  getUserCount,
  getEmployeeManagerCount,
  employeeRegisterController,
  getEmpDetailsController,
  getEmployees,
  updateEmployeeController,
  deleteEmployeeController,
  deactivateUserController,
  checkUserIsActive,
  activateUserController,
  getEmployeeCount,
  getRoleBasedUsers,
  getNotProcessedOrdersCountController,
  getHardwareEmployeeCount,
  getSoftwareEmployeeCount,
  getEmployeeCounts,
  getCount,
  getallUsers,
  getUserRegistrationData,
  generatePieChart,
  getUserEmailController,
  generateUserRegistrationPDF,
} from "../controllers/authController.js";
import {
  isAdmin,
  isEmployee,
  isEmployeeUser,

  isUserManager,

  requireSignIn,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);

// LOGIN || post
router.post("/login",checkUserIsActive,loginController);

// test routes
router.get("/test", requireSignIn, isAdmin, testController);

// protected routes
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// protected admin routes
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get("/usermanager-auth", requireSignIn, isUserManager, (req, res) => {
  res.status(200).send({ ok: true });
});

// Update User
router.patch("/updateuser", requireSignIn, updateUser);

// chnge password
router.patch("/changepassword", requireSignIn, changePasswordController);

//delete profile
router.delete("/delete-profile/:id", requireSignIn, deleteProfileController);

router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);

router.get('/user-registration-data', getUserRegistrationData);
router.get('/generatePieChart', generatePieChart);

router.get("/usermanager/users", getUsers);
router.get("/usermanager/roles", getallUsers);

router.get("/employee-auth", requireSignIn, isEmployee, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get("/employeeuser-auth", requireSignIn, isEmployeeUser, (req, res) => {
  res.status(200).send({ ok: true });
});

// orders
router.get("/orders", requireSignIn, getOrdersController);

// all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

// Order deletion
router.delete(
  "/order-delete/:orderId",
  requireSignIn,
  isAdmin,
  orderDeleteController
);

router.get("/admin/users", requireSignIn, isAdmin, getUsers);

router.get(
  "/admin/users/:userId",
  requireSignIn,
  isAdmin,
  getUserDetailsController
);

router.get(
  "/admin/count",
  requireSignIn,
  isAdmin,
  getUserCount,
);
router.get(
  "/admin/users/employeeManager/count",
  requireSignIn,
  isAdmin,
  getEmployeeManagerCount
);


router.put(
  "/admin/users/role/:userId",
  requireSignIn,
  isAdmin,
  updateUserRoleController
);

router.delete(
  "/admin/users/delete/:userId",
  requireSignIn,

  deleteUserRoleController
);

router.get('/employee/count', getEmployeeCount);
router.get('/employee/totalcount', getCount);
router.delete(
  "/profile/delete/:userId",
  requireSignIn,

  deleteUserRoleController
);




// Define routes
router.post('/e-register',requireSignIn,isEmployee, employeeRegisterController);


router.get('/all-employees',requireSignIn,isEmployee, getEmployees);

router.get("/employees/:employeeId",requireSignIn, getEmpDetailsController); // Read single employee
router.put("/update-employees/:employeeId",requireSignIn, updateEmployeeController); // Update employee role
router.delete("/delete-employees/:employeeId",requireSignIn,isEmployee, deleteEmployeeController);

router.put('/deactivate/:userId', deactivateUserController);

router.put('/activate/:userId', activateUserController);

router.get('/check-deactivation/:userId', checkUserIsActive);
router.get('/admin/roles', requireSignIn, isAdmin, getRoleBasedUsers);
router.get("/notprocessed", getNotProcessedOrdersCountController);



router.get('/hardware-employee/count', getHardwareEmployeeCount);

router.get('/software-employee/count', getSoftwareEmployeeCount);
router.get('/employee/Type', getEmployeeCounts);

//router.get("/usermanager/users", getAllUsers);

router.get("/user/get-email", requireSignIn, getUserEmailController);
router.post("/reportsgen", generateUserRegistrationPDF);
export default router;

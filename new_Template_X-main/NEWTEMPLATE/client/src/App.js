import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import Pagenotfound from "./pages/Pagenotfound";
import Register from "./pages/Auth/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminRoute from "./components/Routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Users from "./pages/Admin/Users";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import Products from "./pages/Admin/Products";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import CategoryProduct from "./pages/CategotyProduct";
import CartPage from "./pages/CartPage";
import AdminOrders from "./pages/Admin/AdminOrders";
import ViewUser from "./pages/Admin/ViewUser";
import EmployeeRoute from "./components/Routes/EmployeeRoute";

import EmployeeManagerDashboard from "./pages/EmployeManager/EmployeeManagerDashboard";
import EmployeeManagerProfileDashboard from "./pages/EmployeManager/EmployeeManagerProfileDashboard";
import CreatePosts from "./pages/Admin/CreatePosts";
import Posts from "./pages/Admin/Posts";
import UpdatePosts from "./pages/Admin/UpdatePosts";
import BookingPage from "./pages/user/BookingPage";
import Appointment from "./pages/user/appointment";
import EmployeeUserRoute from "./components/Routes/EmployeeUser";
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";
import NotificationDashboard from "./pages/user/NotificationDashboard";
import UpdateNotification from "./pages/Admin/UpdateNotification";
import CurrentUserAppointment from "./pages/user/CurrentUserAppointment";
import AllEmployees from "./pages/EmployeManager/AllEmployees";
import EditEmployee from "./pages/EmployeManager/EditEmployee";
import Feedback from "./pages/user/Feedback.js";
import FeedbackDashboard from "./pages/user/FeedbackDashboard.js";
import UpdateFeedback from "./pages/user/UpadteFeedback.js";
import MostBoughtItemsChart from "./pages/Admin/MostBoughtItemsChart.js";
import SalesReport from "./pages/Admin/SalesReport.js";
import Feedbackchart from "./pages/Admin/FeedbackChart.js";
import ProductReviews from "./pages/user/ProductReviews.js";
import GivenRatings from "./pages/user/GivenRatings.js";
import ShowAlltheRatings from "./pages/Admin/ShowAlltheRatings.js";
import CreateRole from "./pages/Admin/CreateRole.js";
import UploadImageForm from "./pages/user/UploadImageForm.js";
import CreateCard from "./pages/Card/CreateCard";
import EditCard from "./pages/Card/EditCard";
import DeleteCard from "./pages/Card/DeleteCard";
import ShowCard from "./pages/Card/ShowCard";
import CardHome from "./pages/Card/CardHome";
import CategoryproductChart from "./pages/Admin/CategoryproductChart.js";
import ProductList from "./pages/ProductList.js";
import Updateuser from "./../src/pages/user/Updateuser.js";
import ResetPassword from "./pages/Auth/ResetPassword.js";
import AdminProfile from "./pages/Admin/AdminProfile.js";
import Updateadminprofile from './pages/Admin/Updateadminprofile';
import MarkAttendance from "./pages/EmployeManager/MarkAttendance.js";
import Calender from "./../src/components/Calender/Calender.js";
import AllContacts from "./pages/Admin/showContacts.js";
import EmailForm from "./components/EmailForm.js";
import Roles from "./pages/Admin/Roles.js";
import AttendanceManager from "./pages/EmployeManager/AttendanceManager.js";
import AttendanceCountChart  from "./pages/EmployeManager/AttendanceCountChart.js";
import EmployeeList from "./pages/EmployeManager/EmployeeList.js";
import EmpManProfile from "./pages/EmployeManager/EmpManProfile.js";
import UpdateEmpmprofile from "./pages/EmployeManager/UpdateEmpmprofile.js";
import CurrentDateAppointment from "./pages/Admin/CurrentDateAppointment.js";
import ServiceDashboard from "./pages/Admin/ServiceDashboard.js";
import AppointmentCount from "./pages/Admin/appointmentcount.js";
import UsermanagerRoute from "./components/Routes/UsermanagerRoute.js";
import UsermanagerDashboard from "./pages/Usermanager/usermanagerDashboard.js";
import Umusers from "./pages/Usermanager/Umusers.js";
import Umroles from "./pages/Usermanager/Umroles.js";
import UmProfile from "./pages/Usermanager/UmProfile.js";
import UpdateUmprofile from "./pages/Usermanager/updateUmprofile.js";
import ViewAttendance from "./pages/EmployeManager/ViewAttendance.js";
import Map from './pages/user/Map.js';
import { Chart } from "react-chartjs-2";

import EmployeeProfile from "./pages/Employee/EmployeeProfile.js";
import UserRegistrationChart from "./pages/Usermanager/UserRegistrationChart.js";
import Contactreport from "./pages/Admin/Contactreport.js";
import CharPie from "./pages/Usermanager/PieChartUsers.js";
import Coupon from "./pages/Admin/Coupon.js";
import PostLikesBargraph from "./pages/Admin/PostLikesBargraph.js";
import Dashboard2 from "./pages/Admin/dashboard2.js";
import EmployeeNotifications from "./pages/Admin/EmployeeNotifications.js";
import UserCalender from "./components/Calender/UserCalender.js";
function App() {
  return (
    <>
      <Routes>
      <Route path="/chart" element={<PostLikesBargraph />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/productlist" element={<ProductList />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/appcount" element={<AppointmentCount />} />

        <Route path="/cards/cardHome" element={<CardHome />} />
        <Route path="/cards/create" element={<CreateCard />} />
        <Route path="/cards/details/:id" element={<ShowCard />} />
        <Route path="/cards/edit/:id" element={<EditCard />} />
        <Route path="/cards/delete/:id" element={<DeleteCard />} />

        <Route path="/category/:slug" element={<CategoryProduct />} />
        <Route path="/search" element={<Search />} />
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<Dashboard />} />
          <Route path="user/orders" element={<Orders />} />
          <Route path="user/profile" element={<Profile />} />
          <Route path="user/updateuser" element={<Updateuser />} />
          <Route path="user/appointment" element={<BookingPage />} />
          <Route path="user/getappointments" element={<Appointment />} />
          <Route path="user/notification" element={<NotificationDashboard />} />
          <Route path="user/currentappointments" element={<CurrentUserAppointment />} />
          <Route path="user/feedback" element={<Feedback />} />
          <Route path="user/feedbackdashboard" element={<FeedbackDashboard />} />
          <Route path="user/updatefeedback/:Id" element={<UpdateFeedback />} />
          <Route path="user/productReview/:productId" element={<ProductReviews />} />
          <Route path="user/givenRatings" element={<GivenRatings />} />
          <Route path="user/uploadimage" element={<UploadImageForm />} />
          <Route path="user/currentappointments" element={<CurrentUserAppointment />} />
       
        </Route>


      <Route path="/dashboard" element={<EmployeeUserRoute />}>
      <Route path="employeeuser" element={<EmployeeDashboard />} />
      <Route path="employeeProfile" element={<EmployeeProfile />} />
      </Route>

        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/create-category" element={<CreateCategory />} />
          <Route path="admin/create-product" element={<CreateProduct />} />
          <Route path="admin/product/:slug" element={<UpdateProduct />} />
          <Route path="admin/products" element={<Products />} />
          <Route path="admin/users" element={<Users />} />
          <Route path="admin/users/:userId" element={<ViewUser />} />
          <Route path="admin/chart" element={<SalesReport />} />
          <Route path="admin/chart3" element={<MostBoughtItemsChart />} />
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/create-post" element={<CreatePosts />} />
          <Route path="admin/get-posts" element={<Posts />} />
          <Route path="admin/update-posts/:id" element={<UpdatePosts />} />
          <Route path="admin/update-notification" element={<UpdateNotification />} />
          <Route path="admin/All-Ratings" element={<ShowAlltheRatings />} />
          <Route path="admin/createrole" element={<CreateRole />} />
          <Route path="admin/chart2" element={<CategoryproductChart />} />
          <Route path="admin/roles" element={<Roles />} />
        
          <Route path="admin/email" element={<EmailForm />} />
          <Route path="admin/profile" element={<AdminProfile />} />
          <Route path="admin/updateaprofile" element={<Updateadminprofile />} />
          <Route path="admin/contacts" element={<AllContacts />} />
          <Route path="admin/calender" element={<Calender />} />
          <Route path="admin/currentdate" element={<CurrentDateAppointment />} />
          <Route path="admin/servicedashboard" element={<ServiceDashboard />} />
          <Route path="admin/feedbackchart" element={<Feedbackchart/>} />
          <Route path="admin/couponcrud" element={<Coupon/>} />
          <Route path="admin/empnoti" element={<EmployeeNotifications/>} />
        </Route>
        <Route path="/dashboard" element={<EmployeeRoute />}>
        <Route path="employee" element={<EmployeeManagerProfileDashboard />} />
          <Route path="employee/creater" element={<EmployeeManagerDashboard />} />
          <Route path="employee/all-employees" element={<AllEmployees />} />
          <Route path="employee/MarkAttendance" element={<AttendanceManager />} />
          <Route path="employee/submitAttendance" element={<MarkAttendance />} />
          <Route path="employee/ViewAttendance" element={<ViewAttendance />} />
          <Route path="employee/employeeCount" element={<employeeDistribution />} />
          <Route path="employee/attendanceCount" element={<AttendanceCountChart />} />
          <Route path="employee/edit/:employeeId" element={<EditEmployee />} />
          <Route path="employee/list" element={<EmployeeList />} />
          <Route path="employee/empmprofile" element={<EmpManProfile />} />
          <Route path="employee/calender" element={<UserCalender />} />
        <Route path="employee/updateempmprofile"  element={<UpdateEmpmprofile />}  />  
        </Route>

        <Route path="/dashboard" element={<UsermanagerRoute />}>
          <Route path="usermanager" element={<UsermanagerDashboard />} />
          <Route path="usermanager/users" element={<Umusers />} />
          <Route path="usermanager/roles" element={<Umroles />} />
          <Route path="usermanager/profile" element={<UmProfile />} />
          <Route path="usermanager/chart" element={<UserRegistrationChart />} />
          <Route path="usermanager/pchart" element={<CharPie />} />
          <Route path="usermanager/calender" element={<UserCalender />} />
          <Route
            path="usermanager/updateUmprofile"
            element={<UpdateUmprofile />}
          />
        </Route>
 

<Route path="/contact-report" element={<Contactreport />} />
     <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:resetToken" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;

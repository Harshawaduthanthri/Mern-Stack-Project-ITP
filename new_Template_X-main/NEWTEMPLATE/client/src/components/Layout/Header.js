import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaComputer } from "react-icons/fa6";
import { SiOpensourcehardware } from "react-icons/si";
import { useAuth } from "../../context/auth";
import { toast } from 'react-toastify';
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/usecategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
import "./Header.css";
import '../../styles/siteCss/css/font-icons.css'
import logo from './GreenLineTechnology.png';
import { FaBell } from "react-icons/fa";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const categories = useCategory();
  const [cart] = useCart();
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout successfully");
  };

  useEffect(() => {
    const countUnreadNotifications = () => {
      const hasUnreadAppointments =
        auth?.user?.notifications?.some(
          (notification) =>
            notification.status === "unread" &&
            (notification.message.includes("Approved") ||
              notification.message.includes("Rejected"))
        ) || false;
  
      const unreadCount = hasUnreadAppointments ? 1 : 0;
      setUnreadNotificationCount(unreadCount);
    };
  
    countUnreadNotifications();
  }, [auth]);

  return (
    <>
      <header className="ltn__header-area ltn__header-3">       
  {/* ltn__header-top-area start */}
  <div className="ltn__header-top-area border-bottom">
    <div className="container">
      <div className="row">
        <div className="col-md-7">
          <div className="ltn__top-bar-menu">
            <ul>
              <li><a href="mailto:info@webmail.com?Subject=Flower%20greetings%20to%20you"><i class="bi bi-envelope-check"></i> GreenlineTechnology@gmail.com</a></li>
              <li><a href="locations.html"><i class="bi bi-geo-alt-fill"></i> 15/A, clock Tower, kandy</a></li>
            </ul>
          </div>
        </div>
        <div className="col-md-5">
          <div className="top-bar-right text-right text-end">
            <div className="ltn__top-bar-menu">
              <ul>
                
                  
                <li>
                  {/* ltn__social-media */}
                  <div className="ltn__social-media">
                    <ul>
                      <li><a href="#" title="Facebook"><i className="fab fa-facebook-f" /></a></li>
                      <li><a href="#" title="Twitter"><i className="fab fa-twitter" /></a></li>
                      <li><a href="#" title="Instagram"><i className="fab fa-instagram" /></a></li>
                      <li><a href="#" title="Dribbble"><i className="fab fa-dribbble" /></a></li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* ltn__header-top-area end */} 
  {/* ltn__header-middle-area start */}
  <div className="ltn__header-middle-area">
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="site-logo">
            <a href="index.html"><img src={logo} alt="Logo" /></a>
          </div>
        </div>
        <div className="col header-contact-serarch-column d-none d-lg-block">
          <div className="header-contact-search">
            {/* header-feature-item */}
            <div className="header-feature-item">
              <div className="header-feature-icon">
              <i class="bi bi-telephone-forward-fill"></i>
              </div>
              <div className="header-feature-info">
                <h6>Phone</h6>
                <p><a href="tel:0123456789">+075 4179179</a></p>
              </div>
            </div>
            {/* header-search-2 */}
            <div className="header-search-2">
            <SearchInput />
            </div>
          </div>
        </div>
        <div className="col">
          {/* header-options */}
          <div className="ltn__header-options">
            <ul>
              {!auth.user && ( // Check if user is not logged in
                <>
                  <li>
                    <a href="/login">Sign in</a>
                  </li>
                  <li>
                    <a href="/register">Register</a>
                  </li>
                </>
              )}
              {auth.user && ( // Check if user is logged in
                <>
                  <li>
                  <NavLink
                      to={`/dashboard/${
                        auth.user.role === 1
                          ? "admin"
                          : auth.user.role === 2
                          ? "employee"
                          : auth.user.role === 3
                          ? "employeeuser"
                          : auth.user.role === 4
                          ? "usermanager"
                          : "user"
                      }`}
                      className="dropdown-item"
                    >
                      My Account
                    </NavLink>
                  </li>
                  <li>
                    <a href="/login" onClick={handleLogout}>Logout</a>
                  </li>
                </>
              )}
              <li>
                {/* mini-cart 2 */}
                <div className="mini-cart-icon mini-cart-icon-2">
                  <Badge count={cart?.length} showZero>
                    <NavLink to="/cart" className="ltn__utilize-toggle" activeClassName="active-link">
                      <span className="mini-cart-icon">
                        <i className="bi bi-cart-check-fill"></i>  
                      </span>
                    </NavLink>
                  </Badge>
                </div>  
              </li>
              
              <li className="page-title text-black">{auth.user?.name}</li>
              <li>
                <div className="mini-cart-icon mini-cart-icon-2">
                        <Badge count={unreadNotificationCount} showZero>
                          <NavLink to="/dashboard/user/notification" className="ltn__utilize-toggle" activeClassName="active-link">
                            <span className="mini-cart-icon">
                              <FaBell />
                            </span>
                          </NavLink>
                        </Badge>
                      </div>  
               </li>  
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* ltn__header-middle-area end */}
  {/* header-bottom-area start */}
  <div className="header-bottom-area ltn__border-top ltn__header-sticky  ltn__sticky-bg-white--- ltn__sticky-bg-secondary ltn__secondary-bg section-bg-1 menu-color-white d-none d-lg-block">
    <div className="container">
      <div className="row">
        <div className="col header-menu-column justify-content-center">
          <div className="sticky-logo">
            <div className="site-logo">
              <a href="index.html"><img src="img/logo-3.png" alt="Logo" /></a>
            </div>
          </div>
          <div className="header-menu header-menu-2">
            <nav>
              <div className="ltn__main-menu">
                <ul>
                  <li className="/"><a href="/">Home</a></li>
                  <li className="menu-icon"><a href="#">About</a>
                    <ul>
                      <li><a href="/dashboard/user/feedback">Feedback</a></li>
                    </ul>
                  </li>
                  <li className="menu-icon"><a href="#">Pages</a>
                    <ul>
                      <li><a href="/contact">Contact Us</a></li>
                      <li><a href="dashboard/user/feedbackdashboard">Feedbacks</a></li>
                      <li><a href="/about">About us</a></li>
                    </ul>
                  </li>
                  <li className="menu-icon"><a href="/productlist">Shop</a>
                  <ul>
                      <li><a href="/">Toner & ribbon</a></li>
                      <li><a href="/">Printer Ink</a></li>
                      <li><a href="/">Computers</a></li>
                      <li><a href="/">Printers</a></li>
                    </ul>
                    </li>
                  <li><a href="/dashboard/user/appointment">Book Service</a></li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* header-bottom-area end */}
</header>
    </>
  );
};

export default Header;

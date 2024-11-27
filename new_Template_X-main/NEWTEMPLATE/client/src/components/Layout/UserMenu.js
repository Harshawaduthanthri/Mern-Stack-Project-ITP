import React from "react";
import { NavLink } from "react-router-dom";

const UserMenu = () => {
  
  return (
    <>
      <div className="text-center">
        <div className="list-group">
        <div className="text-center">
            <div className="list-group">
                <div className="col-lg-4">
                    <div className="ltn__tab-menu-list mb-90">
                        <div className="nav">
                        <NavLink activeClassName="active" exact to="/dashboard/user/profile">
                            Dashboard <i className="fas fa-tachometer-alt"></i>
                        </NavLink>
                        <NavLink to="/dashboard/user/orders">
                            Orders <i className="fas fa-file-alt"></i>
                        </NavLink>
                        <NavLink to="/dashboard/user/appointment">
                            Book Appointment <i className="fas fa-calendar-check"></i>
                        </NavLink>
                        <NavLink to="/dashboard/user/currentappointments">
                            Your Appointments <i className="fas fa-calendar-alt"></i>
                        </NavLink>
                        <NavLink to="/dashboard/user/feedback">
                            Feedback <i className="fas fa-comments"></i>
                        </NavLink>
                        <NavLink to="/dashboard/user/givenRatings">
                            Ratings <i className="fas fa-star"></i>
                        </NavLink>
                        <NavLink to="/dashboard/user/notification">
                            Alerts <i className="fas fa-bell"></i>
                        </NavLink>
                        <NavLink to="/dashboard/user/profile">
                            Profile <i className="fas fa-user"></i>
                        </NavLink>
                        

                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default UserMenu;

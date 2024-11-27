import React from "react";
import { NavLink } from "react-router-dom";
import "./AdminMenu.css"; // Import the CSS file for styling

const AdminMenu = () => {
  return (

    <div className="text-center">
    <div className="list-group">
    <div className="text-center">
        <div className="list-group">
            <div className="col-lg-4">
                <div className="ltn__tab-menu-list mb-90">
                    <div className="nav">
                    <NavLink
            to="/dashboard/admin"
            className="menu-link"
            activeClassName="active-menu-link"
          >
            AdminDashboard
          </NavLink>
                    <NavLink  to="/dashboard/admin/create-category">
                        Create Category <i className="fas fa-file-alt"></i>
                    </NavLink>
                    <NavLink  to="/dashboard/admin/create-product">
                        Create Prodcut <i className="fas fa-calendar-check"></i>
                    </NavLink>
                    <NavLink to="/dashboard/admin/products">
                        Prodcuts <i className="fas fa-calendar-check"></i>
                    </NavLink>
                    <NavLink to="/dashboard/admin/orders">
                       Orders <i className="fas fa-calendar-alt"></i>
                    </NavLink>
                    <NavLink to="/dashboard/admin/users">
                        Users <i className="fas fa-user"></i>
                    </NavLink>
                    <NavLink to="/dashboard/admin/create-post">
                        Create Post <i className="fas fa-star"></i>
                    </NavLink>
                    <NavLink to="/dashboard/admin/get-posts">
                        Posts <i className="fas fa-bell"></i>
                    </NavLink>
                    
                    <NavLink  to="/dashboard/admin/update-notification">
                        Appointments <i className="fas fa-calendar-check"></i>
                    </NavLink>
                    <NavLink to="/dashboard/admin/createrole">
                        Role <i className="fas fa-user"></i>
                    </NavLink>
                    <NavLink
            to="/dashboard/admin/servicedashboard"
            className="menu-link"
            activeClassName="active-menu-link"
          >
            Today Appointments
          </NavLink>
          <NavLink
            to="/dashboard/admin/servicedashboard"
            className="menu-link"
            activeClassName="active-menu-link"
          >
            Sevice Dashboard
          </NavLink>
                    <NavLink
            to="/dashboard/admin/profile"
            className="menu-link"
            activeClassName="active-menu-link"
          >
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/admin/createrole"
            className="menu-link"
            activeClassName="active-menu-link"
          >
            Create Roles
          </NavLink>
          <NavLink
            to="/dashboard/admin/role"
            className="menu-link"
            activeClassName="active-menu-link"
          >
             Roles
          </NavLink>
          <NavLink
            to="/dashboard/admin/contacts"
            className="menu-link"
            activeClassName="active-menu-link"
          >
            Contacts
          </NavLink>
          <NavLink
            to="/dashboard/admin/couponcrud"
            className="menu-link"
            activeClassName="active-menu-link"
          >
            Coupon
          </NavLink>
   
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
  </div>

   
    
  );

  
};

export default AdminMenu;

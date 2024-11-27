import React from "react";
import { NavLink } from "react-router-dom"; // Import NavLink for routing
import { useAuth } from "../../context/auth"; // Import useAuth hook for authentication context

const UserManagerMenu = () => {
  return (
    <div className="text-center">
      <div className="list-group">
        <h4>User Manager Panel</h4>
        <NavLink
          to="/dashboard/usermanager"
          className="menu-link"
          activeClassName="active-menu-link"
        >
          UserManager Dashboard
        </NavLink>
        <NavLink
          to="/dashboard/usermanager/users"
          className="menu-link"
          activeClassName="active-menu-link"
        >
          Users
        </NavLink>
        <NavLink
          to="/dashboard/usermanager/roles"
          className="menu-link"
          activeClassName="active-menu-link"
        >
          Roles
        </NavLink>
        <NavLink
          to="/dashboard/usermanager/profile"
          className="menu-link"
          activeClassName="active-menu-link"
        >
          Profile
        </NavLink>
        <NavLink
          to="/dashboard/usermanager/calender"
          className="menu-link"
          activeClassName="active-menu-link"
        >
          Calender
        </NavLink>
      </div>
    </div>
  );
};

export default UserManagerMenu;

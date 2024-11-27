import React from 'react';
import { NavLink } from 'react-router-dom';
//import './EmployeeMenu.css'; // Import CSS file for styling

const EmployeeMenu = () => {
  return (
    <div className="employee-manager-menu-container">
      <div className="text-center">
        <div className="list-group">
        <h4>Employee Dashboard</h4>
          <NavLink
            to="/dashboard/employeeProfile"
            className="menu-link"
            activeClassName="active-menu-link" // Add active class when link is active
          >
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/employee/employeeProfile"
            className="menu-link"
            //activeClassName="active-menu-link" // Add active class when link is active
          >
            View Attendance
          </NavLink>
          <NavLink
            to="/dashboard/employee/update-details"
            className="menu-link"
            //activeClassName="active-menu-link" // Add active class when link is active
          >
            </NavLink>
        </div>
      </div>
    </div>
  
  );
};

export default EmployeeMenu;
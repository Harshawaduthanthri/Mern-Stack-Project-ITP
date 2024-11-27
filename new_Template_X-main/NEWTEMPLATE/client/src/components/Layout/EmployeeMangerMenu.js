import React from 'react';
import { NavLink } from 'react-router-dom';
import './EmployeeManagerMenu.css'; // Import CSS file for styling

const EmployeeManagerMenu = () => {
  return (
    <div className="employee-manager-menu-container">
      <div className="text-center">
        <div className="list-group">
          <h4>Employee Manager Panel</h4>
          <NavLink
            to="/dashboard/employee/creater"
            className="menu-link"
            activeClassName="active-menu-link" // Add active class when link is active
          >
            Create Employee
          </NavLink>
          <NavLink
            to="/dashboard/employee/all-employees"
            className="menu-link"
            activeClassName="active-menu-link" // Add active class when link is active
          >
            All Employees
          </NavLink>
          <NavLink
            to="/dashboard/employee/markAttendance"
            className="menu-link"
            activeClassName="active-menu-link" // Add active class when link is active
          >
            Mark Attendance
          </NavLink>
          <NavLink
            to="/dashboard/employee/ViewAttendance"
            className="menu-link"
            activeClassName="active-menu-link" // Add active class when link is active
          >
            View Attendance
          </NavLink>
          <NavLink to="/dashboard/employee/empmprofile" 
          className="menu-link"
          activeClassName="active-menu-link"
          >
            Profile
          </NavLink>
          <NavLink
          to="/dashboard/employee/calender"
          className="menu-link"
          activeClassName="active-menu-link"
        >
          Calender
        </NavLink>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagerMenu;

import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";

const EmployeeList = () => {
  const [attendanceByDate, setAttendanceByDate] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceByDate();
  }, []);

  const fetchAttendanceByDate = async () => {
    try {
      const response = await axios.get("/api/v1/attendance/attendanceByDate");
      setAttendanceByDate(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching attendance by date:", error);
      setLoading(false);
    }
  };

  return (
    <Layout title={"Attendance Manager"}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="container-fluid m-3 p-3">
              <h1>Attendance Manager - Attendance by Date</h1>

              {loading ? (
                <p>Loading...</p>
              ) : (
                <div>
                  {attendanceByDate.map((group) => (
                    <div key={group._id}>
                      <h2>Date: {group._id}</h2>
                      <ul>
                        {group.attendance.map((record) => (
                          <li key={record._id}>
                            Employee ID: {record.employee._id}, Date: {record.AttendanceDate}, Employee Name: {record.employee.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeList;

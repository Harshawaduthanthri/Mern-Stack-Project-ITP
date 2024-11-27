import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import EmployeeMangerMenu from "../../components/Layout/EmployeeMangerMenu";
import { Button } from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ViewAttendance = () => {
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAttendanceByDate();
  }, [searchQuery]);

  const fetchAttendanceByDate = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/attendance/attendanceByDate/${searchQuery}`);
      console.log("Attendance data:", response.data); // Log the response data
      setAttendanceData(response.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById("attendanceTable");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save("attendance.pdf");
    });
  };

  const handleSearch = () => {
    // Fetch attendance data for the entered search date
    fetchAttendanceByDate();
  };

  return (
    <Layout title={"Attendance"}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <EmployeeMangerMenu />
          </div>
          <div className="col-md-9">
            <div className="container-fluid m-3 p-3">
              <h1>Attendance</h1>

              <Button type="primary" onClick={handleDownloadPDF} className="mb-3">
                Download as PDF
              </Button>

              <div>
                <label htmlFor="dateInput">Search by Date:</label>
                <input
                  type="date"
                  id="dateInput"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control mb-3"
                />
                <Button type="primary" onClick={handleSearch} className="mb-3">
                  Search
                </Button>
              </div>

              <table className="table" id="attendanceTable">
                <thead>
                  <tr style={{ backgroundColor: "#929ba3" }}>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Profession</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((attendanceRecord) => (
                    <tr key={attendanceRecord._id}>
                      <td>{attendanceRecord.employee ? attendanceRecord.employee.name : 'N/A'}</td>
                      <td>{attendanceRecord.employee ? attendanceRecord.employee.email : 'N/A'}</td>
                      <td>{attendanceRecord.employee ? attendanceRecord.employee.profession : 'N/A'}</td>
                      <td>{new Date(attendanceRecord.AttendenceDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewAttendance;

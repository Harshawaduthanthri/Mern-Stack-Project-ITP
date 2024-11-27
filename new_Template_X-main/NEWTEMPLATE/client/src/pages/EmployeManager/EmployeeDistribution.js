import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Button } from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Chart, CategoryScale, LinearScale, Tooltip, Legend, PieController, ArcElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, Tooltip, Legend, PieController, ArcElement);

const EmployeeDistribution = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeCounts = async () => {
      try {
        // Fetch data for hardware and software employee counts
        const hardwareResponse = await axios.get('/api/v1/auth/hardware-employee/count');
        const softwareResponse = await axios.get('/api/v1/auth/software-employee/count');

        // Extract hardware and software employee counts
        const hardwareCount = hardwareResponse.data.hardwareEmployeeCount;
        const softwareCount = softwareResponse.data.softwareEmployeeCount;

        // Setting chart data
        setChartData({
          labels: ['Hardware Employees', 'Software Employees'],
          datasets: [
            {
              label: 'Employee Type',
              data: [hardwareCount, softwareCount],
              backgroundColor: ['#007bff', '#28a745'],
              hoverOffset: 4,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching employee counts:', error);
        setLoading(false);
      }
    };

    fetchEmployeeCounts();
  }, []);

  const handleDownloadPDF = () => {
    const input = document.getElementById("employee-count");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save("EmployeeDistribution.pdf");
    });
  };

  return (
    <div>
      <h2>Employee Type Distribution</h2>

      <Button type="primary" onClick={handleDownloadPDF} className="mb-3">
        Download as PDF
      </Button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div id="employee-count">
        <Pie
          data={chartData}
          options={{
            plugins: {
              legend: {
                display: true,
                position: 'right',
              },
            },
          }}
        />
        </div>
      )}
    </div>
  );
};

export default EmployeeDistribution;
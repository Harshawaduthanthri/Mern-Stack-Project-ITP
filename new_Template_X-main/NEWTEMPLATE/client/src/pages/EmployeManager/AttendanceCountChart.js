import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Chart, CategoryScale, LinearScale, TimeScale, Tooltip, Legend, LineController, LineElement } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { PointElement } from 'chart.js';
Chart.register(PointElement);

Chart.register(CategoryScale, LinearScale, TimeScale, Tooltip, Legend, LineController, LineElement);

const AttendanceCountChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceCount = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/attendance/attendanceCountByDate');
        const data = response.data;

        // Sort the data by date
        data.sort((a, b) => new Date(a._id) - new Date(b._id));

        // Manipulate data to reset count to 10 every 10 days
        const modifiedData = data.map((item, index) => {
          // Reset the count to 10 every 10 days
          if (index % 10 === 0) {
            return { ...item, count: 10 };
          }
          return item;
        });

        // Extracting labels and data for the chart
        const labels = modifiedData.map(item => item._id);
        const counts = modifiedData.map(item => item.count);

        // Setting chart data
        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Attendance Count',
              data: counts,
              fill: true, // Fill the area below the line
              backgroundColor: 'rgba(220, 20, 60, 0.5)', // Dark pink background color
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching attendance count:', error);
        setLoading(false);
      }
    };

    fetchAttendanceCount();
  }, []);

  const handleDownloadPDF = () => {
    const input = document.getElementById("attendance-count");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save("AttendanceCount.pdf");
    });
  };

  return (
    <div>
      <h2>Attendance Count</h2>

      <Button type="primary" onClick={handleDownloadPDF} className="mb-3">
        Download as PDF
      </Button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div id="attendance-count">
          <Line
            data={chartData}
            options={{
              scales: {
                x: {
                  type: 'time',
                  time: {
                    unit: 'day',
                    displayFormats: {
                      day: 'MMM d',
                    },
                  },
                  title: {
                    display: true,
                    text: 'Date',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Attendance Count',
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AttendanceCountChart;

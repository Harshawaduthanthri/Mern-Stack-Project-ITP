import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";

const Dashboard2 = () => {
  const [serviceTypeCounts, setServiceTypeCounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/feedback/service-type-counts"
        );
        setServiceTypeCounts(response.data);
      } catch (error) {
        console.error("Error fetching service type counts:", error);
        setError("Error fetching data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare data for the pie chart
  const chartData = {
    labels: serviceTypeCounts.map((count) => count._id),
    datasets: [
      {
        label: "Service Type Counts",
        data: serviceTypeCounts.map((count) => count.count),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#8A2BE2",
          "#00FFFF",
          "#7FFF00",
        ],
      },
    ],
  };

  return (
    <div>
      <div className="header">
        <h1>Thank you for your support </h1>
      </div>
      <h6>Service Type Counts</h6>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <div className="small-pie-chart">
            <Pie data={chartData} />
          </div>
          <ul>
            {serviceTypeCounts.map((count, index) => (
              <li key={index}>
                {count._id}: {count.count}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard2;

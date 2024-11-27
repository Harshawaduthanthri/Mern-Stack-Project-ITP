import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, Tooltip, Legend, PieController, ArcElement } from 'chart.js';

// Register necessary components with Chart.js
Chart.register(CategoryScale, LinearScale, Tooltip, Legend, PieController, ArcElement);

const AppointmentTypePieChart = () => {
    // State for the chart data and loading status
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Fetch data from the server
        const fetchAppointmentTypeCount = async () => {
            try {
                // Make an API call to fetch data
                const response = await axios.get('http://localhost:8085/api/v1/appointment/appointment-type-count');
                const data = response.data;

                // Log the response data for debugging
                console.log('Response data:', data);
                
                // Check if data is an array
                if (!Array.isArray(data)) {
                    console.error('Expected data to be an array, but it is:', typeof data);
                    setLoading(false);
                    return;
                }

                // Map labels and data for the chart
                const labels = data.map(item => item._id); // Appointment types
                const counts = data.map(item => item.count); // Counts for each type

                // Create chart data object
                const newChartData = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Appointment Type Count',
                            data: counts,
                            backgroundColor: [
                                '#FF6384', // Colors for each appointment type
                                '#36A2EB',
                                '#FFCE56',
                                // Add more colors if needed
                            ],
                            borderColor: ['#FFFFFF'], // Border colors
                            borderWidth: 1,
                        },
                    ],
                };

                // Set the chart data and loading status
                setChartData(newChartData);
                setLoading(false);
            } catch (error) {
                // Handle errors and log the error message
                console.error('Error fetching appointment type count data:', error);
                setLoading(false);
            }
        };

        // Call the fetch function
        fetchAppointmentTypeCount();
    }, []);

    return (
        <div>
            <h2>Appointment Type Distribution</h2>
            {loading ? (
                // Display loading message while data is being fetched
                <p>Loading...</p>
            ) : (
                // Render the Pie chart if data has loaded
                chartData && (
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
                )
            )}
        </div>
    );
};

export default AppointmentTypePieChart;

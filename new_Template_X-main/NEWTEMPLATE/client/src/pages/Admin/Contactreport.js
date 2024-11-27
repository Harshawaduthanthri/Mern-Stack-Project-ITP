import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

const EmployeeDistribution = () => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                // Fetch the report data from the backend
                const response = await axios.get('/api/v1/getcontact/report');
                const reportData = response.data;

                // Extract labels and counts from the report data
                const labels = reportData.map(item => item._id);
                const counts = reportData.map(item => item.count);

                // Set chart data
                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            data: counts,
                            backgroundColor: [
                                '#007bff', // Blue
                                '#d891ef', // Green
                                '#9457eb', // Yellow
                                '#d473d4', // Red
                                '#6610f2', // Purple
                                '#6f42c1', // Indigo
                            ],
                        },
                    ],
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching report:', error);
                setLoading(false);
            }
        };

        fetchReport();
    }, []);

    return (
        <div>
            <h2>Summary chart for inquiries</h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
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
            )}
        </div>
    );
};

export default EmployeeDistribution;
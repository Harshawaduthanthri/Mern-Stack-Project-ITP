import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const AppointmentStatusChart = () => {
    const [counts, setCounts] = useState({});
    
    useEffect(() => {
        // Fetch notification counts from the server
        const fetchNotificationCounts = async () => {
            try {
                const response = await axios.get('http://localhost:8085/api/v1/appointment/notification-counts');
                setCounts(response.data);
            } catch (error) {
                console.error('Error fetching notification counts:', error);
            }
        };

        fetchNotificationCounts();
    }, []);

    // Prepare data for the bar graph
    const data = {
        labels: ['Unread', 'Approved', 'Rejected', 'Pending', 'Done'],
        datasets: [
            {
                label: 'Notification Counts',
                data: [
                    counts['unread'] || 0,
                    counts['approved'] || 0,
                    counts['rejected'] || 0,
                    counts['pending'] || 0,
                    counts['done'] || 0,
                ],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            }
        ]
    };

    return (
        <div>
            <h2>Counts by Status</h2>
            <Bar
                data={data}
                options={{
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                var dataset = data.datasets[tooltipItem.datasetIndex];
                                var currentValue = dataset.data[tooltipItem.index];
                                return currentValue + ' Count';
                            }
                        }
                    }
                }}
            />
        </div>
    );
};

export default AppointmentStatusChart;

import React, { useEffect, useState } from 'react';

const AppointmentCount = () => {
    const [count, setCount] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the appointment count from the backend API
        fetch('http://localhost:3000/api/v1/appointment/count')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching appointment count');
                }
                return response.json();
            })
            .then(data => {
                setCount(data.count);
            })
            .catch(err => {
                console.error('Error fetching appointment count:', err);
                setError('Error fetching appointment count');
            });
    }, []);

    return (
        <div>
            <h2>Appointment Count</h2>
            {error ? (
                <p>{error}</p>
            ) : (
                <p>Number of appointments: {count}</p>
            )}
        </div>
    );
};

export default AppointmentCount;
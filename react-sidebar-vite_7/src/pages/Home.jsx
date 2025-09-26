import React from 'react';

const Home = () => {
    return (
        <div>
            <h1 style={{
                color: '#2c3e50',
                fontSize: '2.5rem',
                marginBottom: '1rem',
                fontWeight: '600'
            }}>
                Welcome to Your Dashboard
            </h1>
            <p style={{
                color: '#7f8c8d',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                marginBottom: '2rem'
            }}>
                This is a modern sidebar navigation example with a dark theme design.
                Use the hamburger menu to toggle the sidebar navigation.
            </p>
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '10px',
                boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
                marginTop: '2rem'
            }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Features</h3>
                <ul style={{ color: '#7f8c8d', lineHeight: '1.8' }}>
                    <li>Responsive sidebar design</li>
                    <li>Smooth animations and transitions</li>
                    <li>Dark theme with gradient background</li>
                    <li>Active page highlighting</li>
                    <li>Mobile-friendly overlay</li>
                </ul>
            </div>
        </div>
    );
};

export default Home;

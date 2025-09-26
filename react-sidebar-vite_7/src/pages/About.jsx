import React from 'react';

const About = () => {
    return (
        <div>
            <h1 style={{
                color: '#2c3e50',
                fontSize: '2.5rem',
                marginBottom: '1rem',
                fontWeight: '600'
            }}>
                About Us
            </h1>
            <p style={{
                color: '#7f8c8d',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                marginBottom: '2rem'
            }}>
                Learn more about our company and what we do.
            </p>
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '10px',
                boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
                marginTop: '2rem'
            }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Our Mission</h3>
                <p style={{ color: '#7f8c8d', lineHeight: '1.8' }}>
                    We strive to create beautiful and functional web applications that provide
                    excellent user experiences. Our focus is on modern design, clean code, and
                    responsive layouts that work across all devices.
                </p>
            </div>
        </div>
    );
};

export default About;

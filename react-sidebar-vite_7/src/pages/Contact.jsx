import React from 'react';

const Contact = () => {
    return (
        <div>
            <h1 style={{
                color: '#2c3e50',
                fontSize: '2.5rem',
                marginBottom: '1rem',
                fontWeight: '600'
            }}>
                Contact Us
            </h1>
            <p style={{
                color: '#7f8c8d',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                marginBottom: '2rem'
            }}>
                Get in touch with our team.
            </p>
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '10px',
                boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
                marginTop: '2rem'
            }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Contact Information</h3>
                <div style={{ color: '#7f8c8d', lineHeight: '1.8' }}>
                    <p><strong>Email:</strong> contact@example.com</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Address:</strong> 123 Main Street, City, State 12345</p>
                </div>
            </div>
        </div>
    );
};

export default Contact;

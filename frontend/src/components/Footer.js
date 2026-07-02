import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            background: '#1F4E79',
            color: 'white',
            textAlign: 'center',
            padding: '20px',
            marginTop: 'auto'
        }}>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>
                ☁️ CloudShop — M.Sc. IT Cloud & Application Development Project
            </p>
            <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '6px' }}>
                Built with React + Spring Boot + AWS | 2025-2026
            </p>
        </footer>
    );
};

export default Footer;
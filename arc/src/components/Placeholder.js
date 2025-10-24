import React from 'react';
import '../Styles/Placeholder.css';
import { FaWrench } from 'react-icons/fa';

function Placeholder({ title }) {
    return (
        <div className="placeholder-container">
            <FaWrench className="placeholder-icon" />
            <h2 className="placeholder-title">{title} Page</h2>
            <p className="placeholder-text">This feature is under construction. Check back soon!</p>
        </div>
    );
}

export default Placeholder;
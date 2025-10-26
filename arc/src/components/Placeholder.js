/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: October 2025
 * Displays a simple "under construction" message for pages
 * or features that are not yet implemented.
 */

import React from 'react';
import { FaWrench } from 'react-icons/fa';
import '../Styles/Placeholder.css';

function Placeholder({ title }) {
    return (
        <section className="placeholder-container" aria-label={`${title} placeholder`}>
            <FaWrench className="placeholder-icon" aria-hidden="true" />
            <h2 className="placeholder-title">{title} Page</h2>
            <p className="placeholder-text">
                This feature is under construction. Check back soon!
            </p>
        </section>
    );
}

export default Placeholder;

/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: October 2025
 * Allows the user to manage the visual appearance of the
 * A.R.C. (Archive. Record. Connect.) application.
 * 
 * Current features:
 *  - Toggle between Light and Dark themes.
 * 
 * Future enhancements:
 *  - Add font size / contrast controls for accessibility.
 */

import React from 'react';
import ThemeToggleButton from '../ThemeToggleButton';

// DisplaySettings Component
// Renders the Display Settings panel, giving users control over the application's theme and visual preferences.
function DisplaySettings() {
    return (
        <div className="settings-panel">
            <h2>Display</h2>
            <p>Manage the visual appearance of the application.</p>

            <div className="form-group-grid">
                <div className="form-group-grid-left">
                    <label htmlFor="theme-toggle">Theme</label>
                    <small>Switch between light and dark mode.</small>
                </div>
                <div className="form-group-grid-right">
                    <ThemeToggleButton id="theme-toggle" />
                </div>
            </div>
        </div>
    );
}

export default DisplaySettings;

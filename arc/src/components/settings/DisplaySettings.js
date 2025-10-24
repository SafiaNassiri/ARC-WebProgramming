import React from 'react';
import ThemeToggleButton from '../ThemeToggleButton';

function DisplaySettings() {
    return (
        <div className="settings-panel">
            <h2>Display</h2>
            <p>Manage the visual appearance of the application.</p>

            <div className="form-group-grid">
                <div className="form-group-grid-left">
                    <label>Theme</label>
                    <small>Switch between light and dark mode.</small>
                </div>
                <div className="form-group-grid-right">
                    <ThemeToggleButton />
                </div>
            </div>

        </div>
    );
}

export default DisplaySettings;
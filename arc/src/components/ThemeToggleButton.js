/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: October 2025
 * A reusable button that allows users to toggle between
 * light and dark themes across the A.R.C. web application.
 *
 * Uses the `ThemeContext` for global state management.
 */

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import '../Styles/ThemeToggleButton.css';

/**
 * Renders a button that toggles the current visual theme.
 * - Displays the opposite theme.
 * - Utilizes the global `useTheme` context for consistency across the app.
 */
function ThemeToggleButton() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            className="theme-toggle-button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
    );
}

export default ThemeToggleButton;

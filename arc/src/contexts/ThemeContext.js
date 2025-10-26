/**
 * Provides a global theme state and toggle function for the A.R.C. web application.
 * Manages "light" and "dark" mode preferences and applies them to the document root.
 *
 * This context enables consistent theming across all React components.
 * The current theme is stored in `localStorage` to persist between sessions.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a new React context for theme management
const ThemeContext = createContext();

// Wraps the application and provides theme state + toggle function to any child components using the `useTheme` hook.
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    const value = { theme, toggleTheme };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

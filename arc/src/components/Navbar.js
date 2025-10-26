/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: October 2025
 * Provides global site navigation with responsive behavior.
 * Includes desktop links, a mobile burger menu, and a user profile dropdown.
 *
 * Features:
 * - Adaptive layout for mobile and desktop
 * - Dynamic authentication state (shows login/signup or profile menu)
 * - Click-outside detection for dropdown menu
 * - Smooth UX for mobile navigation
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaCompass, FaUsers, FaBars, FaTimes } from 'react-icons/fa';
import '../Styles/Navbar.css';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
    // Context + State Management
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const displayName = user?.username || 'Profile';
    const handleMobileMenuToggle = () => setIsMobileMenuOpen((prev) => !prev);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isDropdownOpen &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    // Renders the dropdown or mobile profile menu. Accepts a callback for when a link is clicked (to close menus).
    const profileLinks = (onLinkClick) => (
        <>
            <Link to="/profile" className="dropdown-item" onClick={onLinkClick}>
                My Profile
            </Link>
            <Link to="/settings" className="dropdown-item" onClick={onLinkClick}>
                Settings
            </Link>
            <button
                onClick={() => {
                    logout();
                    onLinkClick?.();
                }}
                className="dropdown-item dropdown-logout-btn"
            >
                Logout
            </button>
        </>
    );

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo-link" onClick={closeMobileMenu}>
                <div className="navbar-logo">
                    <span className="navbar-logo-main">A.R.C.</span>
                    <span className="navbar-logo-tagline">Archive. Record. Connect.</span>
                </div>
            </Link>

            <ul className="navbar-links desktop-links">
                <li><NavLink to="/"><FaHome /> <span>Home</span></NavLink></li>
                <li><NavLink to="/discover"><FaCompass /> <span>Discover</span></NavLink></li>
                <li><NavLink to="/community"><FaUsers /> <span>Community</span></NavLink></li>
            </ul>

            <div className="navbar-auth-section">
                {isAuthenticated ? (
                    <div className="navbar-user desktop-profile" ref={dropdownRef}>
                        <button
                            className="user-menu-button"
                            onClick={() => setIsDropdownOpen((prev) => !prev)}
                        >
                            <span className="user-menu-name">{displayName}</span>
                            <div className="user-menu-avatar">{/* Avatar placeholder */}</div>
                        </button>

                        {isDropdownOpen && (
                            <div className="user-dropdown">
                                {profileLinks(() => setIsDropdownOpen(false))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="navbar-action-buttons desktop-auth">
                        <button
                            className="navbar-login-btn"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                        <button
                            className="navbar-signup-btn"
                            onClick={() => navigate('/register')}
                        >
                            Sign Up
                        </button>
                    </div>
                )}
            </div>

            <button
                className="burger-menu-button"
                onClick={handleMobileMenuToggle}
                aria-label="Toggle mobile menu"
            >
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {isMobileMenuOpen && (
                <div className="navbar-mobile-menu">
                    <ul className="navbar-links mobile-links-list">
                        <li><NavLink to="/" onClick={closeMobileMenu}><FaHome /> <span>Home</span></NavLink></li>
                        <li><NavLink to="/discover" onClick={closeMobileMenu}><FaCompass /> <span>Discover</span></NavLink></li>
                        <li><NavLink to="/community" onClick={closeMobileMenu}><FaUsers /> <span>Community</span></NavLink></li>
                    </ul>

                    <hr className="mobile-menu-divider" />

                    <div className="mobile-auth-section">
                        {isAuthenticated ? (
                            <div className="mobile-profile-menu">
                                <div className="user-menu-name mobile-user-name">{displayName}</div>
                                {profileLinks(closeMobileMenu)}
                            </div>
                        ) : (
                            <div className="navbar-action-buttons mobile-auth-buttons">
                                <button
                                    className="navbar-login-btn"
                                    onClick={() => { navigate('/login'); closeMobileMenu(); }}
                                >
                                    Login
                                </button>
                                <button
                                    className="navbar-signup-btn"
                                    onClick={() => { navigate('/register'); closeMobileMenu(); }}
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;

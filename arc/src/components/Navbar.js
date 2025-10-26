import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
// Assuming 'Styles' is lowercase: 'styles'
import '../Styles/Navbar.css';
// Import icons for links AND burger/close buttons
import { FaHome, FaCompass, FaUsers, FaBars, FaTimes } from 'react-icons/fa';
// --- FIX: Corrected path to 'contexts' (plural) ---
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Create a ref for the dropdown menu
    const dropdownRef = useRef(null);

    // Use user's actual username if available
    const displayName = user ? user.username : 'Profile';

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // This effect handles closing the dropdown if you click *outside* of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the dropdown is open and the click was *not* inside the ref's current element
            if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        // Add the event listener to the document
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup: remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]); // Only re-run this effect if isDropdownOpen changes


    // Modified profileLinks to accept a callback for when a link is clicked
    const profileLinks = (onLinkClick) => (
        <>
            <Link to="/profile" className="dropdown-item" onClick={onLinkClick}>My Profile</Link>
            <Link to="/settings" className="dropdown-item" onClick={onLinkClick}>Settings</Link>
            <button
                onClick={() => {
                    logout();
                    if (onLinkClick) onLinkClick(); // Call the provided click handler
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

            {/* --- Desktop Links (Hidden on mobile) --- */}
            <ul className="navbar-links desktop-links">
                <li><NavLink to="/"><FaHome /> <span>Home</span></NavLink></li>
                <li><NavLink to="/discover"><FaCompass /> <span>Discover</span></NavLink></li>
                <li><NavLink to="/community"><FaUsers /> <span>Community</span></NavLink></li>
            </ul>

            {/* --- Right Side: Auth Buttons or Profile Menu --- */}
            <div className="navbar-auth-section">
                {isAuthenticated ? (
                    // --- Desktop Profile Menu ---
                    // Assign the ref to the parent div
                    <div
                        className="navbar-user desktop-profile"
                        ref={dropdownRef}
                    >
                        {/* Change from hover to click to toggle the menu */}
                        <button
                            className="user-menu-button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span className="user-menu-name">{displayName}</span>
                            <div className="user-menu-avatar">
                                {/* Later: Add real avatar */}
                            </div>
                        </button>
                        {isDropdownOpen && (
                            <div className="user-dropdown">
                                {/* Pass a function to close the *desktop* dropdown on click */}
                                {profileLinks(() => setIsDropdownOpen(false))}
                            </div>
                        )}
                    </div>
                ) : (
                    // --- Desktop Login/Sign Up Buttons ---
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

            {/* --- Burger Menu Button (Mobile Only) --- */}
            <button className="burger-menu-button" onClick={handleMobileMenuToggle}>
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />} {/* Toggle icon */}
            </button>

            {/* --- Mobile Menu Overlay --- */}
            {isMobileMenuOpen && (
                <div className="navbar-mobile-menu">
                    {/* Mobile Links */}
                    <ul className="navbar-links mobile-links-list">
                        <li><NavLink to="/" onClick={closeMobileMenu}><FaHome /> <span>Home</span></NavLink></li>
                        <li><NavLink to="/discover" onClick={closeMobileMenu}><FaCompass /> <span>Discover</span></NavLink></li>
                        <li><NavLink to="/community" onClick={closeMobileMenu}><FaUsers /> <span>Community</span></NavLink></li>
                    </ul>

                    <hr className="mobile-menu-divider" />

                    {/* Mobile Auth Section */}
                    <div className="mobile-auth-section">
                        {isAuthenticated ? (
                            <div className="mobile-profile-menu">
                                <div className="user-menu-name mobile-user-name">{displayName}</div>
                                {/* Pass the function to close the *mobile* menu on click */}
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


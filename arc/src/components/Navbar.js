import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../Styles/Navbar.css'; // Adjust path if needed
// Import icons for links AND burger/close buttons
import { FaHome, FaCompass, FaUsers, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
    const { user, isAuthenticated, logout } = useAuth(); // Corrected: Get user, isAuthenticated, logout
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
    const navigate = useNavigate();

    // Use user's actual username if available
    const displayName = user ? user.username : 'Profile'; // Use user.username

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };


    // Combine Profile/Settings/Logout links for reuse
    const profileLinks = (
        <>
            <Link to="/profile" className="dropdown-item" onClick={closeMobileMenu}>My Profile</Link>
            <Link to="/settings" className="dropdown-item" onClick={closeMobileMenu}>Settings</Link>
            <button
                onClick={() => {
                    logout();
                    closeMobileMenu(); // Close mobile menu on logout
                }}
                className="dropdown-item dropdown-logout-btn" // Added class for specific styling
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
                    <div
                        className="navbar-user desktop-profile"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <button className="user-menu-button">
                            <span className="user-menu-name">{displayName}</span>
                            <div className="user-menu-avatar">
                                {/* Later: Add real avatar */}
                            </div>
                        </button>
                        {isDropdownOpen && (
                            <div className="user-dropdown">
                                {profileLinks}
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
                                {profileLinks}
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


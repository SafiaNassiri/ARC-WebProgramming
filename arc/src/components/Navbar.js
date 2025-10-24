import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../Styles/Navbar.css';
import { FaHome, FaCompass, FaUsers } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
    const { isAuthenticated, user, loading, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    // Get the user's name
    const displayName = user?.username || "Profile";

    const onLogout = () => {
        logout();
        navigate('/');
    };

    const authLinks = (
        // This is what shows if you ARE logged in
        <div
            className="navbar-user"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
        >
            <button className="user-menu-button">
                <span className="user-menu-name">{displayName}</span>
                <div className="user-menu-avatar">
                    {/* We can add profile pics later */}
                </div>
            </button>

            {isDropdownOpen && (
                <div className="user-dropdown">
                    <Link to="/profile" className="dropdown-item">My Profile</Link>
                    <Link to="/settings" className="dropdown-item">Settings</Link>
                    {/* Add a Logout link */}
                    <a href="#!" onClick={onLogout} className="dropdown-item">Logout</a>
                </div>
            )}
        </div>
    );

    const guestLinks = (
        // This is what shows if you are NOT logged in
        <div className="navbar-auth-buttons">
            <button
                className="navbar-login-btn"
                onClick={() => navigate('/login')}
            >
                Login
            </button>
            <button
                className="navbar-register-btn"
                onClick={() => navigate('/register')}
            >
                Sign Up
            </button>
        </div>
    );

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo-link">
                <div className="navbar-logo">
                    <span className="navbar-logo-main">A.R.C.</span>
                    <span className="navbar-logo-tagline">Archive. Record. Connect.</span>
                </div>
            </Link>

            <ul className="navbar-links">
                <li><NavLink to="/"><FaHome /> <span>Home</span></NavLink></li>
                <li><NavLink to="/discover"><FaCompass /> <span>Discover</span></NavLink></li>
                <li><NavLink to="/community"><FaUsers /> <span>Community</span></NavLink></li>
            </ul>

            {/* The final logic: show links based on auth state */}
            {!loading && (isAuthenticated ? authLinks : guestLinks)}
        </nav>
    );
}

export default Navbar;


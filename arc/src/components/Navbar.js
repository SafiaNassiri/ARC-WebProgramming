import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../Styles/Navbar.css';
import { FaHome, FaCompass, FaUsers } from 'react-icons/fa';

function Navbar() {
    const studentName = "YOUR NAME HERE";
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

            <div
                className="navbar-user"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
            >
                <button
                    className="user-menu-button"
                >
                    <span className="user-menu-name">{studentName}</span>
                    <div className="user-menu-avatar"></div>
                </button>

                {isDropdownOpen && (
                    <div className="user-dropdown">
                        <Link to="/profile" className="dropdown-item">My Profile</Link>
                        <Link to="/settings" className="dropdown-item">Settings</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
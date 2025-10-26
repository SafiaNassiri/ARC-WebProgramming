/**
 * Login page for A.R.C. web application.
 * Users can enter their email and password to access their account.
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../Styles/LoginPage.css';

// Renders the login form, handles form input and submission, and redirects authenticated users to the homepage.
function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const { login, isAuthenticated, error, clearError } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (clearError) clearError();
    }, [clearError]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (login) login({ email, password });
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Login</h1>
                <p className="auth-subtitle">Sign in to your A.R.C. account</p>
                {error && <p className="error-message">{error}</p>}

                <form onSubmit={onSubmit}>
                    <div className="form-group-stacked">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group-stacked">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={onChange}
                            minLength="6"
                            required
                        />
                    </div>
                    <button type="submit" className="login-submit-btn">
                        Login
                    </button>
                </form>
                <p className="login-redirect">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;

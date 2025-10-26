/**
 * Registration page for new users to create an A.R.C. account.
 * Includes client-side validation for password confirmation and
 * integrates with AuthContext for registration.
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../Styles/LoginPage.css';

// RegisterPage Component
function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '', // For password confirmation
    });
    const [localError, setLocalError] = useState(''); // Local validation error

    const { username, email, password, password2 } = formData;
    const { register, isAuthenticated, error, clearError } = useAuth();
    const navigate = useNavigate();

    // Clear previous auth errors on mount
    useEffect(() => {
        if (clearError) clearError();
    }, [clearError]);

    // Redirect authenticated users to home
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    //Handle input changes for controlled form fields
    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // Handle form submission
    const onSubmit = (e) => {
        e.preventDefault();

        // Client-side validation: check if passwords match
        if (password !== password2) {
            setLocalError('Passwords do not match');
            return;
        }

        setLocalError(''); // Clear any previous local error
        if (register) register({ username, email, password });
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Sign Up</h1>
                <p className="auth-subtitle">Create your A.R.C. account</p>
                {localError && <p className="error-message">{localError}</p>}
                {error && <p className="error-message">{error}</p>}

                <form onSubmit={onSubmit}>
                    <div className="form-group-stacked">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <div className="form-group-stacked">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
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
                            value={password}
                            onChange={onChange}
                            minLength="6"
                            required
                        />
                    </div>

                    <div className="form-group-stacked">
                        <label htmlFor="password2">Confirm Password</label>
                        <input
                            type="password"
                            name="password2"
                            value={password2}
                            onChange={onChange}
                            minLength="6"
                            required
                        />
                    </div>

                    <button type="submit" className="login-submit-btn">
                        Register
                    </button>
                </form>

                <p className="login-redirect">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;

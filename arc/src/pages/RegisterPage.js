import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../Styles/LoginPage.css'; // We can reuse the same CSS

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '', // For password confirmation
    });
    const [localError, setLocalError] = useState(''); // For password mismatch

    const { username, email, password, password2 } = formData;

    const { register, isAuthenticated, error, clearError } = useAuth();
    const navigate = useNavigate();

    // Clear any previous errors when the page loads
    useEffect(() => {
        if (clearError) clearError();
    }, [clearError]);

    // If user is already logged in, redirect to home
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();
        // Check if passwords match
        if (password !== password2) {
            setLocalError('Passwords do not match');
        } else {
            setLocalError(''); // Clear local error
            if (register) register({ username, email, password });
        }
    };

    return (
        // Use the same CSS classes as LoginPage.js
        <div className="login-container">
            <div className="login-box">
                <h1>Sign Up</h1>
                <p className="auth-subtitle">Create your A.R.C. account</p>

                {/* Show an error message if one exists */}
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


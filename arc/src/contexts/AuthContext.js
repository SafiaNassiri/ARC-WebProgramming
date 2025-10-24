import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

// --- Create The Context ---
const AuthContext = createContext();

// --- Create a Custom Hook ---
export const useAuth = () => {
    return useContext(AuthContext);
};

// --- Create The Provider Component ---
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // The backend server URL
    // We'll proxy this later, but for now, we'll hardcode it.
    const backendUrl = 'http://localhost:5000/api';

    useEffect(() => {
        // Check if a token exists in localStorage when the app loads
        const loadUser = async () => {
            if (localStorage.token) {
                setAuthToken(localStorage.token); // Set the token in axios headers
            } else {
                setLoading(false);
                return; // No token, stop here
            }

            try {
                // Get user data from our new '/api/auth' route
                const res = await axios.get(`${backendUrl}/auth`);
                setUser(res.data);
                setIsAuthenticated(true);
            } catch (err) {
                // If token is invalid
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    // --- Auth Functions ---

    // Register User
    const register = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(`${backendUrl}/auth/register`, formData);
            localStorage.setItem('token', res.data.token);
            setAuthToken(res.data.token);

            // We just registered, now get the user data
            const userRes = await axios.get(`${backendUrl}/auth`);
            setUser(userRes.data);
            setIsAuthenticated(true);
            setLoading(false);
            navigate('/'); // Redirect to home
        } catch (err) {
            setError(err.response.data.msg); // Save error message
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setLoading(false);
        }
    };

    // Login User
    const login = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(`${backendUrl}/auth/login`, formData);
            localStorage.setItem('token', res.data.token);
            setAuthToken(res.data.token);

            // We just logged in, now get the user data
            const userRes = await axios.get(`${backendUrl}/auth`);
            setUser(userRes.data);
            setIsAuthenticated(true);
            setLoading(false);
            navigate('/'); // Redirect to home
        } catch (err) {
            setError(err.response.data.msg); // Save error message
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setLoading(false);
        }
    };

    // Logout User
    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login'); // Redirect to login
    };

    // Clear errors
    const clearError = () => {
        setError(null);
    };

    // --- Provide The Values ---
    const value = {
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


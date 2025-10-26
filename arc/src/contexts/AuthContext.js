/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: October 2025
 * Provides global authentication and user data management for
 * the A.R.C. (Archive. Record. Connect.) web application.
 * 
 * This context handles:
 *  - User registration, login, and logout
 *  - Persistent authentication using JWT tokens
 *  - Fetching user-related data (favorites, posts)
 *  - Managing API request errors gracefully
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setupAuthToken } from '../utils/api';


// Context Initialization
const AuthContext = createContext();

// Custom hook for consuming AuthContext.
export const useAuth = () => useContext(AuthContext);

// Helper Functions
// Extracts a human-readable message from an Axios error object.
const getErrorMessage = (err) => {
    if (err.response?.data?.msg) {
        return err.response.data.msg;
    } else if (err.response?.status === 401) {
        return 'Unauthorized. Please log in again.';
    } else if (err.request) {
        return 'Cannot connect to server. Please try again later.';
    } else {
        console.error('Unexpected Error:', err);
        return 'An unexpected error occurred.';
    }
};

// AuthProvider Component
// AuthProvider component wraps the app and provides authentication state.
export function AuthProvider({ children }) {
    // State Management
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favoriteGames, setFavoriteGames] = useState([]);
    const [posts, setPosts] = useState([]);

    const navigate = useNavigate();

    // Data Fetching Functions
    // Fetches the authenticated user's favorite games.
    const getFavoriteGames = async () => {
        try {
            const res = await api.get('/games/my-favorites');
            setFavoriteGames(res.data);
            console.log('Fetched favorite games:', res.data);
        } catch (err) {
            console.error('Error fetching favorite games:', err);
            if (err.response?.status === 401) {
                console.warn('Unauthorized - logging out user.');
                logout();
            }
        }
    };

    // Fetches all posts for the community section.
    const getPosts = async () => {
        try {
            const res = await api.get('/posts');
            setPosts(res.data);
            console.log('Fetched posts:', res.data);
        } catch (err) {
            console.error('Error fetching posts:', err);
            if (err.response?.status === 401) {
                console.warn('Unauthorized - logging out user.');
                logout();
            }
        }
    };

    // Load User on Mount
    useEffect(() => {
        const loadUser = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                // No token found → clear state
                setIsAuthenticated(false);
                setUser(null);
                setFavoriteGames([]);
                setPosts([]);
                setLoading(false);
                return;
            }

            try {
                const res = await api.get('/auth');
                setUser(res.data);
                setIsAuthenticated(true);
                await Promise.all([getFavoriteGames(), getPosts()]);
            } catch (err) {
                console.error('Load User Error:', err);
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                setUser(null);
                setFavoriteGames([]);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    // Authentication Functions
    // Registers a new user.
    const register = async (formData) => {
        setError(null);
        try {
            const res = await api.post('/auth/register', formData);
            setupAuthToken(res.data.token);

            const userRes = await api.get('/auth');
            setUser(userRes.data);
            setIsAuthenticated(true);
            setFavoriteGames([]);
            await getPosts();

            navigate('/');
        } catch (err) {
            console.error('Registration failed:', err);
            setError(getErrorMessage(err));
            setupAuthToken(null);
            setIsAuthenticated(false);
            throw err;
        }
    };

    // Logs in an existing user.
    const login = async (formData) => {
        setError(null);
        try {
            const res = await api.post('/auth/login', formData);
            setupAuthToken(res.data.token);

            const userRes = await api.get('/auth');
            setUser(userRes.data);
            setIsAuthenticated(true);

            await Promise.all([getFavoriteGames(), getPosts()]);
            console.log('Login successful, navigating to /');
            navigate('/');
        } catch (err) {
            console.error('Login failed:', err);
            setError(getErrorMessage(err));
            setupAuthToken(null);
            setIsAuthenticated(false);
            throw err;
        }
    };

    // Logs out the current user and clears all stored data.
    const logout = () => {
        setupAuthToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setFavoriteGames([]);
        setPosts([]);
        navigate('/login');
    };

    // Clears the error state manually.
    const clearError = () => setError(null);

    // Favorite Games 
    // Adds a game to the user's favorites.
    const addFavoriteGame = async (gameData) => {
        if (!isAuthenticated) return;
        setError(null);
        try {
            const res = await api.put('/games/add', gameData);
            setFavoriteGames(res.data.favoriteGames);
        } catch (err) {
            console.error('Error adding favorite:', err);
            setError(getErrorMessage(err));
        }
    };

    // Removes a game from the user's favorites.
    const removeFavoriteGame = async (gameId) => {
        if (!isAuthenticated) return;
        setError(null);
        try {
            const res = await api.put('/games/remove', { gameId });
            setFavoriteGames(res.data.favoriteGames);
        } catch (err) {
            console.error('Error removing favorite:', err);
            setError(getErrorMessage(err));
        }
    };

    // Post Management
    // Creates a new user post
    const createPost = async (postContent) => {
        if (!isAuthenticated) return false;
        setError(null);
        try {
            const res = await api.post('/posts', { content: postContent });
            setPosts((prev) => [res.data, ...prev]);
            return true;
        } catch (err) {
            console.error('Error creating post:', err);
            setError(getErrorMessage(err));
            return false;
        }
    };

    // Context Value
    const value = {
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        clearError,
        favoriteGames,
        addFavoriteGame,
        removeFavoriteGame,
        posts,
        createPost,
        getPosts,
    };

    // Render Provider
    return (
        <AuthContext.Provider value={value}>
            {/* Render children only after authentication state is checked */}
            {!loading && children}
        </AuthContext.Provider>
    );
}

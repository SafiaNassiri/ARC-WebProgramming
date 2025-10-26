import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

// Create The Context
const AuthContext = createContext();

// Create a Custom Hook
export const useAuth = () => {
    return useContext(AuthContext);
};

// Helper function to get error messages
const getErrorMessage = (err) => {
    if (err.response && err.response.data && err.response.data.msg) {
        return err.response.data.msg;
    } else if (err.request) {
        return 'Cannot connect to server. Please try again later.';
    } else {
        return 'An unexpected error occurred.';
    }
};

// Create The Provider Component
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favoriteGames, setFavoriteGames] = useState([]); // <-- NEW STATE FOR FAVORITES
    const [posts, setPosts] = useState([]); // State for posts
    const navigate = useNavigate();

    const backendUrl = 'http://localhost:5000/api';

    // Helper function to get favorites
    const getFavoriteGames = async () => {
        if (!localStorage.token) return;
        try {
            // Use the correct backend route
            const res = await axios.get(`${backendUrl}/games/my-favorites`);
            setFavoriteGames(res.data); // The backend sends back just the array
            console.log("Fetched favorite games:", res.data); // Debug log
        } catch (err) {
            console.error("Error fetching favorite games:", err);
            // Don't log out the user if fetching favorites fails
            // Maybe set an error specific to favorites?
        }
    };

    // Helper function to get posts
    const getPosts = async () => {
        try {
            const res = await axios.get(`${backendUrl}/posts`);
            setPosts(res.data);
            console.log("Fetched posts:", res.data); // Debug log
        } catch (err) {
            console.error("Error fetching posts:", err);
        }
    };

    // Load user data on initial app load
    useEffect(() => {
        const loadUser = async () => {
            if (localStorage.token) {
                setAuthToken(localStorage.token);
            } else {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${backendUrl}/auth`);
                setUser(res.data);
                setIsAuthenticated(true);
                // Fetch favorites and posts AFTER user is confirmed
                await getFavoriteGames();
                await getPosts();
            } catch (err) {
                console.error("Load User Error:", err);
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                setUser(null);
                setFavoriteGames([]); // Clear states on error
                setPosts([]);
            } finally {
                setLoading(false); // Ensure loading is always false eventually
            }
        };

        loadUser();
    }, []); // Empty dependency array means run once on mount

    // Register User
    const register = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(`${backendUrl}/auth/register`, formData);
            localStorage.setItem('token', res.data.token);
            setAuthToken(res.data.token);

            const userRes = await axios.get(`${backendUrl}/auth`);
            setUser(userRes.data);
            setIsAuthenticated(true);
            setFavoriteGames([]); // Start with empty favorites on register
            await getPosts(); // Fetch posts
            setLoading(false);
            navigate('/');
        } catch (err) {
            setError(getErrorMessage(err));
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

            const userRes = await axios.get(`${backendUrl}/auth`);
            setUser(userRes.data);
            setIsAuthenticated(true);

            // Fetch favorites and posts AFTER successful login
            await getFavoriteGames();
            await getPosts();

            setLoading(false);
            console.log("Login successful, navigating to /");
            navigate('/');

        } catch (err) {
            console.error("Login failed:", err);
            setError(getErrorMessage(err));
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
        setFavoriteGames([]); // Clear states on logout
        setPosts([]);
        navigate('/login');
    };

    // Clear errors
    const clearError = () => {
        setError(null);
    };

    // --- FAVORITE GAME FUNCTIONS ---
    const addFavoriteGame = async (gameData) => {
        if (!isAuthenticated) return; // Must be logged in
        try {
            // gameData should be { gameId, name, image }
            const res = await axios.put(`${backendUrl}/games/add`, gameData);
            setFavoriteGames(res.data.favoriteGames); // Update state with the list from backend
        } catch (err) {
            console.error("Error adding favorite:", err);
            setError(getErrorMessage(err));
        }
    };

    const removeFavoriteGame = async (gameId) => {
        if (!isAuthenticated) return; // Must be logged in
        try {
            const res = await axios.put(`${backendUrl}/games/remove`, { gameId });
            setFavoriteGames(res.data.favoriteGames); // Update state with the list from backend
        } catch (err) {
            console.error("Error removing favorite:", err);
            setError(getErrorMessage(err));
        }
    };

    // --- POST FUNCTIONS ---
    const createPost = async (postContent) => {
        if (!isAuthenticated) return false;
        try {
            const res = await axios.post(`${backendUrl}/posts`, { content: postContent });
            // Add new post to the beginning of the local state
            setPosts([res.data, ...posts]);
            return true; // Indicate success
        } catch (err) {
            console.error("Error creating post:", err);
            setError(getErrorMessage(err));
            return false; // Indicate failure
        }
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
        clearError,
        favoriteGames, // <-- Provide favorites
        addFavoriteGame, // <-- Provide add function
        removeFavoriteGame, // <-- Provide remove function
        posts, // <-- Provide posts
        createPost, // <-- Provide create function
        getPosts // <-- Provide get function
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} {/* Render children only when not loading */}
        </AuthContext.Provider>
    );
}
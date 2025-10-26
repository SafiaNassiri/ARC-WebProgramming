import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Assuming api.js now handles axios instances and token logic primarily
// --- FIX: Trying a different path to go UP two directories to 'src' if AuthContext is deep (e.g., src/contexts/AuthContext.js) ---
// If 'src/utils/api.js' is correct, then the path from 'src/contexts/' must be '../utils/api'. We will try a different notation if that fails.
import { api, setupAuthToken } from '../utils/api'; // Trying absolute path from 'src' root

// Create The Context
const AuthContext = createContext();
// ... (rest of the file is unchanged) ...
// Create a Custom Hook
export const useAuth = () => {
    return useContext(AuthContext);
};

// Helper function to get error messages
const getErrorMessage = (err) => {
    if (err.response && err.response.data && err.response.data.msg) {
        // Error message from our backend (e.g., "Invalid credentials")
        return err.response.data.msg;
    } else if (err.response && err.response.status === 401) {
        // Specific handling for unauthorized errors
        return 'Unauthorized. Please log in again.';
    } else if (err.request) {
        // Network error (e.g., server down, CORS issue)
        return 'Cannot connect to server. Please try again later.';
    } else {
        // Other unexpected errors
        console.error("Unexpected Error:", err); // Log the full error for debugging
        return 'An unexpected error occurred.';
    }
};

// Create The Provider Component
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // *** This is the MAIN auth loading state ***
    const [error, setError] = useState(null);
    const [favoriteGames, setFavoriteGames] = useState([]);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    // Backend URL is now managed within api.js instance
    // const backendUrl = 'http://localhost:5000/api';

    // Helper function to get favorites
    const getFavoriteGames = async () => {
        // No need to check localStorage.token here, interceptor handles auth
        try {
            const res = await api.get('/games/my-favorites'); // Use 'api' instance
            setFavoriteGames(res.data);
            console.log("Fetched favorite games:", res.data);
        } catch (err) {
            // Only log error, don't set global error state for optional fetches
            console.error("Error fetching favorite games:", err);
            // If it's a 401, the interceptor might handle logout or token removal
            if (err.response && err.response.status === 401) {
                // Handle unauthorized access specifically if needed, e.g., logout
                // logout(); // Or let loadUser handle it
            }
        }
    };

    // Helper function to get posts
    const getPosts = async () => {
        try {
            const res = await api.get('/posts'); // Use 'api' instance
            setPosts(res.data);
            console.log("Fetched posts:", res.data);
        } catch (err) {
            // Only log error, don't set global error state for optional fetches
            console.error("Error fetching posts:", err);
        }
    };

    // Load user data on initial app load
    useEffect(() => {
        // --- FIX: Corrected syntax error ---
        const loadUser = async () => {
            setLoading(true); // Start loading check
            const token = localStorage.getItem('token'); // Check token existence

            if (token) {
                // No need to call setAuthToken/setupAuthToken here, interceptor handles it.
            } else {
                // No token found, user is not logged in
                setIsAuthenticated(false);
                setUser(null);
                setFavoriteGames([]);
                setPosts([]);
                setLoading(false); // Finish loading check
                return;
            }

            try {
                // Attempt to fetch user data using the token (interceptor adds it)
                const res = await api.get('/auth');
                setUser(res.data);
                setIsAuthenticated(true);
                // Fetch dependent data ONLY after confirming user authentication
                await Promise.all([getFavoriteGames(), getPosts()]); // Fetch concurrently
            } catch (err) {
                console.error("Load User Error:", err);
                // If fetching user fails (e.g., invalid token), log out fully
                localStorage.removeItem('token');
                // setupAuthToken(null); // Ensure header is cleared if needed
                setIsAuthenticated(false);
                setUser(null);
                setFavoriteGames([]);
                setPosts([]);
                // Optionally set an error message if needed
                // setError("Session expired. Please log in again.");
            } finally {
                // *** Ensure loading is set to false AFTER all attempts ***
                setLoading(false);
            }
        };

        loadUser();
    }, []); // Empty dependency array means run once on mount

    // Register User
    const register = async (formData) => {
        setError(null); // Clear previous errors
        try {
            const res = await api.post('/auth/register', formData); // Use 'api' instance
            setupAuthToken(res.data.token); // Store token using setup function

            // Fetch user data immediately after successful registration
            const userRes = await api.get('/auth');
            setUser(userRes.data);
            setIsAuthenticated(true);
            setFavoriteGames([]); // Reset favorites for new user
            await getPosts(); // Fetch posts
            navigate('/'); // Redirect to home
        } catch (err) {
            console.error("Registration failed:", err);
            setError(getErrorMessage(err)); // Set error message
            setupAuthToken(null); // Clear token on failure
            setIsAuthenticated(false);
            // Re-throw the error so the component can catch it (e.g., for 'isSubmitting')
            throw err;
        }
        // No setLoading needed here as main loading is for initial load
    };

    // Login User
    const login = async (formData) => {
        setError(null); // Clear previous errors
        try {
            const res = await api.post('/auth/login', formData); // Use 'api' instance
            setupAuthToken(res.data.token); // Store token using setup function

            // Fetch user data immediately after successful login
            const userRes = await api.get('/auth');
            setUser(userRes.data);
            setIsAuthenticated(true);

            // Fetch dependent data after login confirmation
            await Promise.all([getFavoriteGames(), getPosts()]); // Fetch concurrently

            console.log("Login successful, navigating to /");
            navigate('/'); // Redirect to home

        } catch (err) {
            console.error("Login failed:", err);
            setError(getErrorMessage(err)); // Set error message
            setupAuthToken(null); // Clear token on failure
            setIsAuthenticated(false);
            // Re-throw the error so the component can catch it (e.g., for 'isSubmitting')
            throw err;
        }
        // No setLoading needed here
    };

    // Logout User
    const logout = () => {
        setupAuthToken(null); // Clear token using setup function
        setUser(null);
        setIsAuthenticated(false);
        setFavoriteGames([]); // Clear states
        setPosts([]);
        navigate('/login'); // Redirect to login page
    };

    // Clear errors manually if needed
    const clearError = () => {
        setError(null);
    };

    // Add a favorite game
    const addFavoriteGame = async (gameData) => {
        if (!isAuthenticated) return; // Prevent action if not logged in
        setError(null); // Clear previous errors
        try {
            const res = await api.put('/games/add', gameData); // Use 'api' instance
            setFavoriteGames(res.data.favoriteGames); // Update state from backend response
        } catch (err) {
            console.error("Error adding favorite:", err);
            setError(getErrorMessage(err)); // Set error message
        }
    };

    // Remove a favorite game
    const removeFavoriteGame = async (gameId) => {
        if (!isAuthenticated) return; // Prevent action if not logged in
        setError(null); // Clear previous errors
        try {
            const res = await api.put('/games/remove', { gameId }); // Use 'api' instance
            setFavoriteGames(res.data.favoriteGames); // Update state from backend response
        } catch (err) {
            console.error("Error removing favorite:", err);
            setError(getErrorMessage(err)); // Set error message
        }
    };

    // Create a new post
    const createPost = async (postContent) => {
        if (!isAuthenticated) return false; // Prevent action if not logged in
        setError(null); // Clear previous errors
        try {
            const res = await api.post('/posts', { content: postContent }); // Use 'api' instance
            // Add the newly created post (returned from backend) to the start of the state
            setPosts(prevPosts => [res.data, ...prevPosts]);
            return true; // Indicate success
        } catch (err) {
            console.error("Error creating post:", err);
            setError(getErrorMessage(err)); // Set error message
            return false; // Indicate failure
        }
    };

    // --- Provide The Values ---
    // Make sure all functions and state variables needed by components are included
    const value = {
        user,
        isAuthenticated,
        loading, // This indicates the initial auth check status
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
        getPosts // Expose getPosts if components need to trigger manual refresh
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Render children only when the initial auth check is complete */}
            {!loading && children}
        </AuthContext.Provider>
    );
}

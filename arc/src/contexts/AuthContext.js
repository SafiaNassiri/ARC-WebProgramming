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

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { api, setupAuthToken } from "../utils/api";

// Context Initialization
const AuthContext = createContext();

// Custom hook for consuming AuthContext
export const useAuth = () => useContext(AuthContext);

// Helper function to extract a readable message from an Axios error
const getErrorMessage = (err) => {
  if (err.response?.data?.msg) return err.response.data.msg;
  if (err.response?.status === 401) return "Unauthorized. Please log in again.";
  if (err.request) return "Cannot connect to server. Please try again later.";
  console.error("Unexpected Error:", err);
  return "An unexpected error occurred.";
};

// AuthProvider component
export function AuthProvider({ children }) {
  // State
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  // Logs out the current user
  const logout = useCallback(() => {
    setupAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setFavoriteGames([]);
    setPosts([]);
    navigate("/login");
  }, [navigate]);

  // Fetches the authenticated user's favorite games
  const getFavoriteGames = useCallback(async () => {
    try {
      const res = await api.get("/games/favorites");
      setFavoriteGames(res.data);
      console.log("Fetched favorite games:", res.data);
    } catch (err) {
      console.error("Error fetching favorite games:", err);
      if (err.response?.status === 401) {
        console.warn("Unauthorized - logging out user.");
        logout();
      }
    }
  }, [logout]);

  // Fetches all posts
  const getPosts = useCallback(async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
      console.log("Fetched posts:", res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      if (err.response?.status === 401) {
        console.warn("Unauthorized - logging out user.");
        logout();
      }
    }
  }, [logout]);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setFavoriteGames([]);
        setPosts([]);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth");
        setUser(res.data);
        setIsAuthenticated(true);
        await Promise.all([getFavoriteGames(), getPosts()]);
      } catch (err) {
        console.error("Load User Error:", err);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
        setFavoriteGames([]);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [getFavoriteGames, getPosts]);

  // Registers a new user
  const register = async (formData) => {
    setError(null);
    try {
      const res = await api.post("/auth/register", formData);
      setupAuthToken(res.data.token);

      const userRes = await api.get("/auth");
      setUser(userRes.data);
      setIsAuthenticated(true);
      setFavoriteGames([]);
      await getPosts();

      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
      setError(getErrorMessage(err));
      setupAuthToken(null);
      setIsAuthenticated(false);
      throw err;
    }
  };

  // Logs in an existing user
  const login = async (formData) => {
    setError(null);
    try {
      const res = await api.post("/auth/login", formData);
      setupAuthToken(res.data.token);

      const userRes = await api.get("/auth");
      setUser(userRes.data);
      setIsAuthenticated(true);

      await Promise.all([getFavoriteGames(), getPosts()]);
      console.log("Login successful, navigating to /");
      navigate("/");

      return { success: true };
    } catch (err) {
      console.error("Login failed:", err);
      const message = getErrorMessage(err);
      setError(message);
      setupAuthToken(null);
      setIsAuthenticated(false);
      return { success: false, message };
    }
  };

  // Clears the error manually
  const clearError = () => setError(null);

  // Toggle favorite game
  const toggleFavoriteGame = async (game) => {
    if (!isAuthenticated) return;

    const gamePayload = {
      gameId: game.id,
      name: game.title,
      imageUrl: game.imageUrl,
      rating: game.rating || 0,
    };

    const isFavorited = favoriteGames.some(
      (g) => g.gameId === gamePayload.gameId
    );

    try {
      let res;
      if (isFavorited) {
        res = await api.delete(`/games/favorite/${gamePayload.gameId}`);
      } else {
        res = await api.put("/games/favorite", gamePayload);
      }

      setFavoriteGames(res.data);
    } catch (err) {
      console.error("Error toggling favorite:", err);
      setError(getErrorMessage(err));
    }
  };

  // Add a game to favorites
  const addFavoriteGame = async (game) => {
    if (!isAuthenticated) return;
    setError(null);

    // Make sure payload matches backend
    const payload = {
      gameId: game.id, // not game.gameId
      name: game.title,
      imageUrl: game.imageUrl,
      rating: game.rating || 0,
    };

    try {
      const res = await api.put("/games/favorite", payload);
      setFavoriteGames(res.data);
      console.log("Updated favoriteGames:", res.data);
    } catch (err) {
      console.error("Error adding favorite:", err);
      setError(getErrorMessage(err));
    }
  };

  // Remove a game from favorites
  const removeFavoriteGame = async (gameId) => {
    if (!isAuthenticated) return;
    setError(null);

    try {
      await api.delete(`/games/favorite/${gameId}`);
      // Remove immediately from state
      setFavoriteGames((prev) => prev.filter((g) => g.gameId !== gameId));
    } catch (err) {
      console.error("Error removing favorite:", err);
      setError(getErrorMessage(err));
    }
  };

  // Post Management
  const createPost = async (postContent) => {
    if (!isAuthenticated) return false;
    setError(null);
    try {
      const res = await api.post("/posts", { content: postContent });
      setPosts((prev) => [res.data, ...prev]);
      return true;
    } catch (err) {
      console.error("Error creating post:", err);
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
    toggleFavoriteGame,
  };

  // Render Provider
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

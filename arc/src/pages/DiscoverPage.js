/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: December 2025
 * Discover page with game search and favorites functionality
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import GameRow from "../components/GameRow";
import SearchGameCard from "../components/SearchGameCard";
import "../Styles/DiscoverPage.css";
import {
  FaSteam,
  FaXbox,
  FaPlaystation,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

// RAWG API Configuration
const API_KEY = process.env.REACT_APP_RAWG_API_KEY;
const RAWG_API_URL = "https://api.rawg.io/api";

// Formats API data from RAWG into a simplified structure
const formatApiData = (apiGames) => {
  if (!Array.isArray(apiGames)) return [];
  return apiGames.map((game) => ({
    id: game.id,
    title: game.name,
    description: game.rating
      ? `Rating: ${game.rating.toFixed(1)} / 5.0`
      : "No rating available",
    imageUrl: game.background_image,
    rating: game.rating || 0,
  }));
};

function DiscoverPage() {
  const { favoriteGames, addFavoriteGame, removeFavoriteGame } = useAuth();

  const [trendingGames, setTrendingGames] = useState([]);
  const [recommendedGames, setRecommendedGames] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [searchError, setSearchError] = useState(null);

  // Fetch trending and recommended games on mount
  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      setError(null);

      if (!API_KEY) {
        setError(
          "Missing RAWG API Key. Please configure it in your .env file."
        );
        setIsLoading(false);
        return;
      }

      try {
        const [trendingRes, recommendedRes] = await Promise.all([
          axios.get(`${RAWG_API_URL}/games`, {
            params: { key: API_KEY, ordering: "-added", page_size: 10 },
          }),
          axios.get(`${RAWG_API_URL}/games`, {
            params: {
              key: API_KEY,
              genres: "action",
              ordering: "-rating",
              page_size: 10,
            },
          }),
        ]);

        setTrendingGames(formatApiData(trendingRes.data?.results || []));
        setRecommendedGames(formatApiData(recommendedRes.data?.results || []));
      } catch (err) {
        if (err.response) {
          setError(
            `API Error ${err.response.status}: ${
              err.response.data?.detail || "Unable to fetch games."
            }`
          );
        } else if (err.request) {
          setError("Network error. Could not connect to RAWG API.");
        } else {
          setError("Unexpected error while fetching games.");
        }
        setTrendingGames([]);
        setRecommendedGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Search games function
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      console.log("Searching RAWG for:", searchQuery);
      console.log("API Key exists:", !!API_KEY);

      const response = await axios.get(`${RAWG_API_URL}/games`, {
        params: {
          key: API_KEY,
          search: searchQuery,
          page_size: 12,
        },
      });

      console.log("RAWG Response:", response.data);
      console.log("Results count:", response.data?.results?.length || 0);

      const formatted = formatApiData(response.data?.results || []);
      console.log("Formatted results:", formatted);

      setSearchResults(formatted);

      if (formatted.length === 0) {
        console.warn("No games found for query:", searchQuery);
      }
    } catch (err) {
      console.error("Search error:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setSearchError("Failed to search games. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchError(null);
  };

  // Check if a game is favorited
  const isGameFavorited = (gameId) => {
    return favoriteGames.some((game) => game.gameId === String(gameId));
  };

  // Handle add to favorites
  const handleAddToFavorites = async (game) => {
    try {
      await addFavoriteGame({
        id: game.id,
        title: game.title,
        imageUrl: game.imageUrl,
        rating: game.rating,
      });
    } catch (err) {
      console.error("Error adding to favorites:", err);
    }
  };

  // Handle remove from favorites
  const handleRemoveFromFavorites = async (gameId) => {
    try {
      await removeFavoriteGame(String(gameId));
    } catch (err) {
      console.error("Error removing from favorites:", err);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <main className="discover-page">
        <h1>Game Discovery</h1>
        <p>Loading games...</p>
      </main>
    );
  }

  // Error State
  if (error) {
    return (
      <main className="discover-page">
        <h1>Game Discovery</h1>
        <p className="error-message">{error}</p>
      </main>
    );
  }

  return (
    <main className="discover-page">
      <h1>Game Discovery</h1>

      {/* Search Section */}
      <section className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="clear-search-btn"
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="search-submit-btn"
            disabled={isSearching}
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="search-results">
            <h2>Search Results ({searchResults.length})</h2>
            <div className="search-results-grid">
              {searchResults.map((game) => (
                <SearchGameCard
                  key={game.id}
                  game={game}
                  isFavorited={isGameFavorited(game.id)}
                  onAddToFavorites={handleAddToFavorites}
                  onRemoveFromFavorites={handleRemoveFromFavorites}
                />
              ))}
            </div>
          </div>
        )}

        {/* Search Error */}
        {searchError && (
          <div className="search-error">
            <p>{searchError}</p>
          </div>
        )}

        {/* No Results */}
        {!isSearching &&
          searchQuery &&
          searchResults.length === 0 &&
          !searchError && (
            <div className="no-results">
              <p>
                No games found for "{searchQuery}". Try a different search term.
              </p>
            </div>
          )}
      </section>

      {/* Featured Section */}
      <section className="featured-card">
        <h2>Featured: Path of Exile 2</h2>
        <p>
          The sequel to the legendary ARPG is almost here. Explore a new
          campaign, discover powerful new classes, and battle the darkness
          consuming Wraeclast.
        </p>
      </section>

      {/* Recommended Section */}
      <section>
        <h2>Recommended For You</h2>
        {recommendedGames.length > 0 ? (
          <GameRow title="" games={recommendedGames} />
        ) : (
          <p>No recommended games available at this time.</p>
        )}
      </section>

      {/* Trending Section */}
      <section>
        <h2>Trending Now</h2>
        {trendingGames.length > 0 ? (
          <GameRow title="" games={trendingGames} />
        ) : (
          <p>No trending games available right now.</p>
        )}
      </section>

      {/* Platform Section */}
      <section className="platform-card">
        <h2>Connect Your Platforms</h2>
        <div className="platform-list">
          <div className="platform-item">
            <FaSteam className="platform-icon" />
            <div className="platform-info">
              <h3>Steam</h3>
              <button>Connect</button>
            </div>
          </div>
          <div className="platform-item">
            <FaXbox className="platform-icon" />
            <div className="platform-info">
              <h3>Xbox</h3>
              <button>Connect</button>
            </div>
          </div>
          <div className="platform-item">
            <FaPlaystation className="platform-icon" />
            <div className="platform-info">
              <h3>PlayStation</h3>
              <button>Connect</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DiscoverPage;

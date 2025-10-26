import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 1. Import axios
import GameRow from '../components/GameRow';
import '../Styles/DiscoverPage.css'; // Adjust path if needed
import { FaSteam, FaXbox, FaPlaystation } from 'react-icons/fa';

// Get API key from the .env file
const API_KEY = process.env.REACT_APP_RAWG_API_KEY;
const RAWG_API_URL = 'https://api.rawg.io/api'; // Base URL

function DiscoverPage() {
    console.log("DiscoverPage rendering..."); // Log when component renders

    const [trendingGames, setTrendingGames] = useState([]);
    const [recommendedGames, setRecommendedGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Renamed for clarity within component
    const [error, setError] = useState(null); // Add state for errors

    const formatApiData = (apiGames) => {
        // Add a check to ensure apiGames is an array
        if (!Array.isArray(apiGames)) {
            console.error("formatApiData received non-array:", apiGames);
            return []; // Return empty array if data is invalid
        }
        return apiGames.map(game => ({
            id: game.id,
            // Use game.name consistently from RAWG
            title: game.name,
            description: game.rating ? `Rating: ${game.rating.toFixed(1)} / 5.0` : 'No rating', // Handle missing rating
            // RAWG uses background_image
            imageUrl: game.background_image
        }));
    };

    useEffect(() => {
        console.log("DiscoverPage useEffect triggered."); // Log when effect runs

        const fetchGames = async () => {
            console.log("fetchGames function started."); // Log start of fetch
            setIsLoading(true); // Use component-specific loading state
            setError(null); // Clear previous errors

            // Check if API key is present
            console.log("Checking API Key:", API_KEY ? "Present" : "MISSING!"); // Log API Key status
            if (!API_KEY) {
                console.error("RAWG API Key is missing. Make sure it's set in your .env file and server was restarted.");
                setError("API Key is missing. Cannot load games.");
                setIsLoading(false); // Use component-specific loading state
                return;
            }

            try {
                console.log("Attempting to fetch games from RAWG..."); // Log before API calls
                // Use Promise.all to fetch both lists concurrently
                const [trendingResponse, recommendedResponse] = await Promise.all([
                    // Fetch Trending Games using axios
                    axios.get(`${RAWG_API_URL}/games`, {
                        params: { key: API_KEY, ordering: '-added', page_size: 10 }
                    }),
                    // Fetch Recommended Games
                    axios.get(`${RAWG_API_URL}/games`, {
                        params: { key: API_KEY, genres: 'action', ordering: '-rating', page_size: 10 }
                    })
                ]);
                console.log("RAWG API responses received."); // Log after API calls succeed

                // Check responses and set state...
                if (trendingResponse.data && trendingResponse.data.results) {
                    setTrendingGames(formatApiData(trendingResponse.data.results));
                } else {
                    console.warn("Trending games fetch returned no results.");
                    setTrendingGames([]);
                }
                if (recommendedResponse.data && recommendedResponse.data.results) {
                    setRecommendedGames(formatApiData(recommendedResponse.data.results));
                } else {
                    console.warn("Recommended games fetch returned no results.");
                    setRecommendedGames([]);
                }
                console.log("Game states updated."); // Log after setting state

            } catch (error) {
                // --- Enhanced Error Logging ---
                console.error("Error fetching game data from RAWG:", error);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error("RAWG API Error Response Data:", error.response.data);
                    console.error("RAWG API Error Response Status:", error.response.status);
                    setError(`API Error ${error.response.status}: ${error.response.data?.detail || 'Could not fetch games.'}`);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error("RAWG API No Response:", error.request);
                    setError("Network error. Could not connect to RAWG API.");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('RAWG API Request Setup Error:', error.message);
                    setError("An unexpected error occurred while fetching games.");
                }
                setTrendingGames([]); // Clear games on error
                setRecommendedGames([]);
            } finally {
                console.log("fetchGames function finished."); // Log end of fetch attempt
                setIsLoading(false); // Ensure component-specific loading is set to false
            }
        };

        fetchGames(); // Call the async function
    }, []); // Empty array ensures this runs only once

    console.log("Rendering DiscoverPage. isLoading:", isLoading, "error:", error); // Log state before returning JSX

    // Render loading or error state using component-specific state
    if (isLoading) {
        return (
            <div>
                <h1>Game Discovery</h1>
                <h2>Loading games...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1>Game Discovery</h1>
                {/* Display the detailed error message */}
                <p style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{error}</p>
            </div>
        );
    }

    // Render content
    return (
        <div>
            <h1>Game Discovery</h1>

            {/* Featured Card (Static) */}
            <div className="featured-card">
                <h2>Featured: Path of Exile 2</h2>
                <p>
                    The sequel to the legendary ARPG is almost here. Explore a new campaign,
                    discover powerful new classes, and fight against the darkness
                    consuming Wraeclast.
                </p>
            </div>

            {/* Game Rows - Only render if games exist */}
            <section>
                <h2>Recommended For You</h2>
                {recommendedGames.length > 0 ? (
                    <GameRow title="" games={recommendedGames} />
                ) : (
                    <p>Could not load recommendations at this time.</p>
                )}
            </section>

            <section>
                <h2>Trending Now</h2>
                {trendingGames.length > 0 ? (
                    <GameRow title="" games={trendingGames} />
                ) : (
                    <p>Could not load trending games at this time.</p>
                )}
            </section>


            {/* Platform Card (Static) */}
            <div className="platform-card">
                <h2>Connect Your Platforms</h2>
                <div className="platform-list">
                    {/* Platform items... */}
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
            </div>
        </div>
    );
}

export default DiscoverPage;


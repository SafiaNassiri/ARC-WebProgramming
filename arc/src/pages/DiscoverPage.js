import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 1. Import axios
import GameRow from '../components/GameRow';
import '../Styles/DiscoverPage.css'; // Adjust path if needed
import { FaSteam, FaXbox, FaPlaystation } from 'react-icons/fa';

// Get API key from the .env file
const API_KEY = process.env.REACT_APP_RAWG_API_KEY;
const RAWG_API_URL = 'https://api.rawg.io/api'; // Base URL

function DiscoverPage() {
    const [trendingGames, setTrendingGames] = useState([]);
    const [recommendedGames, setRecommendedGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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
        const fetchGames = async () => {
            setIsLoading(true);
            setError(null); // Clear previous errors

            // Check if API key is present
            if (!API_KEY) {
                console.error("RAWG API Key is missing. Make sure it's set in your .env file.");
                setError("API Key is missing. Cannot load games.");
                setIsLoading(false);
                return;
            }

            try {
                // Use Promise.all to fetch both lists concurrently
                const [trendingResponse, recommendedResponse] = await Promise.all([
                    // Fetch Trending Games using axios
                    axios.get(`${RAWG_API_URL}/games`, {
                        params: {
                            key: API_KEY,
                            ordering: '-added', // Good proxy for trending
                            page_size: 10
                        }
                    }),
                    // Fetch Recommended Games (using a different endpoint, e.g., based on genre 'action')
                    // The game-series endpoint might not always return enough diverse results
                    axios.get(`${RAWG_API_URL}/games`, {
                         params: {
                             key: API_KEY,
                             genres: 'action', // Example: fetch action games as recommendation
                             ordering: '-rating', // Order by rating
                             page_size: 10
                         }
                    })
                ]);

                // Check if responses have data and results
                if (trendingResponse.data && trendingResponse.data.results) {
                    setTrendingGames(formatApiData(trendingResponse.data.results));
                } else {
                     console.warn("Trending games fetch returned no results.");
                     setTrendingGames([]); // Set to empty array if no results
                }

                if (recommendedResponse.data && recommendedResponse.data.results) {
                    setRecommendedGames(formatApiData(recommendedResponse.data.results));
                } else {
                    console.warn("Recommended games fetch returned no results.");
                    setRecommendedGames([]); // Set to empty array if no results
                }

            } catch (error) {
                console.error("Error fetching game data from RAWG:", error);
                // Set specific error message based on error response
                if (error.response) {
                     setError(`Error ${error.response.status}: ${error.response.data.detail || 'Could not fetch games.'}`);
                } else if (error.request) {
                     setError("Network error. Could not connect to RAWG API.");
                } else {
                    setError("An unexpected error occurred while fetching games.");
                }
                setTrendingGames([]); // Clear games on error
                setRecommendedGames([]);
            } finally {
                setIsLoading(false); // Ensure loading is set to false
            }
        };

        fetchGames();
    }, []); // Empty array ensures this runs only once

    // Render loading or error state
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
                <p style={{ color: 'red' }}>{error}</p> {/* Display the error message */}
            </div>
        );
    }

    // Render content
    return (
        <div>
            <h1>Game Discovery</h1>

            {/* Featured Card (Static) */}
            <div className="featured-card">
                 {/* ... content ... */}
                 <h2>Featured: Path of Exile 2</h2>
                 <p>
                     The sequel to the legendary ARPG is almost here. Explore a new campaign,
                     discover powerful new classes, and fight against the darkness
                     consuming Wraeclast.
                 </p>
            </div>

             {/* Game Rows - Only render if games exist */}
            {recommendedGames.length > 0 ? (
                <GameRow title="Recommended For You" games={recommendedGames} />
            ) : (
                <div>
                     <h2>Recommended For You</h2>
                     <p>Could not load recommendations at this time.</p>
                </div>
            )}
             {trendingGames.length > 0 ? (
                <GameRow title="Trending Now" games={trendingGames} />
             ) : (
                 <div>
                     <h2>Trending Now</h2>
                     <p>Could not load trending games at this time.</p>
                 </div>
             )}


            {/* Platform Card (Static) */}
            <div className="platform-card">
                {/* ... content ... */}
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
            </div>
        </div>
    );
}

export default DiscoverPage;

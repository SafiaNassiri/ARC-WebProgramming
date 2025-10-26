/**
 * A dynamic page that fetches and displays trending and recommended
 * games from the RAWG API, along with featured and platform sections.
 *
 * Part of the A.R.C. (Archive. Record. Connect.) application, this page showcases popular and personalized game recommendations fetched via the RAWG API. It includes robust error handling, loading states, and static sections for featured content and platform integration.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GameRow from '../components/GameRow';
import '../Styles/DiscoverPage.css';
import { FaSteam, FaXbox, FaPlaystation } from 'react-icons/fa';

// RAWG API Configuration 
const API_KEY = process.env.REACT_APP_RAWG_API_KEY;
const RAWG_API_URL = 'https://api.rawg.io/api';

// Formats API data from RAWG into a simplified structure compatible with the `GameRow` component.
const formatApiData = (apiGames) => {
    if (!Array.isArray(apiGames)) return [];
    return apiGames.map((game) => ({
        id: game.id,
        title: game.name,
        description: game.rating
            ? `Rating: ${game.rating.toFixed(1)} / 5.0`
            : 'No rating available',
        imageUrl: game.background_image,
    }));
};

// Fetches trending and recommended games from RAWG API and displays them in scrollable game rows.
function DiscoverPage() {
    const [trendingGames, setTrendingGames] = useState([]);
    const [recommendedGames, setRecommendedGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetches trending and recommended games from the RAWG API.
    useEffect(() => {
        const fetchGames = async () => {
            setIsLoading(true);
            setError(null);

            if (!API_KEY) {
                setError('Missing RAWG API Key. Please configure it in your .env file.');
                setIsLoading(false);
                return;
            }

            try {
                const [trendingRes, recommendedRes] = await Promise.all([
                    axios.get(`${RAWG_API_URL}/games`, {
                        params: { key: API_KEY, ordering: '-added', page_size: 10 },
                    }),
                    axios.get(`${RAWG_API_URL}/games`, {
                        params: { key: API_KEY, genres: 'action', ordering: '-rating', page_size: 10 },
                    }),
                ]);

                setTrendingGames(formatApiData(trendingRes.data?.results || []));
                setRecommendedGames(formatApiData(recommendedRes.data?.results || []));
            } catch (err) {
                if (err.response) {
                    setError(
                        `API Error ${err.response.status}: ${
                            err.response.data?.detail || 'Unable to fetch games.'
                        }`
                    );
                } else if (err.request) {
                    setError('Network error. Could not connect to RAWG API.');
                } else {
                    setError('Unexpected error while fetching games.');
                }
                setTrendingGames([]);
                setRecommendedGames([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGames();
    }, []);

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

    // Page Content
    return (
        <main className="discover-page">
            <h1>Game Discovery</h1>
            <section className="featured-card">
                <h2>Featured: Path of Exile 2</h2>
                <p>
                    The sequel to the legendary ARPG is almost here. Explore a new campaign,
                    discover powerful new classes, and battle the darkness consuming Wraeclast.
                </p>
            </section>
            <section>
                <h2>Recommended For You</h2>
                {recommendedGames.length > 0 ? (
                    <GameRow title="" games={recommendedGames} />
                ) : (
                    <p>No recommended games available at this time.</p>
                )}
            </section>
            <section>
                <h2>Trending Now</h2>
                {trendingGames.length > 0 ? (
                    <GameRow title="" games={trendingGames} />
                ) : (
                    <p>No trending games available right now.</p>
                )}
            </section>
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

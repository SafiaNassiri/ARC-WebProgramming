import React, { useState, useEffect } from 'react';
import GameRow from '../components/GameRow';
import '../Styles/DiscoverPage.css';
import { FaSteam, FaXbox, FaPlaystation } from 'react-icons/fa';

// Get API key from the .env file
const API_KEY = process.env.REACT_APP_RAWG_API_KEY;

function DiscoverPage() {
    // State to hold our "Trending" games
    const [trendingGames, setTrendingGames] = useState([]);
    // State to hold our "Recommended" games
    const [recommendedGames, setRecommendedGames] = useState([]);
    // State to manage loading
    const [isLoading, setIsLoading] = useState(true);

    // This converts the API data into the format our <Card> component expects
    const formatApiData = (apiGames) => {
        return apiGames.map(game => ({
            id: game.id,
            title: game.name,
            description: `Rating: ${game.rating} / 5.0`,
            imageUrl: game.background_image
        }));
    };

    useEffect(() => {
        const fetchGames = async () => {
            setIsLoading(true);

            try {
                // Fetch Trending Games
                const trendingResponse = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&ordering=-added&page_size=10`);
                const trendingData = await trendingResponse.json();
                setTrendingGames(formatApiData(trendingData.results));

                // Fetch Recommended Games
                const recommendedResponse = await fetch(`https://api.rawg.io/api/games/path-of-exile/game-series?key=${API_KEY}`);
                const recommendedData = await recommendedResponse.json();
                setRecommendedGames(formatApiData(recommendedData.results));

            } catch (error) {
                console.error("Error fetching game data:", error);
            }

            setIsLoading(false);
        };

        fetchGames();
    }, []); // The empty array [] means this runs only ONCE when the page loads

    //Render a loading message
    if (isLoading) {
        return (
            <div>
                <h1>Game Discovery</h1>
                <h2>Loading games...</h2>
            </div>
        );
    }

    return (
        <div>
            <h1>Game Discovery</h1>

            <div className="featured-card">
                <h2>Featured: Path of Exile 2</h2>
                <p>
                    The sequel to the legendary ARPG is almost here. Explore a new campaign,
                    discover powerful new classes, and fight against the darkness
                    consuming Wraeclast.
                </p>
            </div>

            <GameRow title="Recommended For You" games={recommendedGames} />
            <GameRow title="Trending Now" games={trendingGames} />

            <div className="platform-card">
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
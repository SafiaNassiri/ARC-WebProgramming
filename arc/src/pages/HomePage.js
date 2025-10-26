import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import axios from 'axios'; // Import axios
import '../Styles/HomePage.css'; // Adjust path if needed
import GameRow from '../components/GameRow';
import PostCard from '../components/PostCard';
import { useAuth } from '../contexts/AuthContext';
import { FaCircle } from 'react-icons/fa';

// Get API key from the .env file
const API_KEY = process.env.REACT_APP_RAWG_API_KEY; // Get API Key
const RAWG_API_URL = 'https://api.rawg.io/api';

// Placeholder Data (Keep these static for now)
const onlineFriends = [
    { id: 1, name: 'Wraeclast' },
    { id: 2, name: 'Porter' },
];

const recommendedForums = [
    { id: 1, name: '# Death Stranding' },
    { id: 2, name: '# Hellblade' },
    { id: 3, name: '# Looking for Group (LFG)' },
];
// ------------------------

function HomePage() {
    const { user, posts, loading: authLoading } = useAuth(); // Renamed auth loading

    // --- State for Trending Games ---
    const [trendingGames, setTrendingGames] = useState([]);
    const [gamesLoading, setGamesLoading] = useState(true); // Loading state for games
    const [gamesError, setGamesError] = useState(null); // Error state for games
    //-------------------------------------

    // Filter for hot discussions (ensure posts is an array)
    const hotDiscussions = Array.isArray(posts) ? posts.slice(0, 2) : [];

    // --- Function to format API data ---
    const formatApiData = (apiGames) => {
        if (!Array.isArray(apiGames)) return [];
        return apiGames.map(game => ({
            id: game.id,
            title: game.name,
            description: game.rating ? `Rating: ${game.rating.toFixed(1)} / 5.0` : 'No rating',
            imageUrl: game.background_image
        }));
    };
    //----------------------------------------

    // --- useEffect to fetch trending games ---
    useEffect(() => {
        const fetchTrendingGames = async () => {
            setGamesLoading(true); // Start loading games
            setGamesError(null); // Clear previous errors

            // Check if API key is available
            if (!API_KEY) {
                console.error("RAWG API Key missing for Homepage.");
                setGamesError("API Key missing. Cannot load trending games.");
                setGamesLoading(false); // Stop loading
                return;
            }

            try {
                // Fetch games from RAWG API using axios
                const response = await axios.get(`${RAWG_API_URL}/games`, {
                    params: {
                        key: API_KEY,
                        ordering: '-added', // Sort by recently added (proxy for trending)
                        page_size: 10 // Fetch 10 games
                    }
                });
                // Check if the response contains the expected data structure
                if (response.data && response.data.results) {
                    setTrendingGames(formatApiData(response.data.results));
                } else {
                    // Handle cases where results might be missing
                    console.warn("No results found in trending games response.");
                    setTrendingGames([]);
                }
            } catch (error) {
                // Handle errors during the API call
                console.error("Error fetching trending games for Homepage:", error);
                if (error.response) {
                    // Error from the API server (e.g., 4xx, 5xx)
                    setGamesError(`Error ${error.response.status}: Could not fetch trending games.`);
                } else if (error.request) {
                    // Network error (e.g., cannot reach server)
                    setGamesError("Network error fetching trending games.");
                } else {
                    // Other unexpected errors
                    setGamesError("An unexpected error occurred while fetching trending games.");
                }
                setTrendingGames([]); // Clear games state on error
            } finally {
                // Ensure loading state is turned off regardless of success or failure
                setGamesLoading(false);
            }
        };

        fetchTrendingGames(); // Call the fetch function
    }, []); // Empty dependency array ensures this runs only once when the component mounts
    //-------------------------------------------


    // Show main loading state if auth isn't ready
    // This blocks rendering until the initial user check is complete
    if (authLoading) {
        return <div>Loading dashboard...</div>;
    }


    return (
        <div>
            <div className="home-layout">

                {/* --- Main Feed (Left Column) --- */}
                <main className="home-feed">

                    {/* Welcome Box */}
                    <div className="welcome-box">
                        {/* Display username from context, fallback to 'Gamer' */}
                        <h2>Welcome Back, {user ? user.username : 'Gamer'}!</h2>
                        <p>Here's what's new in your gaming world.</p>
                    </div>

                    {/* Trending Games Section - Conditional Rendering based on game loading/error state */}
                    <section> {/* Wrap GameRow or its alternatives in a section */}
                        <h2>Trending Games</h2>
                        {gamesLoading ? (
                            <p>Loading trending games...</p> // Show loading text
                        ) : gamesError ? (
                            <p style={{ color: 'var(--accent-primary)' }}>{gamesError}</p> // Show error message
                        ) : trendingGames.length > 0 ? (
                            // Pass the fetched trendingGames state to GameRow
                            <GameRow title="" games={trendingGames} /> // Title is redundant here
                        ) : (
                            <p>Could not load trending games at this time.</p> // Fallback if no games & no error
                        )}
                    </section>


                    {/* Hot Discussions Feed */}
                    <section> {/* Wrap discussions in a section */}
                        <h2>Hot Discussions</h2>
                        {/* Check if hotDiscussions array has items */}
                        {hotDiscussions.length > 0 ? (
                            hotDiscussions.map(post => (
                                // Ensure PostCard uses a stable key like _id from MongoDB
                                <PostCard key={post._id || post.id} post={post} />
                            ))
                        ) : (
                            <p>No discussions yet.</p> // Message if no posts fetched or available
                        )}
                    </section>

                </main>

                {/* --- Sidebar (Right Column - static placeholders) --- */}
                <aside className="home-sidebar">
                    {/* Recommended Forums Card */}
                    <div className="sidebar-card">
                        <div className="sidebar-card-header">
                            <h3>Recommended Forums</h3>
                        </div>
                        <ul className="sidebar-card-list">
                            {recommendedForums.map(forum => (
                                <li key={forum.id}>{forum.name}</li>
                            ))}
                            {/* Add message if list is empty */}
                            {recommendedForums.length === 0 && <li>No recommendations.</li>}
                        </ul>
                    </div>
                    {/* Online Friends Card */}
                    <div className="sidebar-card">
                        <div className="sidebar-card-header">
                            <h3>Online Friends</h3>
                        </div>
                        <ul className="sidebar-card-list">
                            {onlineFriends.map(friend => (
                                <li key={friend.id} className="friend-item">
                                    <div className="friend-info">
                                        <div className="friend-avatar-placeholder"></div>
                                        <span>{friend.name}</span>
                                    </div>
                                    <FaCircle className="friend-status" />
                                </li>
                            ))}
                            {/* Message if no friends online */}
                            {onlineFriends.length === 0 && <li style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>No friends online.</li>}
                        </ul>
                    </div>
                </aside>

            </div>
        </div>
    );
}

export default HomePage;


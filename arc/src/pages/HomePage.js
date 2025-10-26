import React, { useState, useEffect } from 'react'; // 1. Import useState and useEffect
import axios from 'axios'; // 2. Import axios
import '../Styles/HomePage.css'; // Adjust path if needed
import GameRow from '../components/GameRow';
import PostCard from '../components/PostCard';
import { useAuth } from '../contexts/AuthContext';
import { FaCircle } from 'react-icons/fa';

// Get API key from the .env file
const API_KEY = process.env.REACT_APP_RAWG_API_KEY; // 3. Get API Key
const RAWG_API_URL = 'https://api.rawg.io/api';

// --- REMOVED Placeholder Data for trendingGames ---
// const trendingGames = [ ... ];

// Placeholder Data (Keep these for now)
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
    const { user, posts, loading: authLoading } = useAuth(); // Renamed loading to avoid conflict

    // --- NEW: State for Trending Games ---
    const [trendingGames, setTrendingGames] = useState([]);
    const [gamesLoading, setGamesLoading] = useState(true);
    const [gamesError, setGamesError] = useState(null);
    //-------------------------------------

    // Filter for hot discussions (ensure posts is an array)
    const hotDiscussions = Array.isArray(posts) ? posts.slice(0, 2) : [];

    // --- NEW: Function to format API data ---
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

    // --- NEW: useEffect to fetch trending games ---
    useEffect(() => {
        const fetchTrendingGames = async () => {
            setGamesLoading(true);
            setGamesError(null);

            if (!API_KEY) {
                console.error("RAWG API Key missing for Homepage.");
                setGamesError("API Key missing. Cannot load trending games.");
                setGamesLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${RAWG_API_URL}/games`, {
                    params: {
                        key: API_KEY,
                        ordering: '-added', // Or '-rating', '-metacritic'
                        page_size: 10 // Fetch 10 games
                    }
                });
                if (response.data && response.data.results) {
                    setTrendingGames(formatApiData(response.data.results));
                } else {
                    setTrendingGames([]);
                }
            } catch (error) {
                console.error("Error fetching trending games for Homepage:", error);
                if (error.response) {
                    setGamesError(`Error ${error.response.status}: Could not fetch trending games.`);
                } else if (error.request) {
                    setGamesError("Network error fetching trending games.");
                } else {
                    setGamesError("Error fetching trending games.");
                }
                setTrendingGames([]);
            } finally {
                setGamesLoading(false);
            }
        };

        fetchTrendingGames();
    }, []); // Runs once on component mount
    //-------------------------------------------


    // Show loading state for auth
    if (authLoading && !user) {
        return <div>Loading dashboard...</div>
    }


    return (
        <div>
            <div className="home-layout">

                {/* --- Main Feed (Left Column) --- */}
                <main className="home-feed">

                    {/* Welcome Box */}
                    <div className="welcome-box">
                        <h2>Welcome Back, {user ? user.username : 'Gamer'}!</h2>
                        <p>Here's what's new in your gaming world.</p>
                    </div>

                    {/* Trending Games Row - Now uses state */}
                    {gamesLoading ? (
                        <div>
                            <h2>Trending Games</h2>
                            <p>Loading trending games...</p>
                        </div>
                    ) : gamesError ? (
                        <div>
                            <h2>Trending Games</h2>
                            <p style={{ color: 'red' }}>{gamesError}</p>
                        </div>
                    ) : (
                        // Pass the fetched trendingGames state
                        <GameRow title="Trending Games" games={trendingGames} />
                    )}


                    {/* Hot Discussions Feed */}
                    <h2>Hot Discussions</h2>
                    {hotDiscussions.length > 0 ? (
                        hotDiscussions.map(post => (
                            <PostCard key={post._id || post.id} post={post} />
                        ))
                    ) : (
                        <p>No discussions yet.</p> // Message if no posts
                    )}

                </main>

                {/* --- Sidebar (Right Column - unchanged) --- */}
                <aside className="home-sidebar">
                    <div className="sidebar-card">
                        <div className="sidebar-card-header">
                            <h3>Recommended Forums</h3>
                        </div>
                        <ul className="sidebar-card-list">
                            {recommendedForums.map(forum => (
                                <li key={forum.id}>{forum.name}</li>
                            ))}
                        </ul>
                    </div>
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
                            {onlineFriends.length === 0 && <li style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>No friends online.</li>}
                        </ul>
                    </div>
                </aside>

            </div>
        </div>
    );
}

export default HomePage;


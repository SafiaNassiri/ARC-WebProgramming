/**
 * Dashboard page displaying trending games, hot discussions, online friends, and recommended forums for the logged-in user.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GameRow from '../components/GameRow';
import PostCard from '../components/PostCard';
import { useAuth } from '../contexts/AuthContext';
import '../Styles/HomePage.css';
import { FaCircle } from 'react-icons/fa';

// API Config 
const API_KEY = process.env.REACT_APP_RAWG_API_KEY;
const RAWG_API_URL = 'https://api.rawg.io/api';

// Static Placeholder Data 
const onlineFriends = [
    { id: 1, name: 'Wraeclast' },
    { id: 2, name: 'Porter' },
];

const recommendedForums = [
    { id: 1, name: '# Death Stranding' },
    { id: 2, name: '# Hellblade' },
    { id: 3, name: '# Looking for Group (LFG)' },
];

// Displays trending games, hot discussions, online friends, and recommended forums for the user.
function HomePage() {
    const { user, posts, loading: authLoading } = useAuth();

    // State: Trending Games 
    const [trendingGames, setTrendingGames] = useState([]);
    const [gamesLoading, setGamesLoading] = useState(true);
    const [gamesError, setGamesError] = useState(null);

    // Hot Discussions (Top 2 posts) 
    const hotDiscussions = Array.isArray(posts) ? posts.slice(0, 2) : [];

    // Format RAWG API data to a simplified structure for GameRow
    const formatApiData = (apiGames) => {
        if (!Array.isArray(apiGames)) return [];
        return apiGames.map((game) => ({
            id: game.id,
            title: game.name,
            description: game.rating ? `Rating: ${game.rating.toFixed(1)} / 5.0` : 'No rating',
            imageUrl: game.background_image,
        }));
    };

    // Fetch Trending Games from RAWG API 
    useEffect(() => {
        const fetchTrendingGames = async () => {
            setGamesLoading(true);
            setGamesError(null);

            if (!API_KEY) {
                console.error('RAWG API Key missing for HomePage.');
                setGamesError('API Key missing. Cannot load trending games.');
                setGamesLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${RAWG_API_URL}/games`, {
                    params: { key: API_KEY, ordering: '-added', page_size: 10 },
                });

                const results = response.data?.results || [];
                setTrendingGames(formatApiData(results));
            } catch (error) {
                console.error('Error fetching trending games:', error);
                if (error.response) {
                    setGamesError(`Error ${error.response.status}: Could not fetch trending games.`);
                } else if (error.request) {
                    setGamesError('Network error fetching trending games.');
                } else {
                    setGamesError('Unexpected error fetching trending games.');
                }
                setTrendingGames([]);
            } finally {
                setGamesLoading(false);
            }
        };

        fetchTrendingGames();
    }, []);

    // Show loading state until auth is ready 
    if (authLoading) return <div>Loading dashboard...</div>;

    return (
        <div className="home-layout">
            <main className="home-feed">
                <div className="welcome-box">
                    <h2>Welcome Back, {user?.username || 'Gamer'}!</h2>
                    <p>Here's what's new in your gaming world.</p>
                </div>
                <section>
                    <h2>Trending Games</h2>
                    {gamesLoading ? (
                        <p>Loading trending games...</p>
                    ) : gamesError ? (
                        <p className="error-message">{gamesError}</p>
                    ) : trendingGames.length > 0 ? (
                        <GameRow title="" games={trendingGames} />
                    ) : (
                        <p>Could not load trending games at this time.</p>
                    )}
                </section>
                <section>
                    <h2>Hot Discussions</h2>
                    {hotDiscussions.length > 0 ? (
                        hotDiscussions.map((post) => (
                            <PostCard key={post._id || post.id} post={post} />
                        ))
                    ) : (
                        <p>No discussions yet.</p>
                    )}
                </section>
            </main>
            <aside className="home-sidebar">
                <div className="sidebar-card">
                    <div className="sidebar-card-header">
                        <h3>Recommended Forums</h3>
                    </div>
                    <ul className="sidebar-card-list">
                        {recommendedForums.map((forum) => (
                            <li key={forum.id}>{forum.name}</li>
                        ))}
                        {recommendedForums.length === 0 && <li>No recommendations.</li>}
                    </ul>
                </div>
                <div className="sidebar-card">
                    <div className="sidebar-card-header">
                        <h3>Online Friends</h3>
                    </div>
                    <ul className="sidebar-card-list">
                        {onlineFriends.map((friend) => (
                            <li key={friend.id} className="friend-item">
                                <div className="friend-info">
                                    <div className="friend-avatar-placeholder"></div>
                                    <span>{friend.name}</span>
                                </div>
                                <FaCircle className="friend-status" />
                            </li>
                        ))}
                        {onlineFriends.length === 0 && (
                            <li style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                                No friends online.
                            </li>
                        )}
                    </ul>
                </div>
            </aside>
        </div>
    );
}

export default HomePage;
import React, { useState } from 'react'; // Added useEffect for potential future use
import Card from '../components/Card'; // For the game library
import PostCard from '../components/PostCard'; // For the user's posts
import { useAuth } from '../contexts/AuthContext'; // <-- IMPORT useAuth
import '../Styles/ProfilePage.css'; // Adjust path if needed

import { FaGamepad, FaTrophy, FaPenSquare, FaCheckCircle } from 'react-icons/fa';

// --- REMOVED Placeholder Data for Library & Posts ---
// const myLibrary = [ ... ];
// const myPosts = [ ... ];

// Placeholder Data for Achievements (We'll make these dynamic later)
const myAchievements = [
    { id: 1, title: 'Wraeclast Wanderer', game: 'Path of Exile' },
    { id: 2, title: 'Great Deliverer', game: 'Death Stranding' },
    { id: 3, title: 'The Last Hidden One', game: 'AC: Mirage' },
    { id: 4, title: 'Platinum', game: 'Elden Ring' },
];
// ------------------------------------

function ProfilePage() {
    const [activeTab, setActiveTab] = useState('library');
    const { user, favoriteGames, posts } = useAuth(); // <-- GET user, favoriteGames, and posts from context

    // --- UPDATED RENDER FUNCTION ---
    const renderTabContent = () => {
        switch (activeTab) {
            case 'library':
                return (
                    <div className="profile-game-library">
                        {/* Check if there are any favorite games */}
                        {favoriteGames.length > 0 ? (
                            // Map over the REAL favoriteGames from the context
                            favoriteGames.map(game => (
                                <Card
                                    key={game.gameId} // Use gameId as key
                                    // Pass the whole game object to Card
                                    // Card.js expects `game.name` and `game.image` from DB
                                    game={game}
                                />
                            ))
                        ) : (
                            // Show a message if no games are favorited yet
                            <p>You haven't added any favorite games yet. Go discover some!</p>
                        )}
                    </div>
                );
            case 'achievements':
                // This section still uses placeholder data
                return (
                    <div className="achievements-grid">
                        {myAchievements.map(ach => (
                            <div key={ach.id} className="achievement-card">
                                <FaCheckCircle className="achievement-icon" />
                                <div className="achievement-info">
                                    <h3 className="achievement-title">{ach.title}</h3>
                                    <p className="achievement-game">{ach.game}</p>
                                </div>
                            </div>
                        ))}
                        {/* Optional: Message if no achievements */}
                        {myAchievements.length === 0 && <p>No achievements to display yet.</p>}
                    </div>
                );
            case 'posts':
                // Filter posts to show only the logged-in user's posts
                const userPosts = posts.filter(post => post.user === user?._id);
                return (
                    <div className="my-posts-feed">
                        {userPosts.length > 0 ? (
                            userPosts.map(post => (
                                <PostCard key={post._id} post={post} />
                            ))
                        ) : (
                            <p>You haven't made any posts yet.</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    // Show loading state if user data hasn't loaded yet (optional but good practice)
    if (!user) {
        return <div>Loading profile...</div>; // Or a spinner component
    }

    return (
        <div>
            {/* --- Profile Header --- */}
            <div className="profile-header">
                <div className="profile-avatar">
                    {/* Later: Add user's actual avatar if available */}
                </div>
                <div className="profile-info">
                    {/* Use the username from the context */}
                    <h1 className="profile-username">{user.username}</h1>
                    {/* Use the bio from the context if it exists */}
                    <p className="profile-bio">
                        {user.bio || 'No bio yet. Add one in Settings!'}
                    </p>
                </div>
            </div>

            {/* --- Tab Navigation --- */}
            <nav className="profile-tabs">
                <button
                    className={`profile-tab-button ${activeTab === 'library' ? 'active' : ''}`}
                    onClick={() => setActiveTab('library')}
                >
                    <FaGamepad /> <span>Game Library ({favoriteGames.length})</span> {/* Show count */}
                </button>
                <button
                    className={`profile-tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
                    onClick={() => setActiveTab('achievements')}
                >
                    <FaTrophy /> <span>Achievements</span>
                </button>
                <button
                    className={`profile-tab-button ${activeTab === 'posts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('posts')}
                >
                    <FaPenSquare /> <span>My Posts</span>
                </button>
            </nav>

            {/* --- Tab Content Area --- */}
            <div className="profile-tab-content">
                {renderTabContent()}
            </div>

        </div>
    );
}

export default ProfilePage;


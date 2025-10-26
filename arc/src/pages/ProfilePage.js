/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: October 2025
 * Displays the user's profile including game library, achievements, and posts.
 * Users can switch between tabs to view different sections of their profile.
 */

import React, { useState } from 'react';
import Card from '../components/Card';
import PostCard from '../components/PostCard';
import { useAuth } from '../contexts/AuthContext';
import '../Styles/ProfilePage.css';
import { FaGamepad, FaTrophy, FaPenSquare, FaCheckCircle } from 'react-icons/fa';

// Placeholder achievements (to be replaced with dynamic data later)
const myAchievements = [
    { id: 1, title: 'Wraeclast Wanderer', game: 'Path of Exile' },
    { id: 2, title: 'Great Deliverer', game: 'Death Stranding' },
    { id: 3, title: 'The Last Hidden One', game: 'AC: Mirage' },
    { id: 4, title: 'Platinum', game: 'Elden Ring' },
];

// ProfilePage Component
function ProfilePage() {
    const [activeTab, setActiveTab] = useState('library');
    const { user, favoriteGames, posts } = useAuth();

    // Renders the content for the currently active tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'library':
                return (
                    <div className="profile-game-library">
                        {favoriteGames.length > 0 ? (
                            favoriteGames.map(game => (
                                <Card key={game.gameId} game={game} />
                            ))
                        ) : (
                            <p>You haven't added any favorite games yet. Go discover some!</p>
                        )}
                    </div>
                );

            case 'achievements':
                return (
                    <div className="achievements-grid">
                        {myAchievements.length > 0 ? (
                            myAchievements.map(ach => (
                                <div key={ach.id} className="achievement-card">
                                    <FaCheckCircle className="achievement-icon" />
                                    <div className="achievement-info">
                                        <h3 className="achievement-title">{ach.title}</h3>
                                        <p className="achievement-game">{ach.game}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No achievements to display yet.</p>
                        )}
                    </div>
                );

            case 'posts':
                const userPosts = Array.isArray(posts)
                    ? posts.filter(post => post.user === user?._id)
                    : [];
                return (
                    <div className="my-posts-feed">
                        {userPosts.length > 0 ? (
                            userPosts.map(post => <PostCard key={post._id} post={post} />)
                        ) : (
                            <p>You haven't made any posts yet.</p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    if (!user) {
        return <div>Loading profile...</div>;
    }

    return (
        <div>
            <div className="profile-header">
                <div className="profile-avatar">
                    {/* TODO: Add user's avatar */}
                </div>
                <div className="profile-info">
                    <h1 className="profile-username">{user.username}</h1>
                    <p className="profile-bio">
                        {user.bio || 'No bio yet. Add one in Settings!'}
                    </p>
                </div>
            </div>
            <nav className="profile-tabs">
                <button
                    className={`profile-tab-button ${activeTab === 'library' ? 'active' : ''}`}
                    onClick={() => setActiveTab('library')}
                >
                    <FaGamepad /> <span>Game Library ({favoriteGames.length})</span>
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
            <div className="profile-tab-content">{renderTabContent()}</div>
        </div>
    );
}

export default ProfilePage;
